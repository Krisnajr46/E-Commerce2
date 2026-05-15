import { useEffect, useState } from "react";

import apiClient, { getErrorMessage } from "../api/apiClient";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get("/orders");
        setOrders(response.data);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load orders."));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="notice">Loading orders...</p>;
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <p className="eyebrow">History</p>
          <h1>Your Orders</h1>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {orders.length === 0 ? (
        <p className="notice">No orders yet.</p>
      ) : (
        <div className="stack">
          {orders.map((order, index) => (
            <article className="panel" key={order.id}>
              <div className="order-header">
                <div>
                  <h2>Order #{index + 1}</h2>
                  <p>{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="status-pill">{order.status}</span>
                  <strong>${Number(order.total_amount).toFixed(2)}</strong>
                </div>
              </div>
              <div className="order-items">
                {order.items?.map((item) => (
                  <div key={item.id}>
                    <span>{item.product_name}</span>
                    <span>
                      {item.quantity} x ${Number(item.unit_price).toFixed(2)}
                    </span>
                    <strong>${Number(item.subtotal).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;
