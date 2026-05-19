 🌙 NILA — Night Safety Intelligence & Live Alert System

> An AI-powered real-time safety system that predicts danger zones, suggests safe routes, and sends emergency SOS alerts — built for Indian cities.

![NILA Banner](https://img.shields.io/badge/NILA-Night%20Safety%20System-darkblue?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![ML](https://img.shields.io/badge/Machine%20Learning-Random%20Forest-orange?style=for-the-badge)


 🚀 Live Demo
Frontend: [nila.vercel.app](https://nila.vercel.app)
Backend API: [nila-backend.onrender.com](https://nila-backend.onrender.com)
API Docs: [nila-backend.onrender.com/docs](https://nila-backend.onrender.com/docs)


 💡 Problem Statement

Every day, thousands of people — college students, solo travellers, delivery workers — move through cities at night without knowing which areas are dangerous. Existing apps show routes but **never predict safety**.

NILA solves this.


 ✨ Features

 🗺️ Real-time Danger Zone Map
- Live Coimbatore map with color-coded danger zones
- 🔴 High Risk | 🟠 Medium Risk | 🟢 Low Risk
- Click any zone to see incidents count, radius, last updated

 🧠 ML-Powered Danger Prediction
- Random Forest model trained on crime data
- Predicts danger score based on: location, time of day, day of week, incidents
- Dynamic scores update based on current time

 📊 Safety Dashboard
- Total incidents across all zones
- Risk breakdown with progress bars
- Filter zones by danger level
- Detailed zone cards with incident history

 🗺️ Safe Route Finder
- Enter any destination in Coimbatore
- AI calculates safety score for the route
- Shows distance, ETA, and high-risk zones to avoid
- One-click Google Maps navigation

 🆘 Silent SOS Alert
- Red glowing SOS button always visible
- Click = instant email alert to trusted contacts
- Includes live GPS location + Google Maps link
- Shows nearest police station with direct call option

---

 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Leaflet.js, Axios |
| Backend | Python, FastAPI, Uvicorn |
| ML Model | Scikit-learn (Random Forest) |
| Database | JSON (upgradeable to MongoDB) |
| Maps | OpenStreetMap, Leaflet |
| Alerts | EmailJS |
| Deploy | Vercel (Frontend), Render (Backend) |


 📁 Project Structure
nila/
├── frontend/                  # React.js app
│   └── src/
│       └── components/
│           ├── MapView.js     # Main map component
│           ├── Sidebar.js     # Safety dashboard
│           ├── SOS.js         # Emergency alert
│           └── RouteSearch.js # Safe route finder
├── backend/                   # Python FastAPI
│   ├── main.py                # App entry point
│   ├── model.pkl              # Trained ML model
│   └── routes/
│       ├── danger_zones.py    # Zone API
│       └── predict_route.py   # ML prediction API
└── ml_model/                  # ML training scripts
├── crime_data.csv          # Training dataset
├── train_model.py          # Model training
└── predict.py             # Prediction logic

 ⚙️ Local Setup

 Prerequisites
- Node.js v18+
- Python 3.10+
- Git

 Frontend Setup
```bash
cd frontend
npm install
npm start
```

 Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

 ML Model Training
```bash
cd ml_model
python train_model.py
```


 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/danger-zones` | Get all danger zones |
| GET | `/api/danger-zones/{level}` | Filter by risk level |
| GET | `/api/predict-all` | ML predictions for all zones |
| POST | `/api/predict` | Predict danger for custom location |


 🧠 ML Model Details

Algorithm: Random Forest Regressor
  Features: Latitude, Longitude, Hour, Day of Week, Month, Incidents
  Target: Danger Score (0-100)
  MAE: 2.54 (highly accurate)
  Most Important Feature: Incidents (79.7%)


 📸 Screenshots

> Map with danger zones, sidebar dashboard, SOS alert, route finder


 🏆 Why NILA?

- ✅ Real problem — Night safety is a major issue in Indian cities
- ✅ ML-powered — Not just static data, dynamic predictions
- ✅ India-specific — Built for Coimbatore, scalable to any city
- ✅ Full stack — React + FastAPI + ML in one project
- ✅ Real alerts — EmailJS SOS with live GPS location


 👨‍💻 Developer

Vishal Vidhya
- Built as a placement project — 2026
- Stack: React, Python, FastAPI, Machine Learning


 📄 License

MIT License — Free to use and modify


> "Stay safe. NILA watches over you." 🌙
