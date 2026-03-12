# ── Stage 1: Build React frontend ─────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /frontend
COPY frontend/package.json .
RUN npm install
COPY frontend/ .
RUN npm run build

# ── Stage 2: Python API ────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code and data
COPY app/    ./app/
COPY data/   ./data/
COPY model/  ./model/

# Train model (baked into image)
RUN python model/train.py

# Copy built frontend into app dir
COPY --from=frontend-builder /frontend/dist ./app/frontend_dist

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
