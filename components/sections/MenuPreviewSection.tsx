"use client";

import { useRef } from "react";
import ScrollFloat from "@/components/ScrollFloat";
import Image from "next/image";
import Link from "next/link";

const mustTryItems = [
  {
    name: "Classic Espresso",
    description: "Rich, bold, and perfectly extracted single-origin espresso",
    image: "/items/espresso.jpg",
  },
  {
    name: "Tiramisu",
    description: "Layers of coffee-soaked ladyfingers and mascarpone cream",
    image: "/items/tiramisu.jpg",
  },
  {
    name: "Basque Burnt Cheesecake",
    description: "Caramelized outside, creamy inside — the perfect indulgence",
    image: "/items/basque-cheesecake.jpg",
  },
  {
    name: "Fudge Brownie",
    description: "Dense, gooey, and loaded with rich dark chocolate",
    image: "/items/fudge-brownie.jpg",
  },
  {
    name: "Marry Me Chicken",
    description: "Creamy sun-dried tomato pasta that wins hearts",
    image: "/items/marry-me-chicken.jpg",
  },
  {
    name: "Bubble Tea",
    description: "Refreshing milk tea with chewy tapioca pearls",
    image: "/items/bubble-tea.jpg",
  },
];

export default function MenuPreviewSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const featured = mustTryItems[0];
  const grid = mustTryItems.slice(1);

  return (
    <>
      <style>{`
        .menu-section { position: relative; z-index: 25; background: linear-gradient(180deg, #041a14 0%, #094b3d 50%, #041a14 100%); padding: 100px 80px; min-height: 100vh; display: flex; align-items: center; gap: 60px; isolation: isolate; mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%); }
        .menu-content { max-width: 750px; width: 100%; position: relative; z-index: 3; margin-left: auto; }
        .menu-featured { background: rgba(255,255,255,0.04); border: 1px solid rgba(200,169,122,0.12); border-radius: 12px; overflow: hidden; display: flex; margin-bottom: 20px; }
        .menu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .menu-video-bg { position: absolute; top: 5%; left: 2%; width: 45%; height: 85%; object-fit: contain; z-index: 1; opacity: 1; filter: brightness(1.3); mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%); mask-composite: intersect; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%); -webkit-mask-composite: source-in; }
        @media (max-width: 768px) {
          .menu-section { flex-direction: column; padding: 60px 24px; min-height: auto; gap: 30px; }
          .menu-content { margin-left: 0; max-width: 100%; }
          .menu-featured { flex-direction: column; }
          .menu-featured > div:first-child { width: 100% !important; height: 200px !important; }
          .menu-grid { grid-template-columns: 1fr; }
          .menu-video-bg { position: relative; top: 0; left: 0; width: 100%; height: 200px; object-fit: cover; mask-image: none; -webkit-mask-image: none; mask-composite: unset; -webkit-mask-composite: unset; opacity: 0.6; border-radius: 12px; order: -1; }
        }
        @media (max-width: 480px) {
          .menu-section { padding: 40px 16px; }
        }
      `}</style>
      <div data-bg="dark" className="menu-section">
        <video
          ref={videoRef}
          src="/DDespresso.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="menu-video-bg"
        />
        <div className="menu-content">
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: "#c8a97a", marginBottom: "20px", display: "block" }}>
            <ScrollFloat containerClassName="!my-0">What We Serve</ScrollFloat>
          </span>
          <div style={{ width: "60px", height: "3px", background: "#c8a97a", marginBottom: "32px" }} />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 90px)", fontWeight: 700, color: "#fff", marginBottom: "20px", lineHeight: 1.15 }}>
            <ScrollFloat containerClassName="!my-0" textClassName="pb-1">Must-Try Delights</ScrollFloat>
          </h2>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: 1.8, color: "rgba(255,255,255,0.85)", maxWidth: "450px", marginBottom: "40px" }}>
            From handcrafted coffees to indulgent desserts, every item is made with love.
          </p>
          <div style={{ marginBottom: "40px" }}>
            <div className="menu-featured">
              <div style={{ width: "280px", height: "220px", position: "relative", flexShrink: 0 }}>
                <Image src={featured.image} alt={featured.name} fill loading="lazy" sizes="280px" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "9px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a97a", marginBottom: "8px" }}>
                  Signature
                </span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 700, color: "#c8a97a", marginBottom: "8px" }}>
                  {featured.name}
                </h3>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "13px", fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, maxWidth: "300px" }}>{featured.description}</p>
              </div>
            </div>
            <div className="menu-grid">
              {grid.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,122,0.12)", borderRadius: "12px", overflow: "hidden", display: "flex" }}>
                  <div style={{ width: "120px", height: "120px", position: "relative", flexShrink: 0 }}>
                    <Image src={item.image} alt={item.name} fill loading="lazy" sizes="120px" style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 700, color: "#c8a97a", marginBottom: "6px" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/menu" style={{ padding: "14px 40px", fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#094b3d", background: "#fff", border: "none", borderRadius: "999px", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
            View Full Menu
          </Link>
        </div>
      </div>
    </>
  );
}