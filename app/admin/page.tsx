"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) router.push("/admin/dashboard");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main style={{ minHeight: "100vh", background: "#0c1a14", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "rgba(253,249,244,0.8)", fontSize: "0.9rem" }}>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0c1a14", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2.5rem", color: "#fdf9f4", letterSpacing: "0.1em" }}>Admin Panel</h1>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "rgba(253,249,244,0.8)", fontSize: "0.9rem", marginTop: "0.5rem" }}>December Delights</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.8rem", color: "rgba(253,249,244,0.7)", letterSpacing: "0.05em", fontFamily: "var(--font-outfit), sans-serif" }}>Username</label>
              <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={{ width: "100%", padding: "0.9rem 1.2rem", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", fontSize: "0.95rem", fontFamily: "var(--font-outfit), sans-serif", color: "#fdf9f4", outline: "none", boxSizing: "border-box" as const }} placeholder="admin" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 700, fontSize: "0.8rem", color: "rgba(253,249,244,0.7)", letterSpacing: "0.05em", fontFamily: "var(--font-outfit), sans-serif" }}>Password</label>
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ width: "100%", padding: "0.9rem 1.2rem", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", fontSize: "0.95rem", fontFamily: "var(--font-outfit), sans-serif", color: "#fdf9f4", outline: "none", boxSizing: "border-box" as const }} placeholder="Password" />
            </div>
          </div>

          {error && <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.85rem", marginTop: "1rem", textAlign: "center" }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "1rem", borderRadius: "100px", border: "none", marginTop: "1.5rem",
            background: loading ? "#555" : "#eab96a", color: "#0c1a14", fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
