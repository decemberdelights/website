"use client";

import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { API } from "@/lib/api";
import { adminInputStyle } from "@/lib/styles";

interface Job {
  id: number; title: string; department: string; location: string;
  job_type: string; description: string; is_active: boolean;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState({ title: "", department: "", location: "", job_type: "", description: "", is_active: true });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const mountedRef = useRef(true);

  const loadJobs = async () => {
    try {
      const r = await fetch(`${API}/api/jobs`, { credentials: "include" });
      if (!r.ok) throw new Error();
      setJobs(await r.json());
      setError("");
    } catch {
      setError("Could not load jobs. Make sure the backend server is running on port 5000.");
    }
    if (mountedRef.current) setLoading(false);
  };

  useEffect(() => {
    mountedRef.current = true;
    loadJobs();
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.role) setRole(d.role); })
      .catch(() => {});
    return () => { mountedRef.current = false; };
  }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", department: "", location: "", job_type: "", description: "", is_active: true }); setShowForm(true); };
  const openEdit = (job: Job) => { setEditing(job); setForm({ title: job.title, department: job.department, location: job.location, job_type: job.job_type, description: job.description, is_active: job.is_active }); setShowForm(true); };

  const handleSave = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/api/admin/jobs/${editing.id}` : `${API}/api/admin/jobs`;

    if (editing) {
      setJobs((prev) => prev.map((j) => j.id === editing.id ? { ...j, title: form.title, department: form.department, location: form.location, job_type: form.job_type, description: form.description, is_active: form.is_active } : j));
      setShowForm(false);
      fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(form) });
    } else {
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(form) });
      const data = await r.json();
      setJobs((prev) => [{ id: data.id, title: form.title, department: form.department, location: form.location, job_type: form.job_type, description: form.description, is_active: form.is_active }, ...prev]);
      setShowForm(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this job opening?")) return;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    fetch(`${API}/api/admin/jobs/${id}`, { method: "DELETE", credentials: "include" });
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2rem", color: "#1b3c33", letterSpacing: "0.05em" }}>Job Openings</h1>
        <button onClick={openNew} style={{ padding: "0.7rem 1.8rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>+ Add Opening</button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 24px rgba(27,60,51,0.06)" }}>
          <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.3rem", color: "#1b3c33", marginBottom: "1.2rem" }}>{editing ? "Edit Opening" : "New Opening"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={adminInputStyle} placeholder="e.g. Barista" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={adminInputStyle} placeholder="e.g. Kitchen" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={adminInputStyle} placeholder="e.g. Jaipur" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Type</label><input value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} style={adminInputStyle} placeholder="e.g. Full-time" /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} style={{ ...adminInputStyle, resize: "vertical" as const }} placeholder="Job description" /></div>
            <div style={{ display: "flex", alignItems: "end", paddingBottom: "0.3rem" }}><label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem", cursor: "pointer" }}><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button onClick={handleSave} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>{editing ? "Update" : "Create"}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "1.5px solid #ccc", background: "transparent", color: "#586159", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {error && <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

      {loading ? (
        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>Loading jobs...</p>
      ) : (
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {jobs.map((job) => (
            <div key={job.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: "12px", padding: "1rem 1.2rem", boxShadow: "0 2px 12px rgba(27,60,51,0.04)", opacity: job.is_active ? 1 : 0.5 }}>
              <div>
                <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1b3c33", fontSize: "0.95rem" }}>{job.title}</span>
                <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem", marginLeft: "0.75rem" }}>{job.department} &middot; {job.location} &middot; {job.job_type}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => openEdit(job)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#1b3c33", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                {role === "super_admin" && <button onClick={() => handleDelete(job.id)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
