"use client";

import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { API } from "@/lib/api";
import { adminInputStyle } from "@/lib/styles";

interface Product {
  id: number; category: string; name: string; description: string;
  price: number; original_price: number; image_url: string;
  is_active: boolean; stock: number; offer: string;
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ category: "", name: "", description: "", price: "", original_price: "", stock: "", is_active: true, offer: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("");
  const mountedRef = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = async () => {
    try {
      const r = await fetch(`${API}/api/admin/products`, { credentials: "include" });
      if (!r.ok) throw new Error();
      setItems(await r.json());
      setError("");
    } catch {
      setError("Could not load products. Make sure the backend server is running on port 5000.");
    }
    if (mountedRef.current) setLoading(false);
  };

  useEffect(() => {
    mountedRef.current = true;
    loadItems();
    fetch(`${API}/api/auth/check`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.role) setRole(d.role); })
      .catch(() => {});
    return () => { mountedRef.current = false; };
  }, []);

  const categories = [...new Set(items.map((i) => i.category))].sort();

  const openNew = () => { setEditing(null); setForm({ category: "", name: "", description: "", price: "", original_price: "", stock: "", is_active: true, offer: "" }); setImageFile(null); setImagePreview(""); setShowForm(true); };
  const openEdit = (item: Product) => { setEditing(item); setForm({ category: item.category, name: item.name, description: item.description, price: String(item.price), original_price: String(item.original_price), stock: String(item.stock), is_active: !!item.is_active, offer: item.offer || "" }); setImageFile(null); setImagePreview(item.image_url || ""); setShowForm(true); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { setError("Image must be under 15MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSave = async () => {
    if (!form.name || !form.category) { setError("Name and category are required"); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append("category", form.category);
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("original_price", form.original_price);
    fd.append("stock", form.stock);
    fd.append("is_active", String(form.is_active));
    fd.append("offer", form.offer);
    if (imageFile) fd.append("image", imageFile);
    else if (imagePreview && editing) fd.append("existing_image_url", editing.image_url);

    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/api/admin/products/${editing.id}` : `${API}/api/admin/products`;

    if (editing) {
      try {
        const r = await fetch(url, { method, credentials: "include", body: fd });
        const resp = await r.json();
        setItems((prev) => prev.map((p) => p.id === editing.id ? { ...p, category: form.category, name: form.name, description: form.description, price: Number(form.price), original_price: Number(form.original_price), stock: Number(form.stock), is_active: form.is_active, offer: form.offer, image_url: resp.image_url || p.image_url } : p));
      } catch {
        setItems((prev) => prev.map((p) => p.id === editing.id ? { ...p, category: form.category, name: form.name, description: form.description, price: Number(form.price), original_price: Number(form.original_price), stock: Number(form.stock), is_active: form.is_active, offer: form.offer } : p));
      }
      setShowForm(false);
      setSaving(false);
    } else {
      const r = await fetch(url, { method, credentials: "include", body: fd });
      const data = await r.json();
      if (!r.ok) { setError(data.error || "Save failed"); setSaving(false); return; }
      setItems((prev) => [{ id: data.id, category: form.category, name: form.name, description: form.description, price: Number(form.price), original_price: Number(form.original_price), stock: Number(form.stock), is_active: form.is_active, offer: form.offer, image_url: data.image_url || "" }, ...prev]);
      setShowForm(false);
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
    fetch(`${API}/api/admin/products/${id}`, { method: "DELETE", credentials: "include" });
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "2rem", color: "#1b3c33", letterSpacing: "0.05em" }}>Products Management</h1>
        <button onClick={openNew} style={{ padding: "0.7rem 1.8rem", borderRadius: "100px", border: "none", background: "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>+ Add Product</button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", borderRadius: "20px", padding: "2rem", marginBottom: "2rem", boxShadow: "0 4px 24px rgba(27,60,51,0.06)" }}>
          <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.3rem", color: "#1b3c33", marginBottom: "1.2rem" }}>{editing ? "Edit Product" : "New Product"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={adminInputStyle} placeholder="e.g. Coffee" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={adminInputStyle} placeholder="Product name" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Price (&#8377;)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={adminInputStyle} placeholder="e.g. 299" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Original Price (&#8377;)</label><input type="number" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} style={adminInputStyle} placeholder="e.g. 399" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={adminInputStyle} placeholder="e.g. 50" /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Offer</label><input value={form.offer} onChange={(e) => setForm({ ...form, offer: e.target.value })} style={adminInputStyle} placeholder="e.g. 10% OFF" /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...adminInputStyle, resize: "vertical" as const }} placeholder="Brief description" /></div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#586159", marginBottom: "0.3rem", fontFamily: "var(--font-outfit), sans-serif" }}>Image (max 15MB)</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: "0.5rem 1.2rem", borderRadius: "8px", border: "1.5px solid #ddd", background: "#fff", color: "#1b3c33", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem", cursor: "pointer" }}>Choose Image</button>
                {imagePreview && <div style={{ position: "relative", width: "60px", height: "60px", borderRadius: "8px", overflow: "hidden" }}><img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>}
                {imagePreview && <button type="button" onClick={() => { setImageFile(null); setImagePreview(""); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", fontSize: "0.75rem", cursor: "pointer", fontFamily: "var(--font-outfit), sans-serif" }}>Remove</button>}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "end", paddingBottom: "0.3rem" }}><label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem", cursor: "pointer" }}><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label></div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "none", background: saving ? "#999" : "#1b3c33", color: "#fdf9f4", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer" }}>{saving ? "Saving..." : editing ? "Update" : "Create"}</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "0.7rem 2rem", borderRadius: "100px", border: "1.5px solid #ccc", background: "transparent", color: "#586159", fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {error && <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#e74c3c", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

      {loading ? (
        <p style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", textAlign: "center", padding: "3rem" }}>Loading products...</p>
      ) : categories.map((cat) => (
        <div key={cat} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontFamily: "var(--font-bebas-neue), sans-serif", fontSize: "1.2rem", color: "#1b3c33", marginBottom: "0.8rem", letterSpacing: "0.05em" }}>{cat}</h2>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {items.filter((i) => i.category === cat).map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: "12px", padding: "1rem 1.2rem", boxShadow: "0 2px 12px rgba(27,60,51,0.04)", opacity: item.is_active ? 1 : 0.5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover" }} />}
                  <div>
                    <span style={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1b3c33", fontSize: "0.95rem" }}>{item.name}</span>
                    <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#586159", fontSize: "0.85rem", marginLeft: "0.75rem" }}>&#8377;{item.price}</span>
                    {item.stock > 0 && <span style={{ fontFamily: "var(--font-outfit), sans-serif", color: "#27ae60", fontSize: "0.75rem", marginLeft: "0.5rem" }}>In Stock: {item.stock}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => openEdit(item)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#1b3c33", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>Edit</button>
                  {role === "super_admin" && <button onClick={() => handleDelete(item.id)} style={{ padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
