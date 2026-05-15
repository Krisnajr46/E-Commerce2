import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <p className="notice">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <section className="panel">
        <h1>Admin access required</h1>
        <p className="error-text">You are not allowed to access this resource.</p>
      </section>
    );
  }

  return children;
}

export default ProtectedRoute;
