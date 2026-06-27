"use client";

import { useEffect, useRef } from "react";

export default function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let rafId = 0;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const progress = Math.min(scrollY / vh, 1);
        if (bgRef.current) {
          bgRef.current.style.opacity = String(Math.max(1 - progress, 0));
        }
        if (videoRef.current) {
          const scale = 1 + progress * 0.15;
          const translateY = progress * 60;
          videoRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
        if (logoRef.current) {
          logoRef.current.style.opacity = String(Math.max(1 - progress * 2.5, 0));
          logoRef.current.style.transform = `translateY(${-progress * 80}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <>
      <div data-bg="dark" style={{ height: "100vh", position: "absolute", top: 0, left: 0, width: "100%", contain: "strict" }} />
      <div data-bg="dark" ref={bgRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 1, overflow: "hidden", contain: "strict" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            willChange: "transform",
            transform: "translateZ(0)",
          }}
        >
          <source src="/DDhero.mp4" type="video/mp4" />
        </video>
      </div>
      <div style={{
        position: "fixed",
        top: 0, left: 0, width: "100%", height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        pointerEvents: "none",
      }}>
        <div ref={logoRef} style={{ willChange: "transform, opacity", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <style>{`
            .hero-logo-img {
              width: min(320px, 65vw);
              height: auto;
              filter: drop-shadow(0 4px 30px rgba(0,0,0,0.4));
              margin-left: 120px;
            }
            @media (max-width: 768px) {
              .hero-logo-img { width: min(240px, 60vw); margin-left: 50px; }
            }
            @media (max-width: 480px) {
              .hero-logo-img { width: min(180px, 55vw); margin-left: 30px; }
            }
            .hero-caption {
              margin-left: 80px;
            }
            @media (max-width: 768px) {
              .hero-caption { margin-left: 30px; }
            }
            @media (max-width: 480px) {
              .hero-caption { margin-left: 15px; }
            }
          `}</style>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-logo-img"
            src="/logo-hero.png"
            alt="December Delights"
          />
          <p className="hero-caption" style={{
            fontFamily: "var(--font-chelsea-market), cursive",
            fontSize: "clamp(20px, 4vw, 36px)",
            fontWeight: 700,
            color: "#d05a68",
            textAlign: "center",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginTop: "16px",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}>
            NOT JUST A CAFE..!!
          </p>
        </div>
      </div>
    </>
  );
}
