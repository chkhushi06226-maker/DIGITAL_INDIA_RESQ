from fastapi import FastAPI
from schemas.emergency import EmergencyInput

from services.classifier import classify_emergency
from services.severity import predict_severity
from services.risk import calculate_risk
from services.recommendation import recommend_resources


app = FastAPI(
    title="Digital India RES-Q AI Service",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "service": "RES-Q AI Service",
        "status": "running"
    }


@app.post("/api/ai/analyze")
def analyze_emergency(data: EmergencyInput):

    emergency_type, confidence = classify_emergency(
        data.description,
        data.emergency_type
    )

    severity, severity_score = predict_severity(
        emergency_type,
        data.people_affected,
        data.description
    )

    risk_level, risk_score = calculate_risk(
        severity,
        data.people_affected,
        data.location_risk,
        data.road_accessibility,
        data.hospital_availability
    )

    resources = recommend_resources(
        emergency_type,
        severity,
        risk_level
    )

    return {
        "classification": {
            "type": emergency_type,
            "confidence": confidence
        },

        "severity": {
            "level": severity,
            "score": severity_score
        },

        "risk_assessment": {
            "level": risk_level,
            "score": risk_score
        },

        "recommended_resources": resources
    }