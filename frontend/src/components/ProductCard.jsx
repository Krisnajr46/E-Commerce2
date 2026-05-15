import { Link } from "react-router-dom";

import ProductImage from "./ProductImage";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <ProductImage src={product.image_url} alt={product.name} fallbackText="No image" />
      </div>
      <div className="product-card-body">
        <p className="eyebrow">{product.category || "Uncategorized"}</p>
        <h3>{product.name}</h3>
        <p>{product.description || "No description available."}</p>
        <div className="product-meta">
          <strong>${Number(product.price).toFixed(2)}</strong>
          <span>{product.stock_quantity} in stock</span>
        </div>
        <Link className="button" to={`/products/${product.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
