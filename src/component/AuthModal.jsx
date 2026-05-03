import React, { useEffect } from "react";

export default function AuthModal({ onLogin, onSignup, onClose = () => {} }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes modalFadeUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-modal-card { animation: modalFadeUp 0.22s ease both; }
        .auth-modal-primary:hover { background: #86efac !important; }
        .auth-modal-outline:hover { background: rgba(74,222,128,0.08) !important; }
        .auth-modal-close:hover { background: rgba(255,255,255,0.1) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
        }}
      >
        {/* Card */}
        <div className="auth-modal-card" style={{
          width: "100%", maxWidth: "360px",
          background: "#0d120d",
          border: "1px solid rgba(74,222,128,0.18)",
          borderRadius: "1.5rem",
          padding: "2.25rem 2rem",
          position: "relative",
          boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
          fontFamily: "'DM Sans', sans-serif",
        }}>

          {/* Close button */}
          <button
            className="auth-modal-close"
            onClick={onClose}
            style={{
              position: "absolute", top: "1.1rem", right: "1.1rem",
              width: "2rem", height: "2rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "50%", border: "none",
              background: "rgba(255,255,255,0.04)",
              color: "#4b5563", cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "0.9rem", height: "0.9rem" }}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Lock icon */}
          <div style={{
            width: "3.25rem", height: "3.25rem", borderRadius: "0.9rem",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.18)",
            margin: "0 auto 1.25rem",
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "1.4rem", height: "1.4rem" }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.3rem", fontWeight: 700,
            color: "#f0fdf4", textAlign: "center",
            letterSpacing: "-0.3px", marginBottom: "0.5rem",
          }}>
            Sign in to continue
          </h2>

          <p style={{
            color: "#4b5563", fontSize: "0.83rem",
            lineHeight: 1.6, textAlign: "center",
            marginBottom: "1.75rem",
          }}>
            This feature is available to registered farmers.
            Create a free account or sign in to access it.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button
              className="auth-modal-primary"
              onClick={onLogin}
              style={{
                width: "100%", padding: "0.875rem",
                borderRadius: "0.8rem", border: "none",
                background: "#4ade80", color: "#052e16",
                fontSize: "0.875rem", fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
            <button
              className="auth-modal-outline"
              onClick={onSignup}
              style={{
                width: "100%", padding: "0.875rem",
                borderRadius: "0.8rem",
                background: "transparent",
                border: "1px solid rgba(74,222,128,0.22)",
                color: "#a7f3d0", fontSize: "0.875rem",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              Create Free Account
            </button>
          </div>

          <p style={{
            textAlign: "center", marginTop: "1.25rem",
            fontSize: "0.72rem", color: "#1f2d1f",
          }}>
            Free forever — no credit card required
          </p>
        </div>
      </div>
    </>
  );
}