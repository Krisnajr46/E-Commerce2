# Cloud-Native Full Stack E-Commerce Platform

A modern cloud-native full stack e-commerce platform built using **React, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, and GitHub Actions**.

This project demonstrates a production-style scalable architecture with authentication, product management, cart and checkout workflows, Redis caching, background task processing, containerization, Kubernetes orchestration, and CI/CD automation.

---

# Project Preview

## Home Page
<img width="1903" height="909" alt="image" src="https://github.com/user-attachments/assets/59860117-2d6d-4c39-9d4b-5131bf35a477" />


## Product Catalog
<img width="1905" height="984" alt="image" src="https://github.com/user-attachments/assets/184c30cf-5375-4d63-88b0-07b2a7fc12de" />


## Cart & Checkout
<img width="1795" height="738" alt="image" src="https://github.com/user-attachments/assets/2bddc2ed-9e9a-4b79-bcf1-4fa749a7b6a3" />


## Admin Product Management
<img width="1795" height="990" alt="image" src="https://github.com/user-attachments/assets/694cadac-caa7-4f08-930a-813e3ea3ccd9" />


## Swagger API Documentation
<img width="1854" height="995" alt="image" src="https://github.com/user-attachments/assets/0acd8fd7-1b74-42e2-8ccc-00c0f170d5c5" />

---

# Features

## Authentication & Authorization
- User registration and login
- JWT-based authentication
- Protected routes
- Role-based admin access

## Product Management
- Product catalog
- Product search and filtering
- Product details page
- Admin create/update/delete products

## Cart & Orders
- Add/update/remove cart items
- Checkout workflow
- Order history
- Admin order status updates

## Performance Optimization
- Redis caching for product APIs
- Automatic cache invalidation

## Background Processing
- Async order processing
- Invoice generation simulation
- Order confirmation workflow

## Cloud-Native Infrastructure
- Dockerized frontend/backend
- Multi-container setup with Docker Compose
- Kubernetes manifests
- GitHub Actions CI pipeline

---

# Tech Stack

## Frontend
- React
- Vite
- Axios
- React Router DOM

## Backend
- FastAPI
- SQLAlchemy
- Alembic
- JWT Authentication

## Database & Cache
- PostgreSQL
- Redis

## DevOps & Infrastructure
- Docker
- Docker Compose
- Kubernetes
- GitHub Actions

---

# System Architecture

```text
React Frontend
       │
       ▼
FastAPI Backend APIs
       │
 ┌─────┴─────┐
 ▼           ▼
PostgreSQL   Redis
(Database)   (Caching)
```

## Architecture Summary

The React frontend is served by nginx in production-style containers. The FastAPI backend exposes REST APIs on port `8000`, connects to PostgreSQL for persistent data, and uses Redis for caching. Docker Compose runs all four services locally. Kubernetes manifests define deployments and services for the same components, with shared configuration in a ConfigMap and sensitive values in a Secret.
---

# Project Structure

```text
.
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── postgres-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── configmap.yaml
│   └── secret.yaml
│
├── docker-compose.yml
└── README.md
```

---

# Local Setup (Without Docker)

## 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd cloud-native-fullstack-ecommerce-platform
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create `.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce_db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run migrations:

```bash
alembic upgrade head
```

Start backend:

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger Docs:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Docker Setup

Run the full application:

```bash
docker compose up --build
```

Services:

| Service | Port |
|---|---|
| Frontend | 5173 |
| Backend | 8000 |
| PostgreSQL | 5432 |
| Redis | 6379 |

Run migrations inside Docker:

```bash
docker exec -it ecommerce-backend alembic upgrade head
```

---

# Kubernetes Setup

Enable Kubernetes in Docker Desktop.

Apply manifests:

```bash
kubectl apply -f k8s/
```

Check resources:

```bash
kubectl get pods
kubectl get services
```

---

# Kubernetes Services

| Service | Type | Port |
|---|---|---|
| Frontend | NodePort | 30000 |
| Backend | NodePort | 30080 |

Frontend URL:

```text
http://localhost:30000
```

---

# Redis Caching

Redis is used for:
- Product list caching
- Product detail caching
- Faster API responses

Cache invalidation occurs automatically when:
- products are created
- updated
- deleted

---

# GitHub Actions CI/CD

The CI pipeline automatically:

## Backend
- Installs dependencies
- Validates FastAPI imports

## Frontend
- Installs Node dependencies
- Builds React app

Workflow file:

```text
.github/workflows/ci.yml
```

---

# API Endpoints

## Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Products

```text
GET    /products
GET    /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
```

## Cart

```text
POST   /cart/items
GET    /cart
PUT    /cart/items/{id}
DELETE /cart/items/{id}
```

## Orders

```text
POST /orders/checkout
GET  /orders
GET  /orders/{id}
PUT  /orders/{id}/status
```

---

# Health Check

```text
GET /health/details
```

Example response:

```json
{
  "database": "connected",
  "redis": "connected"
}
```

---

# Future Improvements

- Payment Gateway Integration
- Email Notifications
- Elasticsearch Product Search
- RabbitMQ / Celery Queue
- AWS Deployment
- Terraform Infrastructure
- Advanced Analytics Dashboard

reference
Om Shah

