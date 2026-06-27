"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import AdminLayout from "@/components/AdminLayout";
import { API } from "@/lib/api";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  total: number;
  status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#e67e22", bg: "#e67e2218" },
  confirmed: { label: "Confirmed", color: "#3498db", bg: "#3498db18" },
  packed: { label: "Packed", color: "#8e44ad", bg: "#8e44ad18" },
  ready: { label: "Ready for Pickup", color: "#27ae60", bg: "#27ae6018" },
  delivered: { label: "Delivered", color: "#1b3c33", bg: "#1b3c3318" },
  cancelled: { label: "Cancelled", color: "#e74c3c", bg: "#e74c3c18" },
};

const STATUS_FLOW = ["pending", "confirmed", "packed", "ready", "delivered"];

function playNotif() {
  try {
    const ctx = new AudioContext();
    const beep = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.4;
      osc.start(ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.stop(ctx.currentTime + start + dur);
    };
    beep(880, 0, 0.2);
    beep(1100, 0.15, 0.2);
    beep(1320, 0.3, 0.3);
  } catch {}
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<Set<number>>(new Set());
  const [newOrderPopup, setNewOrderPopup] = useState<Order | null>(null);
  const [role, setRole] = useState("");
  const knownIdsRef = useRef<Set<string>>(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRole(d.role || ""));
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/admin/orders`, { credentials: "include" });
      if (!r.ok) throw new Error();
      const data: Order[] = await r.json();

      const currentIds = new Set(data.map((o) => String(o.id)));

      if (knownIdsRef.current.size > 0) {
        const newOnes = data.filter(
          (o) => o.status === "pending" && !knownIdsRef.current.has(String(o.id))
        );
        if (newOnes.length > 0 && mountedRef.current) {
          playNotif();
          setNewOrderPopup(newOnes[0]);
          setNewOrderIds(new Set(newOnes.map((o) => o.id)));
          setTimeout(() => {
            if (mountedRef.current) {
              setNewOrderPopup(null);
              setNewOrderIds(new Set());
            }
          }, 10000);
        }
      }

      knownIdsRef.current = currentIds;
      setOrders(data);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
    const iv = setInterval(loadOrders, 5000);
    return () => clearInterval(iv);
  }, [loadOrders]);

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    fetch(`${API}/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("Delete this order permanently?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    fetch(`${API}/api/admin/orders/${id}`, { method: "DELETE", credentials: "include" });
  };

  const parseItems = (items: string): OrderItem[] => {
    try { return JSON.parse(items); } catch { return []; }
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2rem", color: "#1b3c33", letterSpacing: "0.05em" }}>Orders</h1>
          {pendingCount > 0 && <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.85rem", fontWeight: 700 }}>{pendingCount} new order{pendingCount > 1 ? "s" : ""} pending</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setFilter("")} style={{ padding: "0.5rem 1.2rem", borderRadius: "100px", border: !filter ? "2px solid #1b3c33" : "1.5px solid #ddd", background: !filter ? "#1b3c33" : "#fff", color: !filter ? "#fff" : "#586159", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>All ({orders.length})</button>
        {Object.entries(STATUS_MAP).map(([key, val]) => {
          const count = orders.filter((o) => o.status === key).length;
          return (
            <button key={key} onClick={() => setFilter(key)} style={{ padding: "0.5rem 1.2rem", borderRadius: "100px", border: filter === key ? `2px solid ${val.color}` : "1.5px solid #ddd", background: filter === key ? val.bg : "#fff", color: val.color, fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>{val.label} ({count})</button>
          );
        })}
      </div>

      {loading ? (
        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>Loading orders...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", borderRadius: "20px", boxShadow: "0 4px 24px rgba(27,60,51,0.06)" }}>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "1rem" }}>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {filtered.map((order) => {
            const items = parseItems(order.items);
            const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
            const isNew = newOrderIds.has(order.id);
            const nextIdx = STATUS_FLOW.indexOf(order.status);
            const nextStatus = nextIdx >= 0 && nextIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[nextIdx + 1] : null;
            const expanded = expandedId === order.id;

            return (
              <div key={order.id} style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: isNew ? `0 0 0 2px ${st.color}, 0 4px 24px rgba(27,60,51,0.1)` : "0 2px 16px rgba(27,60,51,0.05)", transition: "all 0.3s" }}>
                <div onClick={() => setExpandedId(expanded ? null : order.id)} style={{ padding: "1.2rem 1.5rem", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.1rem" }}>#{order.id}</span>
                    <div>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1b3c33", fontSize: "0.95rem" }}>{order.customer_name}</p>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem" }}>{order.customer_phone}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.1rem" }}>&#8377;{order.total}</span>
                    <span style={{ padding: "0.25rem 0.8rem", borderRadius: "20px", background: st.bg, color: st.color, fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.75rem" }}>{st.label}</span>
                    <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.75rem" }}>{new Date(order.created_at).toLocaleString()}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>

                {expanded && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #f0f0f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.75rem", marginBottom: "0.2rem" }}>Customer</p>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontWeight: 700, fontSize: "0.9rem" }}>{order.customer_name}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.75rem", marginBottom: "0.2rem" }}>Phone</p>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontWeight: 700, fontSize: "0.9rem" }}>{order.customer_phone}</p>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.75rem", marginBottom: "0.2rem" }}>Address</p>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontSize: "0.9rem" }}>{order.customer_address}</p>
                      </div>
                    </div>

                    <div style={{ background: "#faf8f5", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" }}>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.75rem", marginBottom: "0.5rem" }}>Items</p>
                      {items.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem", marginBottom: "0.3rem", color: "#1b3c33" }}>
                          <span>{item.name} x{item.quantity}</span>
                          <span style={{ fontWeight: 700 }}>&#8377;{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {nextStatus && (
                        <button onClick={() => updateStatus(order.id, nextStatus)} style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fff", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>
                          Mark as {STATUS_MAP[nextStatus].label}
                        </button>
                      )}
                      {order.status !== "cancelled" && order.status !== "delivered" && (
                        <button onClick={() => updateStatus(order.id, "cancelled")} style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}>Cancel</button>
                      )}
                      {role === "super_admin" && (
                        <button onClick={() => deleteOrder(order.id)} style={{ padding: "0.5rem 1.5rem", borderRadius: "100px", border: "1px solid #e74c3c", background: "#e74c3c", color: "#fff", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", marginLeft: "auto" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.3rem", verticalAlign: "middle" }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {typeof window !== "undefined" && createPortal(
        newOrderPopup ? (
          <>
            <style>{`@keyframes popupFadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes popupSlideUp { from { transform: translateY(40px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>
            <div onClick={() => setNewOrderPopup(null)} style={{ position: "fixed", inset: 0, zIndex: 99998, background: "rgba(0,0,0,0.6)", animation: "popupFadeIn 0.3s ease" }} />
            <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", animation: "popupSlideUp 0.4s ease" }}>
              <div style={{ background: "#fff", borderRadius: "24px", width: "520px", maxWidth: "95%", maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 25px 80px rgba(0,0,0,0.35)" }}>
                {/* Orange banner */}
                <div style={{ background: "linear-gradient(135deg, #e67e22, #f39c12)", borderRadius: "24px 24px 0 0", padding: "2rem 2rem 1.5rem", textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                  </div>
                  <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "rgba(255,255,255,0.85)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.3rem" }}>New Order Received</p>
                  <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#fff", fontSize: "2rem", letterSpacing: "0.05em" }}>Order #{newOrderPopup.id}</h2>
                </div>

                <div style={{ padding: "2rem" }}>
                  {/* Customer info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    <div style={{ background: "#faf8f5", borderRadius: "14px", padding: "1rem 1.25rem" }}>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Customer</p>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontWeight: 700, fontSize: "1.05rem" }}>{newOrderPopup.customer_name}</p>
                    </div>
                    <div style={{ background: "#faf8f5", borderRadius: "14px", padding: "1rem 1.25rem" }}>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Phone</p>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontWeight: 700, fontSize: "1.05rem" }}>{newOrderPopup.customer_phone}</p>
                    </div>
                    <div style={{ gridColumn: "1 / -1", background: "#faf8f5", borderRadius: "14px", padding: "1rem 1.25rem" }}>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.3rem" }}>Delivery Address</p>
                      <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontSize: "0.95rem", lineHeight: 1.5 }}>{newOrderPopup.customer_address}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>Items Ordered</p>
                    <div style={{ background: "#faf8f5", borderRadius: "14px", padding: "1rem 1.25rem" }}>
                      {(() => {
                        const items = parseItems(newOrderPopup.items);
                        return items.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < items.length - 1 ? "1px solid rgba(27,60,51,0.08)" : "none" }}>
                            <div>
                              <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1b3c33", fontWeight: 600, fontSize: "0.9rem" }}>{item.name}</p>
                              <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.78rem" }}>Qty: {item.quantity}</p>
                            </div>
                            <span style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.1rem" }}>&#8377;{item.price * item.quantity}</span>
                          </div>
                        ));
                      })()}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "2px solid #1b3c33" }}>
                        <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1b3c33", fontSize: "0.95rem" }}>Total</span>
                        <span style={{ fontFamily: "var(--font-bebas-neue), sans-serif", color: "#1b3c33", fontSize: "1.5rem" }}>&#8377;{newOrderPopup.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={() => { setExpandedId(newOrderPopup.id); setNewOrderPopup(null); }} style={{ flex: 1, padding: "1rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fff", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#153229"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#1b3c33"; }}
                    >View in Orders</button>
                    <button onClick={() => setNewOrderPopup(null)} style={{ padding: "1rem 2rem", borderRadius: "100px", border: "1.5px solid #ddd", background: "#fff", color: "#586159", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", transition: "border-color 0.2s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1b3c33"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ddd"; }}
                    >Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null,
        document.body
      )}
    </AdminLayout>
  );
}
