# 💰 Salary Prediction — Full-Stack ML App

A production-grade machine learning application that predicts employee salaries.  
Built with **GradientBoosting**, **FastAPI**, **React + Vite**, and **Docker**.

> **ECE Engineering School – ML Model Deployment 2025-2026**  
> Module: Déploiement de modèles de ML | Dr. Yosra Hajjaji

---

## 📊 Model Performance

| Metric | Value |
|--------|-------|
| Algorithm | GradientBoostingRegressor |
| Training set | 2,000 records |
| R² Score | **0.949** |
| Cross-Val R² | 0.949 ± 0.007 |
| MAE | ~$11,000 |

---

## 📁 Project Structure

```
salary-prediction/
├── app/
│   ├── main.py              # FastAPI application
│   ├── model.pkl            # Trained model (built by Docker)
│   ├── encoders.pkl         # Label encoders
│   ├── features.pkl         # Feature list
│   └── frontend_dist/       # Built React app (served by FastAPI)
├── data/
│   ├── salary_data.csv      # Dataset (2,000 rows)
│   └── generate_dataset.py  # Dataset generator script
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── model/
│   └── train.py             # Model training script
├── Dockerfile               # Multi-stage build
├── render.yaml              # Render.com deploy config
├── requirements.txt
└── README.md
```

---

## 🚀 Run Locally (Development)

### Backend
```bash
# 1. Install Python deps
pip install -r requirements.txt

# 2. Train the model
python model/train.py

# 3. Start API
uvicorn app.main:app --reload --port 8000
```
API available at: http://localhost:8000  
Swagger docs at: http://localhost:8000/docs

### Frontend (separate terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend at: http://localhost:5173

---

## 🐳 Docker (Full Stack)

```bash
# Build
docker build -t salary-prediction .

# Run
docker run -p 8000:8000 salary-prediction
```

- API: http://localhost:8000
- Frontend: http://localhost:8000/app
- Docs: http://localhost:8000/docs

---

## 📡 API Reference

### `GET /health`
```json
{ "status": "ok", "model": "GradientBoostingRegressor", "r2_score": 0.9489 }
```

### `GET /options`
Returns all valid values for dropdowns.

### `POST /predict`

**Request:**
```json
{
  "age": 32,
  "gender": "Male",
  "education_level": "Bachelor's",
  "job_title": "Software Engineer",
  "years_of_experience": 5
}
```

**Response:**
```json
{
  "predicted_salary": 91500,
  "salary_range_low": 82000,
  "salary_range_high": 100500,
  "currency": "USD",
  "message": "Estimated annual salary for a Software Engineer with 5 years of experience and a Bachelor's degree."
}
```

### Test with curl
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"age":32,"gender":"Male","education_level":"Bachelor'\''s","job_title":"Software Engineer","years_of_experience":5}'
```

---

## 🌐 Deploy to Render (Free)

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repository
4. Runtime: **Docker**
5. Click **Deploy**

Your API will be live at: `https://salary-prediction-api.onrender.com`  
Frontend at: `https://salary-prediction-api.onrender.com/app`

---

## 👥 Team

- Student 1: Anir AGOUNTAF
- Student 2: Muhammaad Hassaan SHAFIQUE


