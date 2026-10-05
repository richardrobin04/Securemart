from twin.twin_state import CyberTwin


twin = CyberTwin()


# --------------------------------
# NORMAL ACTIVITY
# --------------------------------

normal_event = {

    "timestamp": "2026-10-05T12:00:00",

    "user_id": "user_101",

    "ip": "192.168.1.20",

    "event_type": "login",

    "endpoint": "/login",

    "method": "POST",

    "status_code": 200,

    "response_time": 150,

    "success": True
}


print("\n==============================")
print("FIRST EVENT")
print("==============================")

result = twin.analyse_event(
    normal_event
)

print(result)


# --------------------------------
# KNOWN ACTIVITY
# --------------------------------

known_event = {

    "timestamp": "2026-10-05T12:01:00",

    "user_id": "user_101",

    "ip": "192.168.1.20",

    "event_type": "api_request",

    "endpoint": "/login",

    "method": "POST",

    "status_code": 200,

    "response_time": 160,

    "success": True
}


print("\n==============================")
print("KNOWN ACTIVITY")
print("==============================")

result = twin.analyse_event(
    known_event
)

print(result)


# --------------------------------
# UNFAMILIAR ACTIVITY
# --------------------------------

suspicious_event = {

    "timestamp": "2026-10-05T12:05:00",

    "user_id": "user_101",

    "ip": "10.10.10.50",

    "event_type": "api_request",

    "endpoint": "/api/admin",

    "method": "GET",

    "status_code": 403,

    "response_time": 800,

    "success": False
}


print("\n==============================")
print("UNFAMILIAR ACTIVITY")
print("==============================")

result = twin.analyse_event(
    suspicious_event
)

print(result)


# --------------------------------
# FINAL STATE
# --------------------------------

print("\n==============================")
print("FINAL CYBER TWIN STATE")
print("==============================")

print(twin.get_summary())

print("\nUSER:")
print(twin.get_user("user_101"))

print("\nAPI:")
print(twin.get_api("/api/admin"))