import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getErrorMessage } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/products");
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength="8"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Register;
