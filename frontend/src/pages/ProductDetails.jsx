import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import apiClient, { getErrorMessage } from "../api/apiClient";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(getErrorMessage(err, "Product not found."));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setError("");
    setMessage("");

    try {
      await apiClient.post("/cart/items", {
        product_id: Number(id),
        quantity: Number(quantity),
      });
      setMessage("Product added to cart.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to add product to cart."));
    }
  };

  if (loading) {
    return <p className="notice">Loading product...</p>;
  }

  if (error && !product) {
    return (
      <section className="panel">
        <h1>Product not found</h1>
        <p className="error-text">{error}</p>
        <Link className="button" to="/products">
          Back to Products
        </Link>
      </section>
    );
  }

  return (
    <section className="details-layout">
      <div className="details-image">
        <ProductImage src={product.image_url} alt={product.name} fallbackText="No image" />
      </div>
      <div className="panel">
        <p className="eyebrow">{product.category || "Uncategorized"}</p>
        <h1>{product.name}</h1>
        <p>{product.description || "No description available."}</p>
        <div className="details-meta">
          <strong>${Number(product.price).toFixed(2)}</strong>
          <span>{product.stock_quantity} in stock</span>
        </div>

        {isAuthenticated ? (
          <div className="cart-controls">
            <label>
              Quantity
              <input
                type="number"
                min="1"
                max={product.stock_quantity}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </label>
            <button className="button" type="button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        ) : (
          <p>
            <Link to="/login">Login</Link> to add this product to your cart.
          </p>
        )}

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    </section>
  );
}

export default ProductDetails;
