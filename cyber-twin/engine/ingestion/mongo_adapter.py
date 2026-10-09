
from datetime import datetime, timezone


from datetime import datetime, timezone


def normalize_mongo_event(document):
    """Convert one HTTP API request into the engine's event format.

    LOGIN_SUCCESS and LOGIN_FAILED are excluded because they describe
    authentication outcomes that may already be represented by API_REQUEST.
    SUSPICIOUS_ACTIVITY alerts are handled separately.
    """
    event_type = str(document.get("eventType", "UNKNOWN")).upper()

    # Count actual HTTP requests, not duplicate login-result records.
    if event_type != "API_REQUEST":
        return None

    metadata = document.get("metadata") or {}

    endpoint = str(metadata.get("endpoint") or "/unknown")
    method = str(metadata.get("method") or "UNKNOWN").upper()

    status_code = metadata.get("statusCode")
    response_time = metadata.get("responseTime")

    valid_status = isinstance(status_code, (int, float))
    success = valid_status and 200 <= status_code < 400

    is_login_request = (
        method == "POST"
        and endpoint.rstrip("/").endswith("/login")
    )

    normalized_type = "login" if is_login_request and not success else "api_request"

    timestamp = document.get("timestamp")

    if isinstance(timestamp, datetime):
        timestamp = timestamp.isoformat()
    elif timestamp is None:
        timestamp = datetime.now(timezone.utc).isoformat()
    else:
        timestamp = str(timestamp)

    user_id = document.get("userId")
    session_id = document.get("sessionId")

    if user_id is None:
        user_id = (
            f"anonymous:{session_id}"
            if session_id is not None
            else "anonymous:unknown"
        )
    else:
        user_id = str(user_id)

    return {
        "timestamp": timestamp,
        "user_id": user_id,
        "ip": str(document.get("ipAddress") or "unknown"),
        "event_type": normalized_type,
        "endpoint": endpoint,
        "method": method,
        "status_code": status_code if valid_status else 0,
        "response_time": (
            response_time
            if isinstance(response_time, (int, float))
            else 0
        ),
        "success": success,
    }
def normalize_mongo_events(documents):
    normalized = []

    for document in documents:
        event = normalize_mongo_event(document)

        if event is not None:
            normalized.append(event)

    normalized.sort(key=lambda event: event["timestamp"])
    return normalized


def extract_security_alerts(documents):
    """Extract alerts separately from ordinary request events."""
    alerts = []

    for document in documents:
        if str(document.get("eventType", "")).upper() != (
            "SUSPICIOUS_ACTIVITY"
        ):
            continue

        metadata = document.get("metadata") or {}

        alerts.append({
            "timestamp": str(document.get("timestamp", "")),
            "ip": str(document.get("ipAddress") or "unknown"),
            "threat_type": metadata.get(
                "threatType", "UNKNOWN"
            ),
            "severity": str(
                metadata.get("severity", "UNKNOWN")
            ).upper(),
            "failed_attempts_by_ip": metadata.get(
                "failedAttemptsByIP"
            ),
            "time_window": metadata.get("timeWindow"),
        })

    return alerts