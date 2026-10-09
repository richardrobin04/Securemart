
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import PyMongoError

# Current file: cyber-twin/engine/ingestion/mongo_reader.py
# Go up four levels to the securemart project root.
PROJECT_ROOT = Path(__file__).resolve().parents[3]
SERVER_ENV = Path(
    r"C:\Users\leste\OneDrive\Desktop\College\major project\Securemart\securemart\server\.env"
)

load_dotenv(SERVER_ENV, override=True)
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "test")

if not MONGO_URI:
    raise RuntimeError(
        f"MONGO_URI not found. Check environment file: {SERVER_ENV}"
    )
def get_recent_events(limit=5):
    """Read recent events from MongoDB without modifying any data."""
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=10000,
    )

    try:
        # Verify that MongoDB is reachable
        client.admin.command("ping")

        db = client[DB_NAME]
        collection = db["events"]

        events = list(
            collection.find()
            .sort("timestamp", -1)
            .limit(limit)
        )

        return events

    finally:
        client.close()


if __name__ == "__main__":
    try:
        events = get_recent_events()

        print(f"Successfully read {len(events)} event(s).\n")

        for event in events:
            metadata = event.get("metadata") or {}

            print({
                "eventType": event.get("eventType"),
                "timestamp": str(event.get("timestamp")),
                "ipAddress": event.get("ipAddress"),
                "method": metadata.get("method"),
                "endpoint": metadata.get("endpoint"),
                "statusCode": metadata.get("statusCode"),
                "responseTime": metadata.get("responseTime"),
            })

    except (PyMongoError, RuntimeError) as error:
        print(f"MongoDB connection/read failed: {error}")