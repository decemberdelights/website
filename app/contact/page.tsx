"use client";

import { MapPin, Instagram, Phone } from "@/components/icons";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section data-bg="dark" style={{ minHeight: "60vh", background: "#0c1a14", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(234,185,106,0.08) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "900px", margin: "0 auto", padding: "10rem 5% 6rem", textAlign: "center" }}>
          <style>{`
            .contact-hero-pad { padding: 10rem 5% 6rem; }
            .contact-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 1.5rem; }
            .contact-card { background: #fff; border-radius: 24px; padding: 2.5rem 2rem; text-align: center; text-decoration: none; box-shadow: 0 2px 24px rgba(27,60,51,0.04); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
            @media (max-width: 768px) {
              .contact-hero-pad { padding: 8rem 4% 4rem; }
              .contact-card { padding: 2rem 1.25rem; }
            }
            @media (max-width: 480px) {
              .contact-hero-pad { padding: 7rem 4% 3rem; }
              .contact-card { padding: 1.75rem 1rem; }
            }
          `}</style>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <span style={{ width: "40px", height: "1px", background: "#eab96a" }} />
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#eab96a", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase" }}>Get in Touch</span>
            <span style={{ width: "40px", height: "1px", background: "#eab96a" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#fdf9f4", fontSize: "clamp(2.2rem, 7vw, 5rem)", lineHeight: 1, letterSpacing: "0.03em", marginBottom: "1.5rem" }}>
            Contact Us
          </h1>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "rgba(253,249,244,0.55)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "540px", margin: "0 auto" }}>
            Visit us at our cafe, give us a call, or connect on Instagram. We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section data-bg="light" style={{ padding: "5rem 5%", background: "#fdf9f4" }}>
        <div className="contact-card-grid" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <a
            href="https://maps.app.goo.gl/zP5pu9ynX7dtSkow7"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,60,51,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 24px rgba(27,60,51,0.04)"; }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#1b3c3310", display: "flex", alignItems: "center", justifyContent: "center", color: "#1b3c33" }}>
              <MapPin size={28} />
            </div>
            <h3 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.4rem", letterSpacing: "0.03em" }}>Visit Our Cafe</h3>
            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Open daily from 10 AM to 11 PM.<br />Come experience the vibe in person.
            </p>
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#eab96a", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>Get Directions &rarr;</span>
          </a>

          <a
            href="https://www.instagram.com/decemberdelights?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,60,51,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 24px rgba(27,60,51,0.04)"; }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e1306c10", display: "flex", alignItems: "center", justifyContent: "center", color: "#e1306c" }}>
              <Instagram size={28} />
            </div>
            <h3 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.4rem", letterSpacing: "0.03em" }}>Follow on Instagram</h3>
            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.9rem", lineHeight: 1.6 }}>
              @decemberdelights.cafe<br />Stay updated with our latest posts and stories.
            </p>
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#eab96a", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>Follow Us &rarr;</span>
          </a>

          <a
            href="tel:+919676946460"
            className="contact-card"
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,60,51,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 24px rgba(27,60,51,0.04)"; }}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#27ae6010", display: "flex", alignItems: "center", justifyContent: "center", color: "#27ae60" }}>
              <Phone size={28} />
            </div>
            <h3 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.4rem", letterSpacing: "0.03em" }}>Call Us</h3>
            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.9rem", lineHeight: 1.6 }}>
              +91 96769 46460<br />Mon - Sun, 10 AM to 11 PM
            </p>
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#eab96a", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.05em" }}>Call Now &rarr;</span>
          </a>
        </div>
      </section>

      {/* Join Community CTA */}
      <section data-bg="dark" style={{ padding: "5rem 5%", background: "#1b3c33", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#fdf9f4", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "0.03em", marginBottom: "1rem" }}>Join Our Community</h2>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "rgba(253,249,244,0.6)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            Be part of the December Delights family. Follow us for exclusive updates, new menu drops, and behind-the-scenes moments.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://www.instagram.com/decemberdelights.cafe" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2.5rem", borderRadius: "100px", background: "#fdf9f4", color: "#1b3c33", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: "0.95rem", textDecoration: "none" }}>
              Follow on Instagram
            </a>
            <a href="tel:+919676946460" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2.5rem", borderRadius: "100px", border: "1.5px solid rgba(253,249,244,0.3)", background: "transparent", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
              Call +91 96769 46460
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
