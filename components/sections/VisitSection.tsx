"use client";

import { useRef, useEffect } from "react";
import ScrollFloat from "@/components/ScrollFloat";

export default function VisitSection() {
  const video1Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video1Ref.current;
    return () => {
      if (v) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      }
    };
  }, []);

  return (
    <>
      <style>{`
        .visit-section { position: relative; z-index: 25; height: 100vh; display: flex; background: #faf8f5; isolation: isolate; }
        .visit-text { flex: 1; padding: 100px 80px; display: flex; flex-direction: column; justify-content: center; }
        .visit-video-wrap { width: 42%; padding: 60px 60px 60px 0; display: flex; align-items: center; }
        .visit-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 4vw, 60px); font-weight: 700; line-height: 0.95; color: #094b3d; margin-bottom: 30px; text-transform: uppercase; }
        .visit-buttons { display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .visit-section { flex-direction: column; height: auto; min-height: 100vh; }
          .visit-text { padding: 60px 24px; }
          .visit-video-wrap { width: 100%; padding: 0 24px 60px; height: 50vh; }
        }
        @media (max-width: 480px) {
          .visit-text { padding: 40px 16px; }
          .visit-buttons { flex-direction: column; }
          .visit-buttons a { width: 100%; justify-content: center; }
        }
      `}</style>
      <div data-bg="light" className="visit-section">
        <div className="visit-text">
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: "#c8a97a", marginBottom: "20px", display: "block" }}>Visit Us</span>
          <div style={{ width: "60px", height: "3px", background: "#c8a97a", marginBottom: "32px" }} />
          <h2 className="visit-heading">
            <ScrollFloat containerClassName="!my-0">Let&apos;s Connect</ScrollFloat>
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: 1.8, color: "#3d4a3e", marginBottom: "36px", maxWidth: "480px" }}>
            We&apos;d love to see you at December Delights. Drop by for a cup of something wonderful.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "3px", height: "28px", background: "#c8a97a", borderRadius: "2px" }} />
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 500, color: "#1a1a1a" }}>Open Daily: 11:00 AM - 11:00 PM</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "3px", height: "28px", background: "#c8a97a", borderRadius: "2px" }} />
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 500, color: "#1a1a1a" }}>Follow us @decemberdelights</p>
            </div>
          </div>
          <div className="visit-buttons">
            <a href="https://www.google.com/maps/place/December+Delights/@18.0050405,79.5520925,17z/data=!3m1!4b1!4m6!3m5!1s0x3a334f0071e6bb0f:0xcb45fa2eee537062!8m2!3d18.0050405!4d79.5520925!16s%2Fg%2F11x1__1gvb?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 32px", fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#f5f0eb", background: "#094b3d", border: "none", borderRadius: "999px", cursor: "pointer", textDecoration: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5f0eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Get Directions
            </a>
            <a href="https://www.instagram.com/decemberdelights/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 32px", fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#094b3d", background: "transparent", border: "2px solid #094b3d", borderRadius: "999px", cursor: "pointer", textDecoration: "none", transition: "background 0.3s ease, color 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#094b3d"; e.currentTarget.style.color = "#f5f0eb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#094b3d"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Join Our Community
            </a>
          </div>
        </div>
        <div className="visit-video-wrap">
          <div style={{ width: "100%", height: "100%", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <video ref={video1Ref} src="/video.mp4" autoPlay muted loop playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>
    </>
  );
}
