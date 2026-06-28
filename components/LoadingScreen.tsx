"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFade(true), 500);
    const timer2 = setTimeout(() => setShow(false), 800);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(7, 31, 26, 0.7)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      opacity: fade ? 0 : 1,
      transition: "opacity 0.3s ease",
      pointerEvents: fade ? "none" : "auto",
      willChange: "opacity",
      transform: "translateZ(0)",
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-icon.png"
        alt="December Delights"
        style={{
          width: "min(120px, 30vw)",
          height: "auto",
          borderRadius: 0,
          filter: "drop-shadow(0 4px 20px rgba(200,169,122,0.3))",
        }}
      />
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: "clamp(12px, 3vw, 20px)",
        fontWeight: 800,
        color: "#D05A68",
        textAlign: "center",
        letterSpacing: "3px",
        textTransform: "uppercase",
        margin: 0,
      }}>
        NOT JUST A CAFE
      </p>
    </div>
  );
}
