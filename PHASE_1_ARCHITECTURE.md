# Cloud-Native Full Stack E-Commerce Platform

## 1. Project Overview

The **Cloud-Native Full Stack E-Commerce Platform** is a portfolio-level application designed to demonstrate modern full-stack software engineering practices using React, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, GitHub Actions, and an AWS-ready deployment strategy.

The goal of this project is to build a scalable, production-minded e-commerce system where customers can browse products, manage carts, place orders, and complete payments, while admins can manage products and monitor order activity. The project will be developed in phases so each major engineering concept is introduced clearly and intentionally.

This platform is designed to show more than basic CRUD development. It will demonstrate:

- A clean frontend and backend separation
- RESTful API design
- Relational database modeling
- Authentication and role-based authorization
- Caching with Redis
- Background task processing for async workflows
- Containerized development with Docker
- Kubernetes-based deployment planning
- CI/CD automation with GitHub Actions
- Cloud-ready architecture for AWS

Phase 1 is documentation-focused only. It defines the blueprint for the project before application code, infrastructure code, database migrations, or package installation begins.

## 2. Problem Statement

Many e-commerce applications need to support multiple user workflows at the same time: customers browsing products, carts updating frequently, orders being created, payments being processed, and admins managing product inventory. As traffic grows, the system must remain reliable, maintainable, and scalable.

This project solves the problem of building an e-commerce platform that is not only functional, but also designed with real-world engineering concerns in mind. It separates customer-facing functionality from admin workflows, uses a relational database for durable business data, adds Redis for performance-sensitive operations, introduces async processing for tasks that should not block user requests, and prepares the application for cloud deployment.

The platform is intended to answer the question:

> How can we design a full-stack e-commerce system that is understandable for developers, useful for users, and ready to evolve toward production-grade cloud deployment?

## 3. Core Features

### Customer Features

- Customer registration and login
- Secure authentication using access tokens
- Browse product catalog
- View individual product details
- Search and filter products
- Add products to cart
- Update cart item quantity
- Remove items from cart
- Place orders from cart contents
- View order history
- View order details
- Submit payment for an order
- Receive order confirmation workflow through async processing in later phases

### Admin Features

- Admin login
- Role-based access to admin-only endpoints
- Create new products
- Update existing product details
- Delete or deactivate products
- View all orders
- View order details
- Update order status
- Monitor customer activity through admin APIs
- Manage product inventory fields such as stock quantity and availability

### System/Engineering Features

- RESTful API built with FastAPI
- React frontend consuming backend APIs
- PostgreSQL relational database schema
- Redis caching for frequently accessed product and session-like data
- Background worker design for async tasks such as order confirmation and payment-related workflows
- Docker-based local development environment
- Kubernetes manifests for deployable services
- GitHub Actions pipeline for automated checks
- AWS-ready service boundaries
- Environment-based configuration
- Structured project layout
- Separation between application code, infrastructure configuration, and documentation
- Future-ready monitoring and logging design

## 4. Tech Stack Explanation

### React

React will be used for the frontend because it is a widely adopted JavaScript library for building interactive user interfaces. It supports reusable components, strong ecosystem tooling, and clear separation between UI state, API calls, and presentation logic.

In this project, React will power:

- Product listing pages
- Product detail pages
- Shopping cart interface
- Authentication forms
- Customer order views
- Admin dashboard screens

React is also a strong portfolio choice because it is commonly used in modern full-stack roles.

### FastAPI

FastAPI will be used for the backend because it is fast, modern, and beginner-friendly while still being production-capable. It provides automatic API documentation, strong request validation through Python type hints, and excellent support for REST API development.

In this project, FastAPI will handle:

- Authentication and authorization
- Product APIs
- Cart APIs
- Order APIs
- Payment APIs
- Admin APIs
- Integration points with PostgreSQL, Redis, and background workers

FastAPI also makes it easier to build clean, well-documented APIs that can be consumed by the React frontend.

### PostgreSQL

PostgreSQL will be used as the primary database because e-commerce systems depend on reliable relational data. Users, products, carts, orders, order items, and payments all have clear relationships that benefit from relational modeling.

PostgreSQL is a strong fit for:

- Durable customer and admin records
- Product catalog data
- Cart and order relationships
- Payment records
- Transactional consistency
- Query flexibility as the project grows

### Redis

Redis will be used as a cache and supporting infrastructure component. It is useful for data that needs to be accessed quickly or temporarily stored.

In later phases, Redis may support:

- Product catalog caching
- Frequently accessed product detail caching
- Temporary cart/session-related optimization
- Rate limiting support
- Task queue broker behavior depending on the chosen background worker implementation

Redis improves system performance by reducing repeated database reads for high-traffic data.

### Docker

Docker will be used to containerize the application services. Instead of installing every dependency directly on a local machine, Docker allows the project to define repeatable service environments.

Docker will support:

- Backend service container
- Frontend service container
- PostgreSQL container for local development
- Redis container for local development
- Background worker container
- Consistent development setup across machines

### Kubernetes

Kubernetes will be used to plan and manage cloud-native deployment. It allows multiple containers to run as coordinated services with scalable deployment patterns.

Kubernetes will support:

- Backend deployment
- Frontend deployment
- Worker deployment
- Service definitions
- ConfigMaps and Secrets planning
- PostgreSQL and Redis connection configuration
- Scaling application replicas
- Future cloud deployment patterns

### GitHub Actions

GitHub Actions will be used for CI/CD automation. It allows the project to automatically run checks when code is pushed or pull requests are opened.

Future GitHub Actions workflows may include:

- Backend linting
- Backend tests
- Frontend linting
- Frontend build checks
- Docker image build checks
- Security scanning
- Deployment pipeline preparation

### AWS-Ready Architecture

The project will be designed so it can later be deployed to AWS using managed services and cloud-native deployment tools.

Potential AWS services include:

- Amazon ECS or Amazon EKS for container orchestration
- Amazon RDS for PostgreSQL
- Amazon ElastiCache for Redis
- Amazon S3 for static assets
- Amazon CloudFront for CDN distribution
- AWS Secrets Manager or Parameter Store for configuration
- Amazon CloudWatch for logging and monitoring
- Elastic Load Balancing for routing traffic

The architecture will avoid hardcoding local assumptions so that the system can move from local Docker Compose to cloud infrastructure in future phases.

## 5. High-Level System Architecture

At a high level, the system will be organized into independent services that communicate through HTTP APIs, database connections, cache access, and asynchronous task workflows.

### Main Components

- **Frontend:** React application used by customers and admins.
- **Backend API:** FastAPI service that exposes REST endpoints.
- **Database:** PostgreSQL stores durable relational data.
- **Cache:** Redis stores frequently accessed or temporary data.
- **Async Worker:** Background worker processes long-running or delayed jobs.
- **Docker:** Packages each service into containers for local development and deployment.
- **Kubernetes:** Orchestrates services in a cloud-native environment.
- **CI/CD:** GitHub Actions validates and prepares the application for deployment.

### Request Flow

1. A customer or admin uses the React frontend in a browser.
2. The frontend sends HTTP requests to the FastAPI backend.
3. FastAPI validates requests, applies authentication and authorization rules, and runs business logic.
4. FastAPI reads from or writes to PostgreSQL for durable data such as users, products, carts, orders, and payments.
5. FastAPI uses Redis for cached product data or other high-speed temporary data.
6. For longer workflows, FastAPI places work into an async task queue or background worker flow.
7. The background worker processes tasks such as order confirmation, payment event handling, email notification preparation, or inventory-related updates.
8. Docker containers package the frontend, backend, database, Redis, and worker services.
9. Kubernetes runs the containers as deployable services with configurable scaling.
10. GitHub Actions runs automated checks and later supports build and deployment workflows.

### Architecture Diagram

```text
                    +----------------------+
                    |    GitHub Actions    |
                    |   CI/CD Workflows    |
                    +----------+-----------+
                               |
                               v
+----------------+     +-------+--------+       +----------------+
| React Frontend | --> | FastAPI Backend | <---> |  PostgreSQL DB |
+----------------+     +-------+--------+       +----------------+
                               |
                 +-------------+-------------+
                 |                           |
                 v                           v
          +-------------+             +---------------+
          | Redis Cache |             | Async Worker  |
          +-------------+             +---------------+
                 |                           |
                 +-------------+-------------+
                               |
                               v
                    +----------------------+
                    | Docker Containers    |
                    | Kubernetes Services  |
                    | AWS-Ready Deployment |
                    +----------------------+
```

## 6. User Roles

### Customer

A customer is a standard user of the e-commerce platform. Customers interact with the public shopping experience and can manage their own account, cart, orders, and payments.

Customer permissions include:

- Register a new account
- Log in and log out
- Browse products
- View product details
- Add items to cart
- Update cart items
- Place orders
- View their own orders
- Submit payments for their own orders

### Admin

An admin is a privileged user responsible for managing the product catalog and order workflows. Admin users have access to protected administrative APIs and frontend screens.

Admin permissions include:

- Log in with admin credentials
- Create products
- Update products
- Delete or deactivate products
- View all customer orders
- View order details
- Update order status
- Access admin-only system views

## 7. Database Design

The database will use PostgreSQL as the primary relational data store. The schema is designed around users, products, carts, orders, and payments.

### users

**Purpose:** Stores customer and admin account information.

**Important fields:**

- `id`: Primary key
- `email`: Unique user email address
- `password_hash`: Hashed password
- `full_name`: User display name
- `role`: User role, such as `customer` or `admin`
- `is_active`: Indicates whether the account is active
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One user can have one active cart
- One user can have many orders
- Admin users can manage products and orders through application permissions

### products

**Purpose:** Stores product catalog information.

**Important fields:**

- `id`: Primary key
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `stock_quantity`: Available inventory count
- `image_url`: Product image location
- `category`: Product category
- `is_active`: Indicates whether the product is available for purchase
- `created_at`: Product creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One product can appear in many cart items
- One product can appear in many order items

### carts

**Purpose:** Stores a customer's active shopping cart.

**Important fields:**

- `id`: Primary key
- `user_id`: Foreign key referencing `users.id`
- `status`: Cart status, such as `active`, `ordered`, or `abandoned`
- `created_at`: Cart creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One cart belongs to one user
- One cart has many cart items
- A cart can be converted into an order

### cart_items

**Purpose:** Stores individual products inside a cart.

**Important fields:**

- `id`: Primary key
- `cart_id`: Foreign key referencing `carts.id`
- `product_id`: Foreign key referencing `products.id`
- `quantity`: Number of units selected
- `unit_price`: Product price at the time it was added or last updated
- `created_at`: Cart item creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One cart item belongs to one cart
- One cart item references one product
- Many cart items can reference the same product across different carts

### orders

**Purpose:** Stores customer order records after checkout.

**Important fields:**

- `id`: Primary key
- `user_id`: Foreign key referencing `users.id`
- `cart_id`: Optional foreign key referencing `carts.id`
- `status`: Order status, such as `pending`, `paid`, `processing`, `shipped`, `delivered`, or `cancelled`
- `total_amount`: Total order cost
- `created_at`: Order creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One order belongs to one user
- One order can be created from one cart
- One order has many order items
- One order can have one or more payment records depending on payment workflow design

### order_items

**Purpose:** Stores products purchased as part of an order.

**Important fields:**

- `id`: Primary key
- `order_id`: Foreign key referencing `orders.id`
- `product_id`: Foreign key referencing `products.id`
- `quantity`: Number of units purchased
- `unit_price`: Product price at the time of purchase
- `line_total`: Quantity multiplied by unit price
- `created_at`: Order item creation timestamp

**Relationships:**

- One order item belongs to one order
- One order item references one product
- Many order items can reference the same product across different orders

### payments

**Purpose:** Stores payment records related to orders.

**Important fields:**

- `id`: Primary key
- `order_id`: Foreign key referencing `orders.id`
- `payment_provider`: Provider name, such as `stripe`, `paypal`, or `mock`
- `provider_payment_id`: External payment reference
- `amount`: Payment amount
- `status`: Payment status, such as `pending`, `succeeded`, `failed`, or `refunded`
- `created_at`: Payment creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One payment belongs to one order
- One order may have one payment in the first implementation
- Future implementations may support multiple payment attempts per order

## 8. API Endpoint Plan

The API will be designed around RESTful resources. Authentication will protect customer-specific and admin-specific actions.

### Authentication Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a new customer account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate a user and return an access token | Public |
| `POST` | `/api/v1/auth/logout` | Log out the current user or invalidate client session state | Authenticated user |
| `GET` | `/api/v1/auth/me` | Return the currently authenticated user's profile | Authenticated user |

### User Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/api/v1/users/me` | Get current user profile | Authenticated user |
| `PATCH` | `/api/v1/users/me` | Update current user profile | Authenticated user |
| `GET` | `/api/v1/users/{user_id}` | Get user details by ID | Admin |
| `GET` | `/api/v1/users` | List users | Admin |

### Product Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/api/v1/products` | List active products | Public |
| `GET` | `/api/v1/products/{product_id}` | View product details | Public |
| `GET` | `/api/v1/products/search` | Search or filter products | Public |
| `POST` | `/api/v1/products` | Create a product | Admin |
| `PATCH` | `/api/v1/products/{product_id}` | Update a product | Admin |
| `DELETE` | `/api/v1/products/{product_id}` | Delete or deactivate a product | Admin |

### Cart Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/api/v1/cart` | Get current user's active cart | Customer |
| `POST` | `/api/v1/cart/items` | Add product to cart | Customer |
| `PATCH` | `/api/v1/cart/items/{cart_item_id}` | Update cart item quantity | Customer |
| `DELETE` | `/api/v1/cart/items/{cart_item_id}` | Remove item from cart | Customer |
| `DELETE` | `/api/v1/cart` | Clear active cart | Customer |

### Order Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/orders` | Create an order from the active cart | Customer |
| `GET` | `/api/v1/orders` | List current user's orders | Customer |
| `GET` | `/api/v1/orders/{order_id}` | View a specific order | Customer owner or Admin |
| `PATCH` | `/api/v1/orders/{order_id}/status` | Update order status | Admin |
| `GET` | `/api/v1/admin/orders` | List all orders | Admin |

### Payment Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/payments` | Start payment for an order | Customer |
| `GET` | `/api/v1/payments/{payment_id}` | View payment status | Customer owner or Admin |
| `POST` | `/api/v1/payments/webhook` | Receive payment provider webhook events | Payment provider or secured webhook |
| `GET` | `/api/v1/admin/payments` | List payment records | Admin |

### Admin Endpoints

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/api/v1/admin/dashboard` | Return admin dashboard summary data | Admin |
| `GET` | `/api/v1/admin/users` | List all users | Admin |
| `GET` | `/api/v1/admin/products` | List all products, including inactive products | Admin |
| `GET` | `/api/v1/admin/orders` | List all orders | Admin |
| `PATCH` | `/api/v1/admin/orders/{order_id}/status` | Update order lifecycle status | Admin |

## 9. Folder Structure

The project will use a structure that separates backend code, frontend code, infrastructure files, CI/CD workflows, and documentation.

```text
cloud-native-ecommerce-platform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── auth.py
│   │   │   │   ├── users.py
│   │   │   │   ├── products.py
│   │   │   │   ├── cart.py
│   │   │   │   ├── orders.py
│   │   │   │   ├── payments.py
│   │   │   │   └── admin.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── permissions.py
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   └── payment.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── cart.py
│   │   │   ├── order.py
│   │   │   └── payment.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── product_service.py
│   │   │   ├── cart_service.py
│   │   │   ├── order_service.py
│   │   │   └── payment_service.py
│   │   ├── workers/
│   │   │   ├── tasks.py
│   │   │   └── worker.py
│   │   ├── main.py
│   │   └── dependencies.py
│   ├── tests/
│   │   ├── test_auth.py
│   │   ├── test_products.py
│   │   ├── test_cart.py
│   │   └── test_orders.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── authApi.js
│   │   │   ├── productApi.js
│   │   │   ├── cartApi.js
│   │   │   └── orderApi.js
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── admin/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   └── AdminDashboardPage.jsx
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── state/
│   │   │   ├── authStore.js
│   │   │   └── cartStore.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
│
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── worker-deployment.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── redis-deployment.yaml
│   ├── redis-service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
│
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       ├── frontend-ci.yml
│       └── docker-build.yml
│
├── docker-compose.yml
├── README.md
└── PHASE_1_ARCHITECTURE.md
```

## 10. Development Phases

### Phase 1: Architecture and Planning

Create the complete project blueprint, including problem statement, system architecture, database design, API plan, folder structure, and resume alignment.

### Phase 2: FastAPI Backend Setup

Initialize the backend service with FastAPI, environment configuration, health check endpoint, project structure, and local development workflow.

### Phase 3: PostgreSQL Database Setup

Connect FastAPI to PostgreSQL, define database models, prepare migration tooling, and create the first version of the relational schema.

### Phase 4: Authentication and Authorization

Add user registration, login, password hashing, JWT-based authentication, current-user lookup, and role-based access control for customer and admin users.

### Phase 5: Product Catalog APIs

Build product listing, product detail, product creation, product update, product deletion or deactivation, search, and filtering APIs.

### Phase 6: Cart and Order Processing

Build cart management APIs, checkout flow, order creation, order item generation, inventory validation, and order history APIs.

### Phase 7: Redis Caching

Add Redis to cache frequently accessed product catalog data, reduce database load, and prepare the application for performance-sensitive workflows.

### Phase 8: Async Background Processing

Introduce background worker architecture for order confirmation, payment event handling, email preparation, and other non-blocking workflows.

### Phase 9: React Frontend

Build the customer and admin frontend experiences, including authentication pages, product catalog, cart, checkout, order history, and admin dashboard.

### Phase 10: Docker, Kubernetes, and CI/CD

Containerize services with Docker, orchestrate them with Kubernetes manifests, and automate validation/build workflows using GitHub Actions.

## 11. Resume Alignment

This project directly supports the resume bullet:

> "Built a scalable full-stack e-commerce platform using React, FastAPI, PostgreSQL, and AWS, supporting secure user authentication, product catalog management, and real-time order processing workflows."

### How This Project Supports the Resume Bullet

- **React:** The frontend will demonstrate a complete customer and admin interface, including product browsing, cart management, checkout, and order views.
- **FastAPI:** The backend will expose clean REST APIs for authentication, users, products, carts, orders, payments, and admin workflows.
- **PostgreSQL:** The relational schema will model real e-commerce data, including users, products, carts, orders, order items, and payments.
- **AWS-ready architecture:** The service boundaries will be designed so the app can later be deployed using AWS services such as RDS, ElastiCache, S3, CloudFront, EKS, ECS, and CloudWatch.
- **Secure user authentication:** Later phases will add password hashing, token-based authentication, protected routes, and role-based authorization.
- **Product catalog management:** Admin APIs will support product creation, updates, deletion or deactivation, inventory fields, and public catalog browsing.
- **Real-time order processing workflows:** Cart-to-order conversion, payment status tracking, and async worker patterns will support realistic order lifecycle behavior.

### How Later Phases Strengthen the Project

- **Redis caching:** Shows performance optimization by caching frequently accessed product data and reducing database load.
- **Async processing:** Demonstrates backend architecture for non-blocking workflows such as order confirmation, payment event handling, and notification preparation.
- **Docker:** Shows the ability to containerize frontend, backend, database, cache, and worker services for consistent development and deployment.
- **Kubernetes:** Demonstrates cloud-native deployment knowledge, including deployments, services, config management, secrets, and scaling.
- **GitHub Actions:** Shows CI/CD experience through automated linting, testing, building, and future deployment workflows.
- **Production monitoring:** Future phases can add structured logging, health checks, metrics, alerts, and AWS CloudWatch integration to show production-readiness.

By completing each phase, this project will become a strong portfolio artifact that connects full-stack feature development with real deployment and infrastructure concepts.
