import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Cloud-Native Full Stack E-Commerce Platform</p>
        <h1>Shop, checkout, and manage orders through a modern full-stack app.</h1>
        <p>
          This React frontend connects to a FastAPI backend with authentication,
          product catalog APIs, cart management, checkout, orders, Redis caching,
          and background order workflow logs.
        </p>
        <div className="actions-row">
          <Link className="button" to="/products">
            Browse Products
          </Link>
          <Link className="button button-ghost" to="/register">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
