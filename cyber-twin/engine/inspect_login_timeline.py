
from ingestion.mongo_reader import get_recent_events


documents = get_recent_events(limit=100)

print("Recent authentication and security events:\n")

for document in documents:
    event_type = document.get("eventType", "UNKNOWN")

    if event_type not in {
        "LOGIN_FAILED",
        "LOGIN_SUCCESS",
        "API_REQUEST",
        "SUSPICIOUS_ACTIVITY",
    }:
        continue

    metadata = document.get("metadata") or {}

    # Display only relevant fields; do not print email addresses.
    print({
        "timestamp": str(document.get("timestamp")),
        "eventType": event_type,
        "ipAddress": document.get("ipAddress"),
        "endpoint": metadata.get("endpoint"),
        "statusCode": metadata.get("statusCode"),
        "threatType": metadata.get("threatType"),
        "failedAttemptsByIP": metadata.get("failedAttemptsByIP"),
        "severity": metadata.get("severity"),
    })