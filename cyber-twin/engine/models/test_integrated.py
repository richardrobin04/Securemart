from feature_extractor import extract_features
from anomaly_detector import AnomalyDetector
from risk_assessor import calculate_risk
from twin.twin_state import CyberTwin


# -------------------------
# INITIALIZE
# -------------------------

detector = AnomalyDetector()

if not detector.load():

    print("ERROR: AI model not found.")
    exit()


twin = CyberTwin()


# -------------------------
# ESTABLISH USER BASELINE
# -------------------------

baseline_events = []

for i in range(30):

    baseline_events.append({

        "timestamp":
            "2026-10-05T12:00:00",

        "user_id":
            "user_101",

        "ip":
            "192.168.1.20",

        "event_type":
            "api_request",

        "endpoint":
            "/api/dashboard",

        "method":
            "GET",

        "status_code":
            200,

        "response_time":
            150,

        "success":
            True
    })


for event in baseline_events:

    twin.process_event(event)


# -------------------------
# SUSPICIOUS ACTIVITY
# -------------------------

suspicious_events = []

for i in range(350):

    suspicious_events.append({

        "timestamp":
            "2026-10-05T12:05:00",

        "user_id":
            "user_101",

        "ip":
            "10.10.10.50",

        "event_type":
            "login",

        "endpoint":
            "/api/admin",

        "method":
            "GET",

        "status_code":
            401,

        "response_time":
            900,

        "success":
            False
    })


# -------------------------
# AI ANALYSIS
# -------------------------

features = extract_features(
    suspicious_events
)

prediction, score = detector.predict(
    features
)


# -------------------------
# CYBER TWIN ANALYSIS
# -------------------------

twin_analysis = twin.analyse_event(
    suspicious_events[0]
)


# -------------------------
# FINAL ASSESSMENT
# -------------------------

assessment = calculate_risk(

    features,

    prediction[0],

    score[0],

    twin_analysis
)


# -------------------------
# OUTPUT
# -------------------------

print("\n==============================")
print("INTEGRATED CYBER TWIN ASSESSMENT")
print("==============================")

print("\nTwin Analysis:")
print(twin_analysis)

print("\nFinal Assessment:")
print(assessment)