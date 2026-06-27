"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import ScrollFloat from "@/components/ScrollFloat";

const Lottie = lazy(() => import("lottie-react"));

export default function FranchiseSection() {
  const [handshakeData, setHandshakeData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/hand.json", { signal: controller.signal })
      .then((res) => res.json())
      .then(setHandshakeData)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return (
    <>
      <style>{`
        .franchise-section { position: relative; z-index: 25; background: #0c1a14; min-height: 100vh; overflow: hidden; }
        .franchise-inner { position: relative; display: flex; min-height: 100vh; align-items: center; }
        .franchise-anim { width: 50%; display: flex; align-items: center; justify-content: center; padding-top: 150px; }
        .franchise-anim-container { width: min(600px, 80vw); height: min(600px, 80vw); }
        .franchise-text { width: 50%; padding: 100px 80px 100px 40px; display: flex; flex-direction: column; justify-content: center; }
        .franchise-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 60px); font-weight: 700; line-height: 0.95; color: #fdf9f4; margin-bottom: 24px; }
        .franchise-text p { font-family: 'Montserrat', sans-serif; font-size: clamp(15px, 3.5vw, 19px); font-weight: 400; line-height: 1.8; color: rgba(253,249,244,0.8); margin-bottom: 36px; max-width: 520px; }
        .franchise-bg-text { position: absolute; top: -80px; right: -120px; font-family: 'Cormorant Garamond', serif; font-size: clamp(40px, 8vw, 120px); font-weight: 700; color: rgba(200,169,122,0.04); line-height: 1; pointer-events: none; white-space: nowrap; }
        @media (max-width: 768px) {
          .franchise-inner { flex-direction: column; min-height: auto; }
          .franchise-anim { width: 100%; padding-top: 100px; height: auto; }
          .franchise-anim-container { width: min(300px, 70vw); height: min(300px, 70vw); }
          .franchise-text { width: 100%; padding: 40px 24px 60px; }
          .franchise-bg-text { top: -40px; right: -30px; }
        }
        @media (max-width: 480px) {
          .franchise-text { padding: 32px 16px 48px; }
        }
      `}</style>
      <div data-bg="dark" className="franchise-section">
        <div className="franchise-bg-text">
          DECEMBER DELIGHTS
        </div>
        <div className="franchise-inner">
          <div className="franchise-anim">
            {handshakeData && (
              <div className="franchise-anim-container">
                <Suspense fallback={null}>
                  <Lottie animationData={handshakeData} loop={true} style={{ width: "100%", height: "100%" }} />
                </Suspense>
              </div>
            )}
          </div>
          <div className="franchise-text">
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: "#c8a97a", marginBottom: "20px", display: "block" }}>Franchise With Us</span>
            <div style={{ width: "60px", height: "3px", background: "#c8a97a", marginBottom: "32px" }} />
            <h2 className="franchise-heading">
              <ScrollFloat containerClassName="!my-0">Partner With a Brand</ScrollFloat><br /><ScrollFloat containerClassName="!my-0">Crafted for Excellence</ScrollFloat>
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400, lineHeight: 1.8, color: "rgba(253,249,244,0.8)", marginBottom: "36px", maxWidth: "520px" }}>
              Born from international culinary expertise and a love for exceptional coffee, December Delights is more than a caf&eacute; — it&apos;s an experience your community will love. We provide the proven systems, training, and support you need to build a thriving business — while you bring the passion to your city.
            </p>
            <a href="/franchise" style={{ display: "inline-flex", alignItems: "center", gap: "12px", padding: "16px 40px", fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#0c1a14", background: "#fff", border: "none", borderRadius: "999px", cursor: "pointer", textDecoration: "none", width: "fit-content", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Contact for Franchise
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
