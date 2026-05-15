import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiClient, { getErrorMessage } from "../api/apiClient";

function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/cart");
      setCart(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load cart."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    setError("");
    setMessage("");

    try {
      const response = await apiClient.put(`/cart/items/${itemId}`, {
        quantity: Number(quantity),
      });
      setCart(response.data);
      setMessage("Cart updated.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update cart item."));
    }
  };

  const removeItem = async (itemId) => {
    setError("");
    setMessage("");

    try {
      const response = await apiClient.delete(`/cart/items/${itemId}`);
      setCart(response.data);
      setMessage("Item removed.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to remove cart item."));
    }
  };

  const checkout = async () => {
    setError("");
    setMessage("");

    try {
      const response = await apiClient.post("/orders/checkout");
      setCart({ ...cart, items: [], total_amount: 0 });
      setMessage(`Order #${response.data.id} created successfully.`);
    } catch (err) {
      setError(getErrorMessage(err, "Checkout failed."));
    }
  };

  if (loading) {
    return <p className="notice">Loading cart...</p>;
  }

  const items = cart?.items || [];

  return (
    <section>
      <div className="section-header">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Your Cart</h1>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      {items.length === 0 ? (
        <div className="panel">
          <p className="notice">Your cart is empty.</p>
          <Link className="button" to="/products">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="panel">
          <div className="table-list">
            {items.map((item) => (
              <div className="table-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>${Number(item.price).toFixed(2)} each</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, event.target.value)}
                />
                <strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong>
                <button className="button button-danger" type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <strong>Total: ${Number(cart.total_amount).toFixed(2)}</strong>
            <button className="button" type="button" onClick={checkout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
