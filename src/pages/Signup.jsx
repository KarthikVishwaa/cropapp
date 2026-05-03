import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", role: "farmer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email,
          phone: form.phone, password: form.password, role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      login(data.token, data.user);
    // After successful signup change:
navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    caretColor: "#4ade80",
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "#86efac" }}>
        {label}
      </label>
      <input
        type={type} name={name} value={form[name]}
        onChange={handleChange} required placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
        style={inputStyle}
        onFocus={e => e.target.style.border = "1px solid rgba(74,222,128,0.6)"}
        onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.15)"}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10"
      style={{ background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #065f46 100%)" }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] right-[-5%] w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4ade80, transparent)", filter: "blur(70px)" }} />
        <div className="absolute bottom-[-15%] left-[-5%] w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #34d399, transparent)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
            style={{ background: "rgba(74,222,128,0.15)", border: "1.5px solid rgba(74,222,128,0.3)" }}>
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: "-0.5px" }}>
            Join FarmConnect
          </h1>
          <p className="text-emerald-400 mt-1 text-xs font-medium tracking-widest uppercase">
            Free forever for farmers
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}>

          {error && (
            <div className="rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="FULL NAME" name="name" placeholder="Ravi Kumar" />
            <Field label="EMAIL ADDRESS" name="email" type="email" placeholder="you@example.com" />
            <Field label="PHONE NUMBER" name="phone" type="tel" placeholder="+91 98765 43210" />

            <div>
              <label className="block text-xs font-semibold mb-1.5 tracking-wide" style={{ color: "#86efac" }}>
                I AM A
              </label>
              <select name="role" value={form.role} onChange={handleChange}
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{ background: "#0f3d20", border: "1px solid rgba(255,255,255,0.15)" }}>
                <option value="farmer">🌾 Farmer</option>
                <option value="expert">👨‍🔬 Agricultural Expert</option>
                <option value="trader">📦 Trader / Buyer</option>
              </select>
            </div>

            <Field label="PASSWORD" name="password" type="password" placeholder="Min 6 characters" />
            <Field label="CONFIRM PASSWORD" name="confirmPassword" type="password" placeholder="••••••••" />

            <button type="submit" disabled={loading}
              className="w-full font-black py-3.5 rounded-xl text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? "rgba(74,222,128,0.4)" : "#4ade80",
                color: "#052e16",
              }}>
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "#86efac" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}