import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import pickle
import os

print("Loading crime data...")
df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'crime_data.csv'))

print(f"Dataset shape: {df.shape}")
print(df.head())

# Features
X = df[['lat', 'lng', 'hour', 'day_of_week', 'month', 'incidents']]
y = df['danger_score']

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model train
print("\nTraining Random Forest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
print(f"Model MAE: {mae:.2f}")

# Feature importance
print("\nFeature Importance:")
features = ['lat', 'lng', 'hour', 'day_of_week', 'month', 'incidents']
for feat, imp in zip(features, model.feature_importances_):
    print(f"  {feat}: {imp:.3f}")

# Save model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"\nModel saved to {model_path}")
print("Training complete!")