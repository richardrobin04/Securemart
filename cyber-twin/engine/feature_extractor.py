import pandas as pd


def extract_features(events):
    if not events:
        return pd.DataFrame()

    df = pd.DataFrame(events)

    total_requests = len(df)

    failed_requests = len(
        df[df["success"] == False]
    )

    failed_logins = len(
        df[
            (df["event_type"] == "login") &
            (df["success"] == False)
        ]
    )

    unique_endpoints = df["endpoint"].nunique()

    avg_response_time = df["response_time"].mean()

    status_4xx = len(
        df[
            (df["status_code"] >= 400) &
            (df["status_code"] < 500)
        ]
    )

    status_5xx = len(
        df[
            (df["status_code"] >= 500) &
            (df["status_code"] < 600)
        ]
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
        "failed_request_rate": failed_request_rate
    }

    return pd.DataFrame([features])