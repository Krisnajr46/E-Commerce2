# React Frontend

This folder contains the Vite + React frontend for the Cloud-Native Full Stack E-Commerce Platform.

The backend must be running at:

```text
http://127.0.0.1:8000
```

## Install Dependencies

From the project root:

```powershell
cd frontend
npm install
```

## Run the Frontend

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Test Flow

1. Register a new customer account.
2. Login with the customer account.
3. View products from the catalog.
4. Open a product details page.
5. Add the product to the cart.
6. Open the cart and update or remove items.
7. Checkout the cart.
8. View created orders.
9. Login as an admin user.
10. Open Admin Products.
11. Create, edit, and delete products.

## Admin Testing

If you need an admin account during local development, update a registered user directly in PostgreSQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'customer@example.com';
```

Then login again so the frontend receives a token for the updated user role.
