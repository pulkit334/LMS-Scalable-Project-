import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const SecurityCheck = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  const [redirect, setRedirect] = useState(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (!token) { setTimeout(() => setRedirect(true), 2500); return false; }
    return false;
  });

  const [msg, setMsg] = useState(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (!token) { setTimeout(() => setMsg("Redirecting to Login..."), 1200); return "You are not logged in..."; }
    return "";
  });

  if (redirect) return <Navigate to="/Login" replace />;

  if (!token) return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(6px)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      zIndex: 9999, gap: "16px",
      animation: "fadeIn 0.4s ease"
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{
        width: "36px", height: "36px",
        border: "3px solid #e0e0e0",
        borderTop: "3px solid #555",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite"
      }} />

      <p style={{
        fontSize: "15px", color: "#444",
        fontFamily: "sans-serif", letterSpacing: "0.3px",
        margin: 0, transition: "opacity 0.5s ease",
      }}>
        {msg}
      </p>
    </div>
  );

  return children;
}

export default SecurityCheck;