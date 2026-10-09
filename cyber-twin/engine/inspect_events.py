
from collections import Counter
from ingestion.mongo_reader import get_recent_events


documents = get_recent_events(limit=1000)

print(f"\nTotal MongoDB documents inspected: {len(documents)}")

print("\n--- Event type counts ---")
counts = Counter(
    document.get("eventType", "UNKNOWN")
    for document in documents
)

for event_type, count in counts.most_common():
    print(f"{event_type}: {count}")


print("\n--- Sample security events ---")

targets = {
    "LOGIN_SUCCESS",
    "LOGIN_FAILED",
    "SUSPICIOUS_ACTIVITY",
    "API_REQUEST",
}

shown = set()

for document in documents:
    event_type = document.get("eventType", "UNKNOWN")

    if event_type not in targets or event_type in shown:
        continue

    metadata = document.get("metadata") or {}

    print(f"\nEvent type: {event_type}")
    print(f"Timestamp: {document.get('timestamp')}")
    print(f"Has userId: {document.get('userId') is not None}")
    print(f"Has sessionId: {document.get('sessionId') is not None}")
    print(f"IP address: {document.get('ipAddress')}")
    print(f"Metadata: {metadata}")

    shown.add(event_type)

    if shown == targets:
        break