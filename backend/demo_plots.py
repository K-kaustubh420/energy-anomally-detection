import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from app.model import model, scaler
from visualization import plot_confusion_matrix, plot_roc_curve, plot_precision_recall_curve

# Load the dataset
data_path = "ml_core/data/KAG_energydata_complete.csv"
df = pd.read_csv(data_path)

# For demo, use 'Appliances' as the feature (assuming model is trained on this)
# Create binary labels: anomaly if Appliances > threshold
threshold = df['Appliances'].quantile(0.95)  # Top 5% as anomalies
df['anomaly'] = (df['Appliances'] > threshold).astype(int)

# Use Appliances as the single feature and rename to 'energy' as in training
X = df[['Appliances']].rename(columns={'Appliances': 'energy'})
y = df['anomaly']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Scale the data
X_test_scaled = scaler.transform(X_test)

# Make predictions
y_pred = model.predict(X_test_scaled)
y_scores = model.decision_function(X_test_scaled)

# Convert predictions: IsolationForest returns -1 for anomaly, 1 for normal
y_pred_binary = (y_pred == -1).astype(int)  # 1 for anomaly, 0 for normal

# Generate plots
plot_confusion_matrix(y_test, y_pred_binary, classes=['Normal', 'Anomaly'])
plot_roc_curve(y_test, -y_scores)  # Negate scores so higher = anomaly
plot_precision_recall_curve(y_test, -y_scores)  # Negate scores so higher = anomaly

print("Displaying plots in windows...")
print("Confusion Matrix window opened")
print("ROC Curve window opened")
print("Precision-Recall Curve window opened")

# Print some metrics
print("\nClassification Report:")
print(classification_report(y_test, y_pred_binary, target_names=['Normal', 'Anomaly']))