import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to original destination after login, or home
// Change the redirect fallback from "/home" to "/"
const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)" }}>

      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #34d399, transparent)", filter: "blur(60px)" }} />
        {/* Subtle grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
            style={{ background: "rgba(74,222,128,0.15)", border: "1.5px solid rgba(74,222,128,0.3)" }}>
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.5px" }}>
            FarmConnect
          </h1>
          <p className="text-emerald-400 mt-1 text-xs font-medium tracking-widest uppercase">
            Smart Agriculture Platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}>

          <h2 className="text-lg font-bold text-white mb-1">Welcome back</h2>
          <p className="text-emerald-300 text-xs mb-6">Sign in to access your farm dashboard</p>

          {error && (
            <div className="rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide"
                style={{ color: "#86efac" }}>EMAIL ADDRESS</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} required placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  caretColor: "#4ade80",
                }}
                onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.6)"}
                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.15)"}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide"
                style={{ color: "#86efac" }}>PASSWORD</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} required placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  caretColor: "#4ade80",
                }}
                onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.6)"}
                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.15)"}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full font-black py-3.5 rounded-xl text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? "rgba(74,222,128,0.4)" : "#4ade80",
                color: "#052e16",
                letterSpacing: "0.3px",
              }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          </div>

          <p className="text-center text-xs" style={{ color: "#86efac" }}>
            New to FarmConnect?{" "}
            <Link to="/signup" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              Create free account
            </Link>
          </p>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          🔒 Your farm data is secure & private
        </p>
      </div>
    </div>
  );
}