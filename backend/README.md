# Backend Setup

This folder contains the FastAPI backend foundation for the Cloud-Native Full Stack E-Commerce Platform.

The backend currently includes the FastAPI app structure, app configuration, CORS setup, health check endpoints, PostgreSQL connection settings, SQLAlchemy models, Alembic migration setup, JWT-based authentication, product catalog APIs with Redis caching, cart APIs, order checkout workflows, and simulated background processing for order workflows. Payments, Docker, Kubernetes, and frontend code will be added in later phases.

## Create a Virtual Environment

From the project root, move into the backend folder:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
venv\Scripts\activate
```

## Install Dependencies

Install the required Python packages:

```powershell
pip install -r requirements.txt
```

## PostgreSQL Setup

Create a PostgreSQL database named `ecommerce_db`.

Using `psql`, you can run:

```sql
CREATE DATABASE ecommerce_db;
```

Set your database connection string in a local `.env` file. You can start by copying `.env.example`:

```powershell
copy .env.example .env
```

Then update `DATABASE_URL` with your local PostgreSQL password:

```text
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ecommerce_db
```

## Run Database Migrations

Alembic is configured inside the backend folder.

To create a migration after changing SQLAlchemy models, run:

```powershell
alembic revision --autogenerate -m "initial_ecommerce_schema"
```

For Phase 3, the initial migration file has already been created. Apply migrations with:

```powershell
alembic upgrade head
```

## Run the Backend

Start the FastAPI development server:

```powershell
uvicorn app.main:app --reload
```

The backend should start at:

```text
http://127.0.0.1:8000
```

## Test the Endpoints

You can test the starter endpoints in a browser, Postman, or any API client.

Expected endpoints:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/health/details`
- `http://127.0.0.1:8000/auth/register`
- `http://127.0.0.1:8000/auth/login`
- `http://127.0.0.1:8000/auth/me`
- `http://127.0.0.1:8000/products`
- `http://127.0.0.1:8000/products/1`
- `http://127.0.0.1:8000/cart`
- `http://127.0.0.1:8000/orders`
- `http://127.0.0.1:8000/docs`

Expected `/health` response:

```json
{
  "status": "healthy",
  "service": "ecommerce-backend"
}
```

Expected `/health/details` response:

```json
{
  "status": "healthy",
  "service": "ecommerce-backend",
  "version": "0.1.0",
  "environment": "development",
  "database": "connected",
  "redis": "connected"
}
```

If Redis is unavailable but PostgreSQL is connected, `/health/details` still reports the API as healthy:

```json
{
  "status": "healthy",
  "service": "ecommerce-backend",
  "version": "0.1.0",
  "environment": "development",
  "database": "connected",
  "redis": "disconnected"
}
```

If PostgreSQL is unavailable, `/health/details` reports the API as unhealthy:

```json
{
  "status": "unhealthy",
  "service": "ecommerce-backend",
  "version": "0.1.0",
  "environment": "development",
  "database": "disconnected",
  "redis": "disconnected"
}
```

Redis is optional for API availability. Product APIs still read from PostgreSQL if Redis is disconnected.

## Test Authentication in Swagger

Step 1: Run the server:

```powershell
uvicorn app.main:app --reload
```

Step 2: Open Swagger docs:

```text
http://127.0.0.1:8000/docs
```

Step 3: Register a user with `POST /auth/register`.

Example body:

```json
{
  "email": "customer@example.com",
  "full_name": "Test Customer",
  "password": "Password123"
}
```

Step 4: Login with `POST /auth/login`.

Example body:

```json
{
  "email": "customer@example.com",
  "password": "Password123"
}
```

Step 5: Copy the `access_token` from the login response.

Step 6: Click the `Authorize` button in Swagger and enter:

```text
Bearer YOUR_ACCESS_TOKEN
```

If Swagger already shows the `Bearer` prefix for you, paste only the token value.

Step 7: Test the protected endpoint:

```text
GET /auth/me
```

## Test Product APIs in Swagger

Step 1: Register and login a user using the authentication steps above.

Step 2: To test admin-only product APIs, manually update the user's role in PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'customer@example.com';
```

Step 3: Login again with `POST /auth/login` and copy the new `access_token`.

Step 4: Click the `Authorize` button in Swagger and enter:

```text
Bearer YOUR_ACCESS_TOKEN
```

If Swagger already shows the `Bearer` prefix for you, paste only the token value.

Step 5: Create a product with `POST /products`.

Example body:

```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with long battery life",
  "price": 29.99,
  "stock_quantity": 100,
  "category": "Electronics",
  "image_url": "https://example.com/mouse.jpg"
}
```

Step 6: Test the product catalog endpoints:

```text
GET /products
GET /products/1
PUT /products/1
DELETE /products/1
```

Public product endpoints only return active products. `DELETE /products/{product_id}` performs a soft delete by setting `is_active` to `false`.

## Test Redis Product Caching

Phase 7 adds Redis caching to product catalog reads:

- `GET /products`
- `GET /products/{product_id}`

Product create, update, and delete operations invalidate related product cache entries.

On Windows, the simplest local Redis option is Docker Redis:

```powershell
docker run --name ecommerce-redis -p 6379:6379 -d redis
```

Make sure your `.env` includes:

```text
REDIS_URL=redis://localhost:6379/0
CACHE_TTL_SECONDS=300
```

Testing flow:

Step 1: Start Redis.

```powershell
docker start ecommerce-redis
```

Step 2: Start the backend.

```powershell
uvicorn app.main:app --reload
```

Step 3: Call the product list endpoint once:

```text
GET /products
```

The first request reads from PostgreSQL and stores the response in Redis.

Step 4: Call the same product list endpoint again:

```text
GET /products
```

The second matching request can return from Redis until the cache expires.

Step 5: Confirm product detail caching:

```text
GET /products/1
GET /products/1
```

Step 6: Create, update, or delete a product as an admin:

```text
POST /products
PUT /products/1
DELETE /products/1
```

Step 7: Call `GET /products` again and confirm the product list reflects the latest database state after cache invalidation.

## Test Cart and Order APIs in Swagger

Step 1: Run the backend:

```powershell
uvicorn app.main:app --reload
```

Step 2: Login as an admin and create products if no products exist.

Step 3: Register or login as a customer with `POST /auth/register`.

Example body:

```json
{
  "email": "customer_phase6@example.com",
  "full_name": "Phase Six Customer",
  "password": "Password123"
}
```

Step 4: Authorize Swagger with the customer token.

Step 5: Add a product to the cart with `POST /cart/items`.

Example body:

```json
{
  "product_id": 1,
  "quantity": 2
}
```

Step 6: View the cart:

```text
GET /cart
```

Step 7: Update cart quantity with `PUT /cart/items/{item_id}`.

Example body:

```json
{
  "quantity": 3
}
```

Step 8: Checkout the current cart:

```text
POST /orders/checkout
```

Checkout creates an order, creates order items, reduces product stock, and clears the cart.

Step 9: View the current customer's orders:

```text
GET /orders
```

Step 10: View a single order:

```text
GET /orders/{order_id}
```

Step 11: Login as an admin and update order status with `PUT /orders/{order_id}/status`.

Example body:

```json
{
  "status": "processing"
}
```

Allowed order statuses are `pending`, `processing`, `shipped`, `delivered`, and `cancelled`.

## Test Background Order Processing

Phase 8 uses FastAPI `BackgroundTasks` to simulate order workflow processing after checkout. It does not use Celery, RabbitMQ, Redis queues, or any external worker yet.

Step 1: Run the backend:

```powershell
uvicorn app.main:app --reload
```

Step 2: Login as a customer.

Step 3: Add a product to the cart:

```text
POST /cart/items
```

Step 4: Checkout the cart:

```text
POST /orders/checkout
```

The checkout response should return normally with the created order.

Step 5: Check the backend terminal logs.

Expected log messages:

```text
Sending confirmation email for order {order_id}
Invoice generated for order {order_id}
Order {order_id} background processing completed
```

## Environment Variables

Use `.env.example` as the template for local environment settings. In a later phase, you can copy it to `.env` and customize values as needed.
