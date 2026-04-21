import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiActivity, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const res = await axios.post("http://localhost:8081/login", {
        email,
        password,
      });

      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      if (user.role === "STUDENT") {
        navigate("/student-dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (user.role === "TECHNICIAN") {
        navigate("/technician-dashboard");
      }

    } catch (err) {
      setErrors({ general: "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-icon">
              <FiActivity className="logo-symbol" />
            </div>
            <div>
              <h1 className="brand-title">Smart Campus Operations Hub</h1>
              <p className="brand-subtitle">Welcome Back</p>
            </div>
          </div>
          <p className="auth-description">Sign in to access your dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {errors.general && (
            <div className="error-message">
              <FiAlertCircle className="error-icon" />
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && <span className="validation-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="validation-error">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner">Signing in...</span>
            ) : (
              <>
                <FiUser className="btn-icon" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <span className="auth-link" onClick={() => navigate("/register")}>
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;