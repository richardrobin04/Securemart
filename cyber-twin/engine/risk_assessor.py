def calculate_risk(
    features,
    anomaly_prediction,
    anomaly_score,
    twin_analysis=None
):

    risk = 0
    reasons = []

    row = features.iloc[0]

    # -------------------------
    # REQUEST VOLUME
    # -------------------------

    if row["total_requests"] > 200:

        risk += 20

        reasons.append(
            "Unusually high request volume detected"
        )

    # -------------------------
    # FAILED LOGINS
    # -------------------------

    if row["failed_logins"] > 10:

        risk += 25

        reasons.append(
            "High number of failed authentication attempts"
        )

    # -------------------------
    # FAILED REQUESTS
    # -------------------------

    if row["failed_request_rate"] > 0.4:

        risk += 15

        reasons.append(
            "High proportion of failed requests"
        )

    # -------------------------
    # ENDPOINT EXPLORATION
    # -------------------------

    if row["unique_endpoints"] > 10:

        risk += 10

        reasons.append(
            "Unusually large number of endpoints accessed"
        )

    # -------------------------
    # SERVER ERRORS
    # -------------------------

    if row["status_5xx"] > 5:

        risk += 10

        reasons.append(
            "Abnormally high server error responses"
        )

    # -------------------------
    # MACHINE LEARNING
    # -------------------------

    if anomaly_prediction == -1:

        risk += 20

        reasons.append(
            "Machine-learning model detected anomalous behaviour"
        )

    # -------------------------
    # CYBER TWIN
    # -------------------------

    if twin_analysis is not None:

        user = twin_analysis["user"]
        api = twin_analysis["api"]

        # New IP
        if not user["known_ip"]:

            risk += 15

            reasons.append(
                "Activity originated from an unfamiliar IP address"
            )

        # New endpoint
        if not user["known_endpoint"]:

            risk += 15

            reasons.append(
                "User accessed an unfamiliar endpoint"
            )

        # Unknown API
        if not api["known_api"]:

            risk += 10

            reasons.append(
                "Previously unseen API endpoint detected"
            )

    # -------------------------
    # LIMIT SCORE
    # -------------------------

    risk = min(risk, 100)

    # -------------------------
    # SEVERITY
    # -------------------------

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

        "anomaly_score":
            float(anomaly_score),

        "reasons": reasons
    }