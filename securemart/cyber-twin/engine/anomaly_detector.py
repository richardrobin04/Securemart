import os
import joblib

from sklearn.ensemble import IsolationForest


MODEL_PATH = "models/anomaly_model.pkl"


class AnomalyDetector:

    def __init__(self):
        self.model = None

    def train(self, X):

        self.model = IsolationForest(
            n_estimators=200,
            contamination=0.05,
            random_state=42
        )

        self.model.fit(X)

        os.makedirs("models", exist_ok=True)

        joblib.dump(
            self.model,
            MODEL_PATH
        )

        print("AI model trained and saved.")

    def load(self):

        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
            return True

        return False

    def predict(self, X):

        if self.model is None:
            raise Exception(
                "AI model has not been trained."
            )

        prediction = self.model.predict(X)

        score = self.model.decision_function(X)

        return prediction, score