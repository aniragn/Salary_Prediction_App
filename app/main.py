from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

BASE = os.path.dirname(os.path.abspath(__file__))

model    = joblib.load(os.path.join(BASE, "model.pkl"))
encoders = joblib.load(os.path.join(BASE, "encoders.pkl"))
features = joblib.load(os.path.join(BASE, "features.pkl"))

app = FastAPI(
    title="Salary Prediction API",
    description="Predict employee salaries using a GradientBoosting ML model.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    age: int                   = Field(..., ge=18, le=70,  example=32)
    gender: str                = Field(...,                example="Male")
    education_level: str       = Field(...,                example="Bachelor's")
    job_title: str             = Field(...,                example="Software Engineer")
    years_of_experience: float = Field(..., ge=0,  le=45,  example=5)

class PredictResponse(BaseModel):
    predicted_salary: float
    salary_range_low: float
    salary_range_high: float
    currency: str
    message: str

@app.get("/health")
def health():
    return {"status": "ok", "model": "GradientBoostingRegressor", "r2_score": 0.9489}

@app.get("/options")
def options():
    return {
        "genders":          sorted(encoders["Gender"].classes_.tolist()),
        "education_levels": sorted(encoders["Education Level"].classes_.tolist()),
        "job_titles":       sorted(encoders["Job Title"].classes_.tolist()),
    }

@app.post("/predict", response_model=PredictResponse)
def predict(data: PredictRequest):
    for col, key in [("Gender", data.gender),
                     ("Education Level", data.education_level),
                     ("Job Title", data.job_title)]:
        if key not in encoders[col].classes_:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid {col}: '{key}'. Valid: {sorted(encoders[col].classes_.tolist())}"
            )

    g   = encoders["Gender"].transform([data.gender])[0]
    edu = encoders["Education Level"].transform([data.education_level])[0]
    job = encoders["Job Title"].transform([data.job_title])[0]

    exp_age_ratio = data.years_of_experience / (data.age + 1)
    senior        = int(data.years_of_experience >= 10)

    feat_vec = np.array([[
        data.age, g, edu, job,
        data.years_of_experience, exp_age_ratio, senior
    ]])

    salary = float(model.predict(feat_vec)[0])
    salary = max(30000, round(salary / 500) * 500)
    low    = round(salary * 0.90 / 500) * 500
    high   = round(salary * 1.10 / 500) * 500

    return PredictResponse(
        predicted_salary  = salary,
        salary_range_low  = low,
        salary_range_high = high,
        currency          = "USD",
        message           = (
            f"Estimated annual salary for a {data.job_title} "
            f"with {int(data.years_of_experience)} years of experience "
            f"and a {data.education_level} degree."
        ),
    )

# ── Serve React frontend — MUST be last ───────────────────
frontend_dist = os.path.join(BASE, "frontend_dist")

if os.path.isdir(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_react(full_path: str):
        return FileResponse(os.path.join(frontend_dist, "index.html"))