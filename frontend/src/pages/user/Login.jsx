import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  // Role hint passed from LandingPage
  const hintRole = location.state?.role;

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim())
      newErrors.username = "Username is required";
    else if (form.username.trim().length < 3)
      newErrors.username = "Must be at least 3 characters";
    if (!form.password.trim())
      newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Must be at least 6 characters";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");
    try {
      const response = await axios.post(
        "http://localhost:8083/api/auth/login",
        { username: form.username, password: form.password }
      );
      const { token, role } = response.data;

      // Check role matches what was selected on landing page
      if (hintRole && role !== hintRole) {
        setApiError(
          hintRole === "ADMIN"
            ? "This account does not have Admin privileges."
            : "Please use the Admin login for this account."
        );
        setLoading(false);
        return;
      }

      setAuth({ username: form.username, role }, token);
      navigate(role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });

    } catch (err) {
      setApiError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1>Smart Campus</h1>
          {/* Show which role they're logging in as */}
          <p>
            {hintRole === "ADMIN"
              ? "Signing in as Administrator"
              : hintRole === "USER"
              ? "Signing in as User"
              : "Sign in to access your dashboard"}
          </p>
          {/* Role badge */}
          {hintRole && (
            <div style={{
              display: "inline-block",
              marginTop: 8,
              padding: "3px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              background: hintRole === "ADMIN" ? "#fef3c7" : "#ecfdf5",
              color: hintRole === "ADMIN" ? "#d97706" : "#059669",
              border: `1px solid ${hintRole === "ADMIN" ? "#fde68a" : "#a7f3d0"}`,
            }}>
              {hintRole === "ADMIN" ? "🔧 Administrator" : "👤 User"}
            </div>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="api-error">
            <span>⚠</span> {apiError}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading
              ? <><div className="spinner"></div> Signing in...</>
              : `Sign In${hintRole ? ` as ${hintRole === "ADMIN" ? "Admin" : "User"}` : ""}`
            }
          </button>
        </form>

        {/* Back to landing */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>
            ← Back to Home
          </Link>
        </div>

        {/* Footer */}
        <div className="login-footer">
          Don't have an account?
          <Link to="/register">Register here</Link>
        </div>

      </div>
    </div>
  );
}