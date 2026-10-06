def calculate_risk(features, anomaly_prediction, anomaly_score):

    risk = 0
    reasons = []

    row = features.iloc[0]

    # Request volume
    if row["total_requests"] > 200:
        risk += 20
        reasons.append(
            "Unusually high request volume detected"
        )

    # Failed logins
    if row["failed_logins"] > 10:
        risk += 25
        reasons.append(
            "High number of failed authentication attempts"
        )

    # Failed requests
    if row["failed_request_rate"] > 0.4:
        risk += 15
        reasons.append(
            "High proportion of failed requests"
        )

    # Endpoint exploration
    if row["unique_endpoints"] > 10:
        risk += 10
        reasons.append(
            "Unusually large number of endpoints accessed"
        )

    # Server errors
    if row["status_5xx"] > 5:
        risk += 10
        reasons.append(
            "Abnormally high server error responses"
        )

    # ML anomaly
    if anomaly_prediction == -1:
        risk += 20
        reasons.append(
            "Machine-learning model detected anomalous behaviour"
        )

    risk = min(risk, 100)

    if risk >= 75:
        severity = "CRITICAL"
    elif risk >= 50:
        severity = "HIGH"
    elif risk >= 25:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    return {
        "risk_score": risk,
        "severity": severity,
        "anomaly_score": float(anomaly_score),
        "reasons": reasons
    }