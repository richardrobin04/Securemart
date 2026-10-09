
def generate_recommendations(assessment, security_alerts):
    recommendations = []

    score = assessment.get("risk_score", 0)
    reasons = assessment.get("reasons", [])

    alert_count = security_alerts.get("total", 0)
    by_threat = security_alerts.get("by_threat_type", {})
    brute_force_count = by_threat.get("BRUTE_FORCE", 0)

    if brute_force_count > 0:
        recommendations.append({
            "priority": "HIGH",
            "issue": "Brute-force activity detected",
            "action": (
                "Apply rate limiting to login attempts, introduce "
                "progressive delays, and temporarily throttle repeated "
                "failures from the same source."
            )
        })

    if "High number of failed authentication attempts" in reasons:
        recommendations.append({
            "priority": "HIGH",
            "issue": "Repeated authentication failures",
            "action": (
                "Review failed-login activity, verify authentication "
                "logging, and monitor for repeated attempts against "
                "multiple accounts."
            )
        })

    if "High proportion of failed requests" in reasons:
        recommendations.append({
            "priority": "MEDIUM",
            "issue": "High request failure rate",
            "action": (
                "Inspect HTTP 4xx responses and request patterns to "
                "distinguish malicious activity from invalid requests "
                "or application errors."
            )
        })

    if "Machine-learning model detected anomalous behaviour" in reasons:
        recommendations.append({
            "priority": "MEDIUM",
            "issue": "Anomalous behaviour detected",
            "action": (
                "Review the affected time window, source IP, endpoints, "
                "and authentication events before taking enforcement action."
            )
        })

    if score >= 75:
        recommendations.append({
            "priority": "CRITICAL",
            "issue": "Critical risk score",
            "action": (
                "Escalate for security review and consider temporary "
                "protective controls based on corroborating evidence."
            )
        })

    if not recommendations:
        recommendations.append({
            "priority": "LOW",
            "issue": "No major risk indicators identified",
            "action": (
                "Continue monitoring and periodically reassess activity."
            )
        })

    return recommendations