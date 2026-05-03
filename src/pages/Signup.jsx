import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 relative overflow-hidden py-10">
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-green-700 opacity-20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-emerald-400 opacity-10 rounded-full blur-2xl" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-400 bg-opacity-20 rounded-full border-2 border-green-400 border-opacity-40 mb-4">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">FarmConnect</h1>
          <p className="text-green-300 mt-1 text-sm">Create your free farmer account</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Get Started</h2>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-40 text-red-200 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-200 text-sm mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Ravi Kumar"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-green-300 placeholder-opacity-60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-green-300 placeholder-opacity-60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm mb-1.5 font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-green-300 placeholder-opacity-60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm mb-1.5 font-medium">I am a</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-green-900 border border-white border-opacity-20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
              >
                <option value="farmer">🌾 Farmer</option>
                <option value="expert">👨‍🔬 Agricultural Expert</option>
                <option value="trader">📦 Trader / Buyer</option>
              </select>
            </div>
            <div>
              <label className="block text-green-200 text-sm mb-1.5 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min 6 characters"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-green-300 placeholder-opacity-60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
              />
            </div>
            <div>
              <label className="block text-green-200 text-sm mb-1.5 font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-green-300 placeholder-opacity-60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 hover:bg-green-300 disabled:bg-green-700 text-green-950 font-bold py-3.5 rounded-xl text-sm transition-all duration-200 mt-2 shadow-lg hover:shadow-green-400/30"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <p className="text-center text-green-300 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
