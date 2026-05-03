import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ── Validation ────────────────────────────────────────
function validateLogin(form) {
  const errors = {};
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  return errors;
}

// ── Input Field ───────────────────────────────────────
function Field({ label, name, type = "text", placeholder, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{
        display: "block",
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: error ? "#f87171" : "#6ee7b7",
        marginBottom: "0.4rem",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPassword && show ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: isPassword ? "0.8rem 3rem 0.8rem 1rem" : "0.8rem 1rem",
            borderRadius: "0.65rem",
            border: error
              ? "1.5px solid rgba(248,113,113,0.7)"
              : "1.5px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#f0fdf4",
            fontSize: "0.9rem",
            outline: "none",
            boxSizing: "border-box",
            transition: "border 0.2s",
            fontFamily: "inherit",
          }}
          onFocus={e => {
            e.target.style.border = error
              ? "1.5px solid rgba(248,113,113,0.9)"
              : "1.5px solid rgba(74,222,128,0.6)";
          }}
          onBlur={e => {
            e.target.style.border = error
              ? "1.5px solid rgba(248,113,113,0.7)"
              : "1.5px solid rgba(255,255,255,0.1)";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            style={{
              position: "absolute", right: "0.85rem",
              top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none",
              cursor: "pointer", padding: 0,
              color: "#6b7280",
              display: "flex", alignItems: "center",
            }}
          >
            {show ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ width: "1rem", height: "1rem" }}>
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ width: "1rem", height: "1rem" }}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p style={{
          color: "#f87171", fontSize: "0.72rem",
          marginTop: "0.3rem", marginLeft: "0.1rem",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Login Page ────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(err => ({ ...err, [e.target.name]: "" }));
    }
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #052e16 0%, #0f2d1a 50%, #052e16 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.25rem",
      boxSizing: "border-box",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0d1f12 inset !important;
          -webkit-text-fill-color: #f0fdf4 !important;
        }
        .login-btn:hover:not(:disabled) { background: #86efac !important; }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1.25rem",
        padding: "clamp(1.5rem, 5vw, 2.5rem)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "3rem", height: "3rem",
            borderRadius: "0.75rem",
            background: "rgba(74,222,128,0.12)",
            border: "1px solid rgba(74,222,128,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "1.3rem", height: "1.3rem" }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 5vw, 1.9rem)",
            fontWeight: 900,
            color: "#f0fdf4",
            margin: 0,
            letterSpacing: "-0.5px",
          }}>
            Welcome back
          </h1>
          <p style={{
            color: "#4b5563",
            fontSize: "0.83rem",
            marginTop: "0.35rem",
          }}>
            Sign in to your FarmConnect account
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: "0.65rem",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
            color: "#fca5a5",
            fontSize: "0.82rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "0.9rem", height: "0.9rem", flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
            style={{
              width: "100%",
              padding: "0.875rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#4ade80",
              color: "#052e16",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              marginTop: "0.5rem",
              transition: "background 0.18s",
              fontFamily: "inherit",
              letterSpacing: "0.02em",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: "0.75rem", margin: "1.5rem 0",
        }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          <span style={{ color: "#374151", fontSize: "0.72rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
        </div>

        <p style={{ textAlign: "center", fontSize: "0.83rem", color: "#4b5563", margin: 0 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{
            color: "#4ade80", fontWeight: 700,
            textDecoration: "none",
          }}>
            Create free account
          </Link>
        </p>
      </div>

      <p style={{
        marginTop: "1.5rem",
        fontSize: "0.72rem",
        color: "rgba(255,255,255,0.1)",
        textAlign: "center",
      }}>
        FarmConnect — Built for Indian Farmers
      </p>
    </div>
  );
}