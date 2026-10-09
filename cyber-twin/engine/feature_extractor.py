
import pandas as pd


def extract_features(events):
    if not events:
        return pd.DataFrame()

    df = pd.DataFrame(events)

    total_requests = len(df)

    failed_requests = int(
        (df["success"] == False).sum()
    )

    # Count failed authentication requests only when they are
    # explicitly identified as login events by the adapter.
    failed_logins = int(
        (
            (df["event_type"] == "login")
            & (df["success"] == False)
            & (df["endpoint"].str.rstrip("/").str.endswith("/login"))
            & (df["method"].str.upper() == "POST")
        ).sum()
    )

    unique_endpoints = int(df["endpoint"].nunique())

    avg_response_time = float(df["response_time"].mean())

    status_4xx = int(
        (
            (df["status_code"] >= 400)
            & (df["status_code"] < 500)
        ).sum()
    )

    status_5xx = int(
        (
            (df["status_code"] >= 500)
            & (df["status_code"] < 600)
        ).sum()
    )

    failed_request_rate = (
        failed_requests / total_requests
        if total_requests > 0 else 0
    )

    features = {
        "total_requests": total_requests,
        "failed_requests": failed_requests,
        "failed_logins": failed_logins,
        "unique_endpoints": unique_endpoints,
        "avg_response_time": avg_response_time,
        "status_4xx": status_4xx,
        "status_5xx": status_5xx,
        "failed_request_rate": failed_request_rate,
    }

    return pd.DataFrame([features])