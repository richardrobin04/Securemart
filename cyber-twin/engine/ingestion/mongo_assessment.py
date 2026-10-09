
from collections import Counter
from recommendations import generate_recommendations
from ingestion.mongo_reader import get_recent_events
from ingestion.mongo_adapter import (
    normalize_mongo_events,
    extract_security_alerts,
)

from feature_extractor import extract_features
from anomaly_detector import AnomalyDetector
from risk_assessor import calculate_risk
from twin.twin_state import CyberTwin


def assess_recent_mongo_events(limit=100):
    # 1. Fetch recent MongoDB documents.
    documents = get_recent_events(limit=limit)

    # 2. Separate security alerts from ordinary events.
    alerts = extract_security_alerts(documents)

    # The reader returns newest-first, so sort alerts chronologically.
    alerts.sort(key=lambda alert: alert["timestamp"])

    # 3. Normalize events for the existing ML pipeline.
    events = normalize_mongo_events(documents)

    if not events:
        return {
            "message": "No assessable events found.",
            "events_received": len(documents),
            "events_normalized": 0,
            "security_alerts": {
                "total": len(alerts),
                "by_severity": dict(
                    Counter(alert["severity"] for alert in alerts)
                ),
                "by_threat_type": dict(
                    Counter(alert["threat_type"] for alert in alerts)
                ),
                "latest_alert": alerts[-1] if alerts else None,
            },
        }

    # 4. Extract features using the existing feature extractor.
    features = extract_features(events)

    if features.empty:
        return {
            "message": "Feature extraction returned no data.",
            "events_received": len(documents),
            "events_normalized": len(events),
        }

    # 5. Load and run the existing trained anomaly detector.
    detector = AnomalyDetector()

    if not detector.load():
        raise RuntimeError(
            "AI model could not be loaded. "
            "Check models/anomaly_model.pkl."
        )

    prediction, anomaly_score = detector.predict(features)

    # 6. Build the Cyber Twin baseline from chronological events.
    baseline_twin = CyberTwin()

    for event in events[:-1]:
        baseline_twin.analyse_event(event)

    # 7. Compare the latest event against the prior baseline.
    latest_event = events[-1]

    latest_twin_analysis = {
        "user": baseline_twin.check_user_behaviour(latest_event),
        "api": baseline_twin.check_api_behaviour(latest_event),
    }

    # 8. Calculate risk using the existing rules and ML result.
    assessment = calculate_risk(
        features,
        prediction[0],
        anomaly_score[0],
        twin_analysis=latest_twin_analysis,
    )
    #Recommendations

    recommendations = generate_recommendations(
        assessment,
        {
            "total": len(alerts),
            "by_threat_type": dict(
                Counter(alert["threat_type"] for alert in alerts)
            ),
        },
    )

    # 9. Return security alerts separately from the ML event features.
    return {
        "events_received": len(documents),
        "events_normalized": len(events),
        "events_used_for_assessment": len(events),
        "features": features.to_dict(orient="records")[0],
        "latest_event": latest_event,
        "latest_event_twin_analysis": latest_twin_analysis,
        "cyber_twin_summary": baseline_twin.get_summary(),
        "security_alerts": {
            "total": len(alerts),
            "by_severity": dict(
                Counter(alert["severity"] for alert in alerts)
            ),
            "by_threat_type": dict(
                Counter(alert["threat_type"] for alert in alerts)
            ),
            "latest_alert": alerts[-1] if alerts else None,
        },
        "assessment": assessment,"recommendations": recommendations,
    }