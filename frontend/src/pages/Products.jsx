import { useEffect, useState } from "react";

import apiClient, { getErrorMessage } from "../api/apiClient";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/products", {
        params: {
          limit: 100,
          search: filters.search || undefined,
          category: filters.category || undefined,
        },
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
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchProducts();
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Products</h1>
        </div>
      </div>

      <form className="filter-bar" onSubmit={handleSubmit}>
        <input
          name="search"
          placeholder="Search by product name"
          value={filters.search}
          onChange={handleChange}
        />
        <input
          name="category"
          placeholder="Filter by category"
          value={filters.category}
          onChange={handleChange}
        />
        <button className="button" type="submit">
          Apply
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="notice">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="notice">No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
