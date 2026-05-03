import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileAvatar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  // Make initials from name
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>

      {/* Avatar circle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={user.name}
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #16a34a, #4ade80)",
          border: "2px solid #fff",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.85rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          letterSpacing: "0.5px",
        }}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          minWidth: "220px",
          background: "#0d120d",
          border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: "1rem",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
          zIndex: 99999,
          animation: "dropdownFade 0.15s ease both",
        }}>
          <style>{`
            @keyframes dropdownFade {
              from { opacity: 0; transform: translateY(-6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* User info */}
          <div style={{
            padding: "1rem 1.1rem 0.85rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {/* Big avatar */}
            <div style={{
              width: "3rem", height: "3rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #16a34a, #4ade80)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "1.1rem",
              marginBottom: "0.6rem",
              letterSpacing: "0.5px",
            }}>
              {initials}
            </div>

            <p style={{
              color: "#f0fdf4",
              fontWeight: 600,
              fontSize: "0.9rem",
              marginBottom: "0.15rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {user.name}
            </p>

            <p style={{
              color: "#4b5563",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {user.email}
            </p>

            {user.role && (
              <span style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "0.15rem 0.6rem",
                borderRadius: "9999px",
                background: "rgba(74,222,128,0.1)",
                border: "1px solid rgba(74,222,128,0.2)",
                color: "#4ade80",
                fontSize: "0.68rem",
                fontWeight: 600,
                textTransform: "capitalize",
                letterSpacing: "0.05em",
              }}>
                {user.role}
              </span>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.85rem 1.1rem",
              background: "transparent",
              border: "none",
              color: "#f87171",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {/* Logout icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "1rem", height: "1rem" }}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}