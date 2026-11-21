# ==============================================================================
# Stage 1: Build Frontend Single Page Application (React 19 + TypeScript + Vite)
# ==============================================================================
FROM node:20-slim AS frontend-builder
WORKDIR /build

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Production Python Runtime (FastAPI Backend + Static Frontend Host)
# ==============================================================================
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend \
    PORT=8080

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r ./backend/requirements.txt

# Copy backend application code and prompts
COPY backend/ ./backend/
COPY prompts/ ./prompts/
COPY prompts/ ./backend/prompts/

# Copy built frontend static files from Stage 1
COPY --from=frontend-builder /build/dist ./frontend/dist

# Expose port (Cloud Run sets $PORT dynamically)
EXPOSE 8080

# Launch Uvicorn server bound to 0.0.0.0:$PORT
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
