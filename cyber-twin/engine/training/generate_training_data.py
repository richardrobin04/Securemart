import json
import random
from datetime import datetime, timedelta


events = []

start_time = datetime(2026, 10, 1, 9, 0, 0)

users = [
    "user_101",
    "user_102",
    "user_103",
    "user_104",
    "user_105"
]

endpoints = [
    "/login",
    "/api/profile",
    "/api/dashboard",
    "/api/transactions",
    "/api/settings"
]


for window in range(200):

    user = random.choice(users)

    window_start = start_time + timedelta(
        minutes=window * 5
    )

    request_count = random.randint(10, 40)

    for i in range(request_count):

        timestamp = (
            window_start +
            timedelta(seconds=random.randint(0, 299))
        )

        endpoint = random.choice(endpoints)

        success = random.random() > 0.05

        status_code = (
            200 if success else random.choice([400, 401, 403])
        )

        event_type = (
            "login"
            if endpoint == "/login"
            else "api_request"
        )

        events.append({
            "timestamp": timestamp.isoformat(),
            "user_id": user,
            "ip": "192.168.1." + str(random.randint(10, 50)),
            "event_type": event_type,
            "endpoint": endpoint,
            "method": "POST" if endpoint == "/login" else "GET",
            "status_code": status_code,
            "response_time": random.randint(80, 300),
            "success": success
        })


with open(
    "training/normal_data.json",
    "w"
) as file:

    json.dump(
        events,
        file,
        indent=2
    )


print(
    f"Generated {len(events)} normal events."
)