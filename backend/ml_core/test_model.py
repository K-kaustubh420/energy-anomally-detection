import joblib
import numpy as np

print("🔍 Loading trained model...")

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

print("✅ Model loaded")

def check(power):
    X = np.array([[power]])
    X_scaled = scaler.transform(X)

    pred = model.predict(X_scaled)[0]
    score = model.decision_function(X_scaled)[0]

    return power, ("ANOMALY" if pred == -1 else "NORMAL"), round(score, 4)

# Test values (simulate smart plug)
test_values = [20, 50, 80, 150, 300, 600]

for v in test_values:
    print(check(v))
