import { useEffect, useState } from "react";

import apiClient, { getErrorMessage } from "../api/apiClient";
import { sampleProducts } from "../data/sampleProducts";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock_quantity: "",
  category: "",
  image_url: "",
};

const normalizeProductName = (name) => name.trim().toLowerCase();

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingSamples, setAddingSamples] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/products", {
        params: { limit: 100 },
      });
      setProducts(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load products."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const buildPayload = () => ({
    name: form.name,
    description: form.description || null,
    price: Number(form.price),
    stock_quantity: Number(form.stock_quantity),
    category: form.category || null,
    image_url: form.image_url || null,
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await apiClient.put(`/products/${editingId}`, buildPayload());
        setMessage("Product updated.");
      } else {
        await apiClient.post("/products", buildPayload());
        setMessage("Product created.");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save product."));
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock_quantity: product.stock_quantity,
      category: product.category || "",
      image_url: product.image_url || "",
    });
    setMessage("");
    setError("");
  };

  const deleteProduct = async (productId) => {
    setError("");
    setMessage("");

    try {
      await apiClient.delete(`/products/${productId}`);
      setMessage("Product deleted.");
      fetchProducts();
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete product."));
    }
  };

  const handleAddSampleProducts = async () => {
    setError("");
    setMessage("Adding sample products...");
    setAddingSamples(true);

    try {
      const response = await apiClient.get("/products", {
        params: { limit: 100 },
      });
      const existingNames = new Set(response.data.map((product) => normalizeProductName(product.name)));
      let addedCount = 0;
      let skippedCount = 0;

      for (const sampleProduct of sampleProducts) {
        const productName = normalizeProductName(sampleProduct.name);

        if (existingNames.has(productName)) {
          skippedCount += 1;
          continue;
        }

        await apiClient.post("/products", {
          name: sampleProduct.name,
          description: sampleProduct.description,
          price: sampleProduct.price,
          stock_quantity: sampleProduct.stock_quantity,
          category: sampleProduct.category,
          image_url: sampleProduct.image_url,
        });
        existingNames.add(productName);
        addedCount += 1;
      }

      await fetchProducts();

      setMessage(`Added ${addedCount} products successfully. Skipped ${skippedCount} duplicate products.`);
    } catch {
      setMessage("");
      setError("Failed to add sample products");
    } finally {
      setAddingSamples(false);
    }
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Product Management</h1>
        </div>
        <button
          className="button"
          type="button"
          onClick={handleAddSampleProducts}
          disabled={addingSamples}
        >
          {addingSamples ? "Adding sample products..." : "Add Sample Products"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}

      <div className="admin-grid">
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Product" : "Create Product"}</h2>
          <label>
            Name
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>
          <label>
            Price
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Stock quantity
            <input
              name="stock_quantity"
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} />
          </label>
          <label>
            Image URL
            <input name="image_url" value={form.image_url} onChange={handleChange} />
          </label>
          <div className="actions-row">
            <button className="button" type="submit">
              {editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button className="button button-ghost" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="panel">
          <h2>Products</h2>
          {loading ? (
            <p className="notice">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="notice">No products found.</p>
          ) : (
            <div className="table-list">
              {products.map((product) => (
                <div className="admin-product-row" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <p>
                      ${Number(product.price).toFixed(2)} - {product.stock_quantity} in stock
                    </p>
                  </div>
                  <div className="actions-row compact">
                    <button className="button button-ghost" type="button" onClick={() => startEdit(product)}>
                      Edit
                    </button>
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminProducts;
