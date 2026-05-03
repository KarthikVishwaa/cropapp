import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-950">
        <div className="flex flex-col items-center gap-3">
          <span className="text-5xl animate-bounce">🌾</span>
          <p className="text-green-300 text-sm font-medium tracking-widest uppercase animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save where user wanted to go, redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}