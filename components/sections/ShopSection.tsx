"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollFloat from "@/components/ScrollFloat";
import Image from "next/image";
import { API } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  original_price: number;
  category: string;
  image_url: string;
  stock: number;
  offer: string;
}

export default function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data) => setProducts(data.filter((p: Product) => p.stock > 0).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-bg="light" style={{ position: "relative", zIndex: 25, background: "linear-gradient(180deg, #faf8f5 0%, #f0ebe4 50%, #faf8f5 100%)", minHeight: "100vh", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
      <style>{`
        .shop-section { padding: 100px 80px; }
        .shop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
        .shop-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(28px, 6vw, 90px); font-weight: 700; color: #094b3d; margin-bottom: 20px; line-height: 1.15; }
        @media (max-width: 768px) {
          .shop-section { padding: 60px 24px; }
          .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
        @media (max-width: 480px) {
          .shop-section { padding: 40px 16px; }
          .shop-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
      <div className="shop-section" style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "16px", fontWeight: 700, letterSpacing: "6px", textTransform: "uppercase", color: "#c8a97a", marginBottom: "20px", display: "block" }}>Our Shop</span>
        <div style={{ width: "60px", height: "3px", background: "#c8a97a", marginBottom: "32px" }} />
        <h2 className="shop-heading">
          <ScrollFloat containerClassName="!my-0" textClassName="pb-1">Premium Products</ScrollFloat>
        </h2>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: 1.8, color: "#3d4a3e", maxWidth: "500px", marginBottom: "48px" }}>
          Handpicked coffee beans, blends, and accessories — crafted with care and delivered to your doorstep.
        </p>

        {loading ? (
          <div className="shop-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "16px", height: "320px", opacity: 0.5 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", color: "#094b3d", marginBottom: "8px" }}>Coming Soon</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "14px", color: "#3d4a3e" }}>Our premium products will be available here shortly.</p>
          </div>
        ) : (
          <div className="shop-grid">
            {products.map((product) => (
              <div key={product.id} style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #094b3d, #2d5a4a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "3rem", opacity: 0.4 }}>&#9749;</span>
                    </div>
                  )}
                  {product.offer && (
                    <span style={{ position: "absolute", top: "12px", left: "12px", background: "#e74c3c", color: "#fff", padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>{product.offer}</span>
                  )}
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", color: "#c8a97a", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>{product.category}</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#094b3d", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>{product.name}</h3>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", color: "#3d4a3e", fontSize: "12px", lineHeight: 1.6, marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "#094b3d", fontSize: "22px", fontWeight: 700 }}>&#8377;{product.price}</span>
                      {product.original_price > product.price && (
                        <span style={{ fontFamily: "'Montserrat', sans-serif", color: "#999", fontSize: "12px", textDecoration: "line-through", marginLeft: "8px" }}>&#8377;{product.original_price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/shop" style={{ display: "inline-block", padding: "14px 40px", fontFamily: "'Montserrat', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "#fff", background: "#094b3d", border: "none", borderRadius: "999px", cursor: "pointer", textDecoration: "none", transition: "background 0.3s ease, transform 0.3s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#073a2e"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#094b3d"; e.currentTarget.style.transform = "none"; }}
        >
          Visit Full Shop
        </Link>
      </div>
    </div>
  );
}
