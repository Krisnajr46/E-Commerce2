import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        Cloud Commerce
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        {isAuthenticated && <NavLink to="/cart">Cart</NavLink>}
        {isAuthenticated && <NavLink to="/orders">Orders</NavLink>}
        {isAdmin && <NavLink to="/admin/products">Admin Products</NavLink>}
      </nav>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="nav-user">{user?.full_name}</span>
            <button className="button button-ghost" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className="button button-ghost" to="/login">
              Login
            </NavLink>
            <NavLink className="button" to="/register">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
