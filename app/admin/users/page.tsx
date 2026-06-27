"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { API } from "@/lib/api";
import { adminInputStyle } from "@/lib/styles";

interface AdminUser {
  id: number;
  username: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const MAX_ADMINS = 5;

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: string; username: string; id?: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ username: "", password: "", role: "admin" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.authenticated) { router.push("/admin"); return; }
        if (d.role !== "super_admin") { router.push("/admin/dashboard"); return; }
        setCurrentUser(d);
      })
      .catch(() => router.push("/admin"));
  }, [router]);

  const loadUsers = async () => {
    try {
      const r = await fetch(`${API}/api/admin/users`, { credentials: "include" });
      if (!r.ok) throw new Error();
      setUsers(await r.json());
      setError("");
    } catch {
      setError("Could not load admin users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentUser?.role === "super_admin") loadUsers();
  }, [currentUser]);

  const adminCount = users.filter((u) => u.role === "admin").length;
  const atLimit = adminCount >= MAX_ADMINS;

  const openNew = () => {
    setEditing(null);
    setForm({ username: "", password: "", role: "admin" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({ username: user.username, password: "", role: user.role });
    setError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.username) { setError("Username is required"); return; }
    if (!editing && !form.password) { setError("Password is required"); return; }
    if (!editing && form.role === "admin" && atLimit) {
      setError(`Maximum ${MAX_ADMINS} normal admins allowed. Delete an existing admin first.`);
      return;
    }

    if (editing) {
      setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...u, username: form.username, role: form.role } : u));
      setShowForm(false);
      setError("");
      const body: Record<string, unknown> = { username: form.username, role: form.role, is_active: editing.is_active };
      if (form.password) body.password = form.password;
      const r = await fetch(`${API}/api/admin/users/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify(body),
      });
      if (!r.ok) { const data = await r.json(); setError(data.error); loadUsers(); }
    } else {
      const r = await fetch(`${API}/api/admin/users`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error); return; }
      setUsers((prev) => [...prev, { id: data.id as number, username: form.username, role: form.role, is_active: true, created_at: "" }]);
      setShowForm(false);
      setError("");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this admin user? This cannot be undone.")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    const r = await fetch(`${API}/api/admin/users/${id}`, { method: "DELETE", credentials: "include" });
    const data = await r.json();
    if (!r.ok) { alert(data.error); loadUsers(); }
  };

  const handleToggleActive = async (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      alert("You cannot disable your own account.");
      return;
    }
    const newActive = !user.is_active;
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_active: newActive } : u));
    const r = await fetch(`${API}/api/admin/users/${user.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ is_active: newActive, role: user.role }),
    });
    if (!r.ok) { const data = await r.json(); alert(data.error); loadUsers(); }
  };

  if (!currentUser || currentUser.role !== "super_admin") {
    return <AdminLayout><p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159" }}>Access denied. Super admin only.</p></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2rem", color: "#1b3c33", letterSpacing: "0.05em" }}>Admin Users</h1>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.85rem" }}>Manage admin accounts and roles</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Admin count badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "12px", background: atLimit ? "#e74c3c08" : "#1b3c3308", border: `1px solid ${atLimit ? "#e74c3c20" : "#1b3c3315"}` }}>
            <div style={{ position: "relative", width: "48px", height: "6px", borderRadius: "3px", background: "#e8e5e0", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(adminCount / MAX_ADMINS) * 100}%`, borderRadius: "3px", background: atLimit ? "#e74c3c" : adminCount >= 3 ? "#eab96a" : "#27ae60", transition: "width 0.3s ease" }} />
            </div>
            <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.75rem", fontWeight: 700, color: atLimit ? "#e74c3c" : "#586159" }}>
              {adminCount}/{MAX_ADMINS}
            </span>
          </div>
          <button
            onClick={openNew}
            disabled={atLimit}
            style={{
              padding: "0.7rem 1.8rem",
              borderRadius: "100px",
              border: "none",
              background: atLimit ? "#ccc" : "#1b3c33",
              color: "#fdf9f4",
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: atLimit ? "not-allowed" : "pointer",
              opacity: atLimit ? 0.6 : 1,
              transition: "all 0.2s ease",
            }}
          >
            + Add Admin
          </button>
        </div>
      </div>

      {/* Warning banner when at limit */}
      {atLimit && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "#e74c3c08", border: "1px solid #e74c3c20", borderRadius: "12px", padding: "0.8rem 1.2rem", marginBottom: "1.5rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.85rem", fontWeight: 600 }}>
            Maximum of {MAX_ADMINS} normal admins reached. Delete an existing admin to add a new one.
          </p>
        </div>
      )}

      {showForm && (
        <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 24px rgba(27,60,51,0.06)" }}>
          <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.3rem", color: "#1b3c33", marginBottom: "1.2rem" }}>
            {editing ? `Edit: ${editing.username}` : "New Admin"}
          </h2>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#e74c3c08", border: "1px solid #e74c3c20", borderRadius: "10px", padding: "0.6rem 1rem", marginBottom: "1rem" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.85rem" }}>{error}</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Username *</label>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} style={adminInputStyle} placeholder="Username" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>
                {editing ? "New Password (leave blank to keep)" : "Password *"}
              </label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={adminInputStyle} placeholder={editing ? "Leave blank to keep current" : "Password"} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Role *</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={adminInputStyle}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button onClick={handleSave} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              {editing ? "Update" : "Create"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "1.5px solid #ccc", background: "transparent", color: "#586159", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>Loading...</p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {users.map((user) => {
            const isSelf = user.id === currentUser?.id;
            return (
              <div key={user.id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
                borderRadius: "16px",
                padding: "1.2rem 1.5rem",
                boxShadow: "0 2px 16px rgba(27,60,51,0.05)",
                opacity: user.is_active ? 1 : 0.55,
                flexWrap: "wrap",
                gap: "0.75rem",
                borderLeft: isSelf ? "3px solid #eab96a" : "3px solid transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    background: user.role === "super_admin" ? "linear-gradient(135deg, #eab96a, #f5d9aa)" : "#1b3c3310",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, fontSize: "1rem", color: user.role === "super_admin" ? "#1b3c33" : "#1b3c33" }}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1b3c33", fontSize: "0.95rem" }}>
                        {user.username}
                        {isSelf && <span style={{ fontWeight: 500, color: "#999", fontSize: "0.8rem" }}> (you)</span>}
                      </span>
                      <span style={{
                        padding: "0.15rem 0.6rem",
                        borderRadius: "6px",
                        background: user.role === "super_admin" ? "#eab96a20" : "#1b3c3310",
                        color: user.role === "super_admin" ? "#b8860b" : "#1b3c33",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-outfit), sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}>
                        {user.role === "super_admin" ? "Super Admin" : "Admin"}
                      </span>
                      {!user.is_active && (
                        <span style={{ padding: "0.15rem 0.5rem", borderRadius: "6px", background: "#e74c3c18", color: "#e74c3c", fontSize: "0.7rem", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }}>
                          Disabled
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.8rem", marginTop: "0.2rem" }}>
                      {user.id === 1 ? "Original admin" : `Created ${user.created_at ? new Date(user.created_at).toLocaleDateString() : "\u2014"}`}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {!isSelf && (
                    <button
                      onClick={() => handleToggleActive(user)}
                      style={{
                        padding: "0.4rem 1rem",
                        borderRadius: "8px",
                        border: `1px solid ${user.is_active ? "#eab96a" : "#27ae60"}`,
                        background: "transparent",
                        color: user.is_active ? "#b8860b" : "#27ae60",
                        fontFamily: "var(--font-outfit), sans-serif",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {user.is_active ? "Disable" : "Enable"}
                    </button>
                  )}
                  <button onClick={() => openEdit(user)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#1b3c33", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>
                    Edit
                  </button>
                  {user.id !== 1 && (
                    <button onClick={() => handleDelete(user.id)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && users.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159" }}>No admin users found.</p>
        </div>
      )}
    </AdminLayout>
  );
}
