from feature_extractor import extract_features
from anomaly_detector import AnomalyDetector
from risk_assessor import calculate_risk


def create_normal_events():

    events = []

    endpoints = [
        "/login",
        "/api/profile",
        "/api/dashboard",
        "/api/transactions",
        "/api/settings"
    ]

    for i in range(30):

        endpoint = endpoints[i % len(endpoints)]

        is_login = endpoint == "/login"

        events.append({
            "timestamp": "2026-10-05T12:00:00",
            "user_id": "user_101",
            "ip": "192.168.1.20",
            "event_type": "login" if is_login else "api_request",
            "endpoint": endpoint,
            "method": "POST" if is_login else "GET",
            "status_code": 200,
            "response_time": 170 + (i % 30),
            "success": True
        })

    return events

def create_suspicious_events():

    events = []

    # Large number of requests
    for i in range(350):

        events.append({
            "timestamp": "2026-10-05T12:05:00",
            "user_id": "user_999",
            "ip": "10.10.10.50",
            "event_type": "login",
            "endpoint": "/login",
            "method": "POST",
            "status_code": 401,
            "response_time": 900,
            "success": False
        })

    return events


detector = AnomalyDetector()

if not detector.load():

    print("ERROR: Model not found.")
    print("Run train_model.py first.")
    exit()


# =========================
# NORMAL TEST
# =========================

normal_events = create_normal_events()

normal_features = extract_features(
    normal_events
)

prediction, score = detector.predict(
    normal_features
)

normal_assessment = calculate_risk(
    normal_features,
    prediction[0],
    score[0]
)


print("\n==============================")
print("NORMAL BEHAVIOUR")
print("==============================")

print(normal_assessment)


# =========================
# SUSPICIOUS TEST
# =========================

suspicious_events = create_suspicious_events()

suspicious_features = extract_features(
    suspicious_events
)

prediction, score = detector.predict(
    suspicious_features
)

suspicious_assessment = calculate_risk(
    suspicious_features,
    prediction[0],
    score[0]
)


print("\n==============================")
print("SUSPICIOUS BEHAVIOUR")
print("==============================")

print(suspicious_assessment)