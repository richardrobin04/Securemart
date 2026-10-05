import sys
import os
import json
import pandas as pd

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from feature_extractor import extract_features
from anomaly_detector import AnomalyDetector
with open("training/normal_data.json", "r") as file:

    events = json.load(file)


df = pd.DataFrame(events)

df["timestamp"] = pd.to_datetime(
    df["timestamp"]
)


training_samples = []


# Group events into 5-minute windows
df["window"] = df["timestamp"].dt.floor("5min")


for window, group in df.groupby("window"):

    window_events = group.to_dict(
        orient="records"
    )

    features = extract_features(
        window_events
    )

    if not features.empty:

        training_samples.append(
            features.iloc[0]
        )


X = pd.DataFrame(
    training_samples
)


print("Training samples:", len(X))

print("\nFeatures:")
print(X.head())


detector = AnomalyDetector()

detector.train(X)

print("\nTraining completed.")