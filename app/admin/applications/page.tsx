"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { API } from "@/lib/api";

interface ApplicationRecord {
  id: number;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  preferred_location?: string;
  subject?: string;
  message?: string;
  created_at?: string;
  status?: string;
  admin_notes?: string;
  login_id?: string;
  aadhaar?: string;
  pan?: string;
  bank_statement?: string;
  id_proof?: string;
  address_proof?: string;
  other_docs?: string;
  resume_url?: string;
}

interface Applications {
  franchise: ApplicationRecord[];
  careers: ApplicationRecord[];
  contacts: ApplicationRecord[];
}

const FRANCHISE_DOCS = [
  { key: "aadhaar", label: "Aadhaar Card" },
  { key: "pan", label: "PAN Card" },
  { key: "bank_statement", label: "Bank Statement" },
  { key: "id_proof", label: "ID Proof" },
  { key: "address_proof", label: "Address Proof" },
  { key: "other_docs", label: "Other Docs" },
];

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("type") || "franchise";
  const [tab, setTab] = useState<"franchise" | "careers" | "contacts">(initialTab as "franchise" | "careers" | "contacts");
  const [apps, setApps] = useState<Applications>({ franchise: [], careers: [], contacts: [] });
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [expandedApp, setExpandedApp] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API}/api/admin/applications`, { credentials: "include" });
        if (!r.ok) throw new Error();
        const data = await r.json();
        if (!cancelled) setApps(data);
      } catch {
        if (!cancelled) setError("Could not load applications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.role) setRole(d.role); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const updateStatus = async (type: string, id: number, status: string, notes?: string) => {
    setApps((prev) => ({
      ...prev,
      [type]: (prev[type as keyof Applications] || []).map((a) =>
        a.id === id ? { ...a, status, admin_notes: notes ?? a.admin_notes } : a
      ),
    }));
    fetch(`${API}/api/admin/${type}/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ status, admin_notes: notes }),
    });
  };

  const deleteApp = async (type: string, id: number) => {
    if (!confirm("Are you sure you want to delete this application? This cannot be undone.")) return;
    setApps((prev) => ({ ...prev, [type]: (prev[type as keyof Applications] || []).filter((a) => a.id !== id) }));
    fetch(`${API}/api/admin/${type}/${id}`, { method: "DELETE", credentials: "include" });
  };

  const deleteDoc = async (appId: number, docKey: string) => {
    if (!confirm(`Delete this document?`)) return;
    setApps((prev) => ({
      ...prev,
      franchise: prev.franchise.map((a) =>
        a.id === appId ? { ...a, [docKey]: "" } : a
      ),
    }));
    fetch(`${API}/api/admin/franchise/${appId}/doc`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ doc_key: docKey }),
    });
  };

  const statusColor = (s: string) => {
    if (s === "approved" || s === "hired") return "#27ae60";
    if (s === "rejected") return "#e74c3c";
    if (s === "submitted" || s === "pending") return "#3498db";
    if (s === "reviewing") return "#8e44ad";
    if (s === "shortlisted") return "#eab96a";
    if (s === "interview") return "#e67e22";
    return "#eab96a";
  };

  const CAREER_STATUSES = [
    { key: "reviewing", label: "Under Review", color: "#8e44ad" },
    { key: "shortlisted", label: "Shortlisted", color: "#eab96a" },
    { key: "interview", label: "Interview", color: "#e67e22" },
    { key: "hired", label: "Hired", color: "#27ae60" },
  ];

  let list = apps[tab] || [];
  if (filterStatus) list = list.filter((a) => a.status === filterStatus);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    list = list.filter((a) => (a.full_name || "").toLowerCase().includes(q) || (a.email || "").toLowerCase().includes(q) || (a.phone || "").toLowerCase().includes(q));
  }

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2rem", color: "#1b3c33", letterSpacing: "0.05em", marginBottom: "1.5rem" }}>Applications</h1>

      {error ? (
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Retry</button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {(["franchise", "careers", "contacts"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "0.6rem 1.5rem", borderRadius: "100px", border: "none", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                background: tab === t ? "#1b3c33" : "transparent", color: tab === t ? "#fdf9f4" : "#586159",
              }}>{t.charAt(0).toUpperCase() + t.slice(1)} ({(apps[t] || []).length})</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "10px", border: "1.5px solid #ddd", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem", width: "200px" }} placeholder="Search name/email/phone" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "10px", border: "1.5px solid #ddd", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem" }}>
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {loading ? (
            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>Loading applications...</p>
          ) : list.length === 0 ? (
            <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>No applications found.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {list.map((app: ApplicationRecord) => {
                const isExpanded = expandedApp === app.id;
                return (
                  <div key={app.id} style={{ background: "#fff", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 2px 16px rgba(27,60,51,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "1rem" }}>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                          <h3 style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1b3c33", fontSize: "1rem" }}>{app.full_name || app.name}</h3>
                        </div>
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.85rem" }}>{app.email}{app.phone ? ` | ${app.phone}` : ""}</p>
                        {app.position && <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.85rem" }}>Position: {app.position}</p>}
                        {app.preferred_location && <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.85rem" }}>Location: {app.preferred_location}</p>}
                        {app.login_id && <p style={{ fontFamily: "monospace", color: "#1b3c33", fontSize: "0.8rem", marginTop: "0.3rem" }}>Login: {app.login_id}</p>}
                        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#999", fontSize: "0.75rem", marginTop: "0.5rem" }}>{app.created_at ? new Date(app.created_at).toLocaleDateString() : ""}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "end" }}>
                        <span style={{ padding: "0.3rem 0.8rem", borderRadius: "20px", background: statusColor(app.status || "pending") + "18", color: statusColor(app.status || "pending"), fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.75rem", textTransform: "capitalize" }}>{app.status || "pending"}</span>
                        {tab === "careers" ? (
                          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                            {CAREER_STATUSES.map((cs) => (
                              <button key={cs.key} onClick={() => updateStatus(tab, app.id, cs.key)} style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: `1px solid ${cs.color}`, background: app.status === cs.key ? cs.color : "transparent", color: app.status === cs.key ? "#fff" : cs.color, fontSize: "0.7rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 600 }}>{cs.label}</button>
                            ))}
                            <button onClick={() => updateStatus(tab, app.id, "rejected")} style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid #e74c3c", background: app.status === "rejected" ? "#e74c3c" : "transparent", color: app.status === "rejected" ? "#fff" : "#e74c3c", fontSize: "0.7rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 600 }}>Reject</button>
                          </div>
                        ) : (
                          <div style={{ display: "flex", gap: "0.3rem" }}>
                            <button onClick={() => updateStatus(tab, app.id, "approved")} style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid #27ae60", background: app.status === "approved" ? "#27ae60" : "transparent", color: app.status === "approved" ? "#fff" : "#27ae60", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif" }}>Approve</button>
                            <button onClick={() => updateStatus(tab, app.id, "rejected")} style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid #e74c3c", background: app.status === "rejected" ? "#e74c3c" : "transparent", color: app.status === "rejected" ? "#fff" : "#e74c3c", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif" }}>Reject</button>
                          </div>
                        )}
                        {role === "super_admin" && <button onClick={() => deleteApp(tab, app.id)} style={{ padding: "0.3rem 0.7rem", borderRadius: "6px", border: "1px solid #999", background: "transparent", color: "#999", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif" }}>Delete</button>}
                      </div>
                    </div>

                    {/* Franchise Documents */}
                    {tab === "franchise" && (
                      <div style={{ marginTop: "1rem", borderTop: "1px solid #f0ede8", paddingTop: "1rem" }}>
                          <button onClick={() => setExpandedApp(isExpanded ? null : app.id)} style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", fontWeight: 700, color: "#1b3c33", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>&#9654;</span>
                          Documents ({FRANCHISE_DOCS.filter((d) => (app as unknown as Record<string, string>)[d.key]).length})
                        </button>
                        {isExpanded && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
                            {                            FRANCHISE_DOCS.map((doc) => {
                              const docPath = (app as unknown as Record<string, string>)[doc.key];
                              if (!docPath) return null;
                              return (
                                <div key={doc.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#f7f3ee", borderRadius: "10px", border: "1px solid #e8e4de" }}>
                                  <a href={docPath} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1b3c33", textDecoration: "underline", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {doc.label}
                                  </a>
                                  <button onClick={() => deleteDoc(app.id, doc.key)} style={{ marginLeft: "0.5rem", padding: "0.2rem 0.5rem", borderRadius: "6px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", fontSize: "0.7rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif", flexShrink: 0 }}>
                                    Delete
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Career Resume */}
                    {tab === "careers" && app.resume_url && (
                      <div style={{ marginTop: "1rem", borderTop: "1px solid #f0ede8", paddingTop: "1rem" }}>
                        <a href={app.resume_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", fontWeight: 600, color: "#1b3c33", textDecoration: "underline" }}>
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: "#fdf9f4", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159" }}>Loading...</p></main>}>
      <ApplicationsContent />
    </Suspense>
  );
}
