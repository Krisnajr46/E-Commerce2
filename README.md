# Cloud-Native Full Stack E-Commerce Platform

This project is a beginner-friendly full stack e-commerce platform built with a FastAPI backend, React + Vite frontend, PostgreSQL database, and Redis cache. Phase 10 adds the cloud-native foundation: Docker, Docker Compose, Kubernetes manifests, and GitHub Actions CI.

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Alembic, JWT authentication
- Frontend: React, Vite, Axios, React Router
- Database: PostgreSQL 15
- Cache: Redis
- Containers: Docker and Docker Compose
- Orchestration: Kubernetes
- CI: GitHub Actions

## Features

- User registration, login, and JWT-protected routes
- Product catalog APIs
- Cart management
- Order checkout workflow
- Redis-backed product caching
- Background order processing with FastAPI background tasks
- Dockerized backend and frontend
- Local multi-service setup with Docker Compose
- Kubernetes manifests for local cluster testing
- CI checks for backend imports and frontend builds

## Architecture Summary

The React frontend is served by nginx in production-style containers. The FastAPI backend exposes REST APIs on port `8000`, connects to PostgreSQL for persistent data, and uses Redis for caching. Docker Compose runs all four services locally. Kubernetes manifests define deployments and services for the same components, with shared configuration in a ConfigMap and sensitive values in a Secret.

## Local Setup Without Docker

Start PostgreSQL and create a database named `ecommerce_db`.

Backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Useful local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

## Docker Compose Setup

Run the full stack from the project root:

```powershell
docker compose up --build
```

Docker Compose starts:

- Frontend: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

The PostgreSQL service sets `POSTGRES_DB=ecommerce_db`, so the database is created automatically on first startup.

If this is a fresh database, apply migrations from inside the backend container or from your local backend environment after the database is running:

```powershell
docker compose exec backend alembic upgrade head
```

## Kubernetes Setup

Build local images first:

```powershell
docker build -t ecommerce-backend:latest ./backend
docker build -t ecommerce-frontend:latest ./frontend
```

Apply all manifests:

```powershell
kubectl apply -f k8s/
```

Check the pods and services:

```powershell
kubectl get pods
kubectl get services
```

Local Kubernetes URLs depend on your cluster. The manifests expose:

- Frontend NodePort: `http://localhost:30000`
- Backend NodePort: `http://localhost:30080`

Because the current frontend code calls `http://127.0.0.1:8000`, use a backend port-forward for local browser testing:

```powershell
kubectl port-forward service/backend 8000:8000
```

Then open:

```text
http://localhost:30000
```

## GitHub Actions CI

The workflow in `.github/workflows/ci.yml` runs on pushes and pull requests to `main`.

The backend job:

- Checks out the repository
- Sets up Python 3.12
- Installs backend dependencies
- Runs a basic FastAPI app import check

The frontend job:

- Checks out the repository
- Sets up Node 20
- Installs frontend dependencies with `npm ci`
- Builds the Vite app with `npm run build`

## Environment Variables

Backend environment variables used by Docker Compose and Kubernetes:

```text
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecommerce_db
REDIS_URL=redis://redis:6379/0
SECRET_KEY=change_this_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://frontend
```

For production, replace placeholder secrets and use a managed secret store or Kubernetes Secret values created outside source control.

## Screenshots

Add screenshots here as the UI evolves:

- Home page
- Product catalog
- Cart
- Checkout
- API docs
