import pickle
import os
import numpy as np

model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

def load_model():
    with open(model_path, 'rb') as f:
        return pickle.load(f)

def predict_danger(lat, lng, hour, day_of_week, month, incidents):
    model = load_model()
    features = np.array([[lat, lng, hour, day_of_week, month, incidents]])
    score = model.predict(features)[0]
    score = max(0, min(100, score))

    if score >= 70:
        level = 'high'
    elif score >= 40:
        level = 'medium'
    else:
        level = 'low'

    return {
        'danger_score': round(score, 2),
        'level': level
    }

if __name__ == '__main__':
    # Test prediction
    result = predict_danger(
        lat=11.0168,
        lng=76.9558,
        hour=22,
        day_of_week=5,
        month=4,
        incidents=24
    )
    print(f"Prediction: {result}")