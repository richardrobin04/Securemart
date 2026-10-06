from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from feature_extractor import extract_features
from anomaly_detector import AnomalyDetector
from risk_assessor import calculate_risk


app = FastAPI(
    title="Cyber Twin AI Risk Engine",
    version="2.0"
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

    features = extract_features(
        event_data
    )

    if features.empty:

        raise HTTPException(
            status_code=400,
            detail="No events received."
        )

    prediction, anomaly_score = detector.predict(
        features
    )

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