from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.danger_zones import router as danger_router
from routes.sos_alert import router as sos_router
from routes.predict_route import router as predict_router

app = FastAPI(title="NILA API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nila-coral.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(danger_router, prefix="/api")
app.include_router(sos_router, prefix="/api")
app.include_router(predict_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "NILA API is running!"}