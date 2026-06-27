"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { API } from "@/lib/api";

interface Stats {
  franchise_count: number;
  career_count: number;
  contact_count: number;
  menu_count: number;
  product_count: number;
  job_opening_count: number;
  pending_franchise: number;
  pending_careers: number;
  pending_contacts: number;
  submitted_franchise: number;
  approved_franchise: number;
  rejected_franchise: number;
  order_count: number;
  recent_orders: Array<{ id: number; customer_name: string; total: number; status: string; created_at: string }>;
  recent_franchise: Array<{ id: number; full_name: string; email: string; status: string; created_at: string }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setStats)
      .catch(() => setError("Could not load dashboard data. Make sure the backend server is running on port 5000."));
  }, []);

  if (error) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e74c3c18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.5rem", marginBottom: "0.75rem" }}>Server Not Reachable</h2>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Retry</button>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) return <AdminLayout><p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>Loading...</p></AdminLayout>;

  const cards = [
    { label: "Orders", value: stats.order_count, href: "/admin/orders", color: "#e67e22" },
    { label: "Franchise Applications", value: stats.franchise_count, pending: stats.submitted_franchise, href: "/admin/applications?type=franchise", color: "#1b3c33" },
    { label: "Career Applications", value: stats.career_count, pending: stats.pending_careers, href: "/admin/applications?type=careers", color: "#2d5a4a" },
    { label: "Contact Inquiries", value: stats.contact_count, pending: stats.pending_contacts, href: "/admin/applications?type=contacts", color: "#3d7a62" },
    { label: "Menu Items", value: stats.menu_count, href: "/admin/menu", color: "#eab96a" },
    { label: "Products (Shop)", value: stats.product_count, href: "/admin/products", color: "#c0392b" },
    { label: "Job Openings", value: stats.job_opening_count, href: "/admin/jobs", color: "#8e44ad" },
  ];

  const hasNotifs = (stats.recent_orders && stats.recent_orders.length > 0) || (stats.recent_franchise && stats.recent_franchise.length > 0);

  return (
    <AdminLayout>
      <style>{`
        .dash-grid { display: grid; gap: 1.5rem; align-items: start; grid-template-columns: ${hasNotifs ? "1fr 340px" : "1fr"}; }
        .dash-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .dash-notif { position: sticky; top: 72px; }
        @media (max-width: 1024px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .dash-notif { position: static; }
        }
      `}</style>
      <div className="dash-grid">
        {/* Left - Main Content */}
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2rem", color: "#1b3c33", letterSpacing: "0.05em", marginBottom: "2rem" }}>Dashboard</h1>

          <div className="dash-cards">
            {cards.map((card) => (
              <Link key={card.label} href={card.href} style={{ display: "block", background: "#fff", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 4px 24px rgba(27,60,51,0.06)", textDecoration: "none", transition: "transform 0.3s", borderLeft: `4px solid ${card.color}` }}>
                <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.3rem" }}>{card.label}</p>
                <p style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2.2rem", color: "#1b3c33" }}>{card.value}</p>
                {card.pending !== undefined && card.pending > 0 && (
                  <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.75rem", fontWeight: 700, marginTop: "0.3rem" }}>{card.pending} pending review</p>
                )}
              </Link>
            ))}
          </div>

          {stats.franchise_count > 0 && (
            <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", boxShadow: "0 4px 24px rgba(27,60,51,0.06)" }}>
              <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.2rem", marginBottom: "1rem" }}>Franchise Overview</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fdf9f4", borderRadius: "12px" }}>
                  <p style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.8rem", color: "#eab96a" }}>{stats.pending_franchise}</p>
                  <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem" }}>Pending</p>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fdf9f4", borderRadius: "12px" }}>
                  <p style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.8rem", color: "#3498db" }}>{stats.submitted_franchise}</p>
                  <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem" }}>Under Review</p>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fdf9f4", borderRadius: "12px" }}>
                  <p style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.8rem", color: "#27ae60" }}>{stats.approved_franchise}</p>
                  <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem" }}>Approved</p>
                </div>
                <div style={{ textAlign: "center", padding: "1rem", background: "#fdf9f4", borderRadius: "12px" }}>
                  <p style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.8rem", color: "#e74c3c" }}>{stats.rejected_franchise}</p>
                  <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem" }}>Rejected</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Notifications */}
        {hasNotifs && (
          <div className="dash-notif">
            <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(27,60,51,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "1.25rem 1.5rem 1rem", borderBottom: "1px solid #f0ede8" }}>
                <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.1rem", letterSpacing: "0.03em" }}>Notifications</h2>
              </div>

              <div style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}>
                {stats.recent_orders && stats.recent_orders.length > 0 && (
                  <div>
                    <div style={{ padding: "0.75rem 1.5rem 0.4rem", background: "#faf8f5" }}>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent Orders</p>
                    </div>
                    {stats.recent_orders.map((order) => {
                      const statusColors: Record<string, { bg: string; text: string }> = {
                        pending: { bg: "#e67e2218", text: "#e67e22" },
                        confirmed: { bg: "#3498db18", text: "#3498db" },
                        packed: { bg: "#8e44ad18", text: "#8e44ad" },
                        ready: { bg: "#27ae6018", text: "#27ae60" },
                        delivered: { bg: "#1b3c3318", text: "#1b3c33" },
                        cancelled: { bg: "#e74c3c18", text: "#e74c3c" },
                      };
                      const st = statusColors[order.status] || statusColors.pending;
                      return (
                        <Link key={order.id} href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.5rem", textDecoration: "none", borderBottom: "1px solid #f8f6f2", transition: "background 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#faf8f5"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={st.text} strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                          </div>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1b3c33", fontSize: "0.85rem" }}>Order #{order.id}</p>
                            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer_name}</p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <p style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "0.95rem" }}>&#8377;{order.total}</p>
                            <span style={{ padding: "0.15rem 0.5rem", borderRadius: "8px", background: st.bg, color: st.text, fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.6rem", textTransform: "capitalize" }}>{order.status}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {stats.recent_franchise && stats.recent_franchise.length > 0 && (
                  <div>
                    <div style={{ padding: "0.75rem 1.5rem 0.4rem", background: "#faf8f5" }}>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.65rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>Franchise Applications</p>
                    </div>
                    {stats.recent_franchise.map((app) => {
                      const statusColors: Record<string, { bg: string; text: string }> = {
                        pending: { bg: "#eab96a18", text: "#b8860b" },
                        submitted: { bg: "#3498db18", text: "#3498db" },
                        approved: { bg: "#27ae6018", text: "#27ae60" },
                        rejected: { bg: "#e74c3c18", text: "#e74c3c" },
                      };
                      const st = statusColors[app.status] || statusColors.pending;
                      return (
                        <Link key={app.id} href="/admin/applications?type=franchise" style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.5rem", textDecoration: "none", borderBottom: "1px solid #f8f6f2", transition: "background 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#faf8f5"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: st.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={st.text} strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                          </div>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1b3c33", fontSize: "0.85rem" }}>{app.full_name}</p>
                            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.email}</p>
                          </div>
                          <span style={{ padding: "0.15rem 0.5rem", borderRadius: "8px", background: st.bg, color: st.text, fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.6rem", flexShrink: 0, textTransform: "capitalize" }}>{app.status || "pending"}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {!hasNotifs && (
                  <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{ margin: "0 auto 0.75rem" }}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                    <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.85rem" }}>No new notifications</p>
                  </div>
                )}
              </div>

              <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #f0ede8", display: "flex", gap: "0.5rem" }}>
                <Link href="/admin/orders" style={{ flex: 1, textAlign: "center", padding: "0.6rem", borderRadius: "10px", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#e67e22", textDecoration: "none", transition: "background 0.15s", border: "1px solid #e67e2220" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#e67e2210"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>View Orders</Link>
                <Link href="/admin/applications?type=franchise" style={{ flex: 1, textAlign: "center", padding: "0.6rem", borderRadius: "10px", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#1b3c33", textDecoration: "none", transition: "background 0.15s", border: "1px solid #1b3c3320" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#1b3c3310"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>View Franchise</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
