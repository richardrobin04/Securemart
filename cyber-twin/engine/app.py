
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from feature_extractor import extract_features
from anomaly_detector import AnomalyDetector
from risk_assessor import calculate_risk
from ingestion.mongo_assessment import assess_recent_mongo_events


app = FastAPI(
    title="Cyber Twin AI Risk Engine",
    version="2.1"
)

detector = AnomalyDetector()
model_loaded = detector.load()


class SecurityEvent(BaseModel):
    timestamp: str
    user_id: str
    ip: str
    event_type: str
    endpoint: str
    method: str
    status_code: int
    response_time: float
    success: bool


@app.get("/")
def home():
    return {
        "message": "Cyber Twin AI Risk Engine is running",
        "model_loaded": model_loaded
    }


@app.post("/assess")
def assess(events: List[SecurityEvent]):
    if not model_loaded:
        raise HTTPException(
            status_code=503,
            detail="AI model has not been trained yet."
        )

    event_data = [
        event.model_dump()
        for event in events
    ]

    features = extract_features(event_data)

    if features.empty:
        raise HTTPException(
            status_code=400,
            detail="No events received."
        )

    prediction, anomaly_score = detector.predict(features)

    assessment = calculate_risk(
        features,
        prediction[0],
        anomaly_score[0]
    )

    return {
        "features": features.to_dict(
            orient="records"
        )[0],
        "assessment": assessment
    }


@app.post("/assess/recent")
def assess_recent(limit: int = 100):
    if limit < 1 or limit > 1000:
        raise HTTPException(
            status_code=400,
            detail="limit must be between 1 and 1000."
        )

    try:
        return assess_recent_mongo_events(limit=limit)

    except Exception as error:
        # Log the detailed error on the server, but avoid
        # returning database connection details to API clients.
        print(f"MongoDB assessment failed: {error}")

        raise HTTPException(
            status_code=500,
            detail="Could not assess recent MongoDB events. "
                   "Check the engine terminal logs."
        )