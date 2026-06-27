"use client";

export default function Footer() {
  return (
    <footer data-bg="dark" style={{
      background: "#071f1a",
      borderTop: "1px solid rgba(200,169,122,0.08)",
      padding: "4rem 5% 2rem",
      position: "relative",
      zIndex: 50,
    }}>
      <style>{`
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer-link {
          display: block;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.8rem;
          color: rgba(245,240,235,0.7);
          margin-bottom: 0.5rem;
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 6px 0;
        }
        .footer-link:hover { color: #c8a97a; }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .footer-brand {
            grid-column: auto;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4rem;
          }
        }
      `}</style>

      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/logo.png" alt="December Delights" style={{ height: "140px", width: "auto", marginBottom: "12px" }} />
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#c8a97a",
            lineHeight: 1.4,
            letterSpacing: "0.05em",
            marginBottom: "8px",
          }}>NOT JUST A CAFE..<br />DECEMBER DELIGHTS..!!</p>

        </div>

        {[
          { title: "Explore", links: [{ l: "Menu", h: "/menu/" }, { l: "Story", h: "/#our-story" }, { l: "Visit Us", h: "/#visit" }] },
          { title: "Company", links: [{ l: "Franchise", h: "/franchise/" }, { l: "Careers", h: "/careers/" }, { l: "Contact", h: "/contact/" }] },
          { title: "Social", links: [{ l: "Instagram", h: "https://www.instagram.com/decemberdelights/" }] },
        ].map((col) => (
          <div key={col.title}>
            <h4 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#c8a97a",
              marginBottom: "1rem",
            }}>{col.title}</h4>
            {col.links.map((link) => (
              <a key={link.l} href={link.h} className="footer-link">{link.l}</a>
            ))}
          </div>
        ))}
      </div>

      <div style={{ height: "1px", background: "rgba(200,169,122,0.08)", marginBottom: "1.5rem", maxWidth: "1200px", margin: "0 auto 1.5rem" }} />

      <div className="footer-bottom">
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.7rem",
          color: "rgba(245,240,235,0.5)",
        }}>&copy; {new Date().getFullYear()} December Delights. All rights reserved.</span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "0.65rem",
          color: "rgba(245,240,235,0.35)",
          letterSpacing: "0.12em",
        }}>CRAFTED WITH PASSION</span>
      </div>
    </footer>
  );
}