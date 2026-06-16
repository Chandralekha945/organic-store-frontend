import { useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

const STATUS_COLORS = {
  PENDING: { bg: "#fdf1de", fg: "#a8631b" },
  SHIPPED: { bg: "#e6f0fb", fg: "#2a5d9f" },
  PAID: { bg: "#e6f0fb", fg: "#2a5d9f" },
  DELIVERED: { bg: "#e8f5dc", fg: "#2d6a0e" },
};

async function fetchData(path) {
  try {
    const res = await fetch(`${API_BASE}/${path}`);
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  } catch {
    return [];
  }
}

export default function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");
  const [expandedId, setExpandedId] = useState(null);
  const [stats, setStats] = useState({
    members: 0,
    products: [],
    recentOrders: [],
    totalOrders: 0,
    revenue: 0,
  });

  // Add/Edit product form state
  const [form, setForm] = useState({ name: "", category: "", price: "", imageFile: null, imagePreview: null });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Migration state
  const [migrating, setMigrating] = useState(false);
  const [migrateProgress, setMigrateProgress] = useState("");

  const loadStats = async (isFirstLoad) => {
    const [usersRes, productsRes, ordersRes] = await Promise.all([
      fetchData("users"),
      fetchData("products"),
      fetchData("orders"),
    ]);

    const members = usersRes.length;
    const products = productsRes;
    const ordersList = ordersRes;
    const totalOrders = ordersList.length;
    const revenue = ordersList.reduce((sum, o) => sum + (o.total || 0), 0);

    const recentOrders = [...ordersList]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 5);

    setStats({ members, products, totalOrders, revenue, recentOrders });
    if (isFirstLoad) setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const tick = (isFirstLoad) => {
      if (!cancelled) loadStats(isFirstLoad);
    };

    tick(true);
    const interval = setInterval(() => tick(false), 15000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      category: p.category || "",
      price: p.price?.toString() || "",
      imageFile: null,
      imagePreview: p.image || null,
    });
    setSaveMsg("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", category: "", price: "", imageFile: null, imagePreview: null });
    setSaveMsg("");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setSaveMsg("Please enter product name and price.");
      return;
    }
    setSaving(true);
    setSaveMsg("");
    try {
      let imageUrl = form.imagePreview && !form.imageFile ? form.imagePreview : "";

      // Upload new image if a new file was chosen
      if (form.imageFile) {
        const fd = new FormData();
        fd.append("file", form.imageFile);
        const uploadRes = await fetch(`${API_BASE}/products/upload`, {
          method: "POST",
          body: fd,
        });
        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.imageUrl;
      }

      const payload = {
        name: form.name.trim(),
        category: form.category.trim() || null,
        price: parseFloat(form.price),
        image: imageUrl,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(editingId ? "Failed to update product" : "Failed to add product");

      setForm({ name: "", category: "", price: "", imageFile: null, imagePreview: null });
      setEditingId(null);
      setSaveMsg(editingId ? "✅ Product updated successfully!" : "✅ Product added successfully!");
      loadStats(false);
    } catch (err) {
      setSaveMsg(editingId ? "❌ Could not update product. Check backend connection." : "❌ Could not add product. Check backend connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadStats(false);
    } catch {
      alert("Could not update status.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
      loadStats(false);
    } catch {
      alert("Could not delete product.");
    }
  };

  const handleMigrateCatalog = async () => {
    if (!window.confirm(`This will import ${PRODUCTS.length} starter products into your database. Continue?`)) return;
    setMigrating(true);

    const existingNames = new Set(stats.products.map(p => (p.name || "").toLowerCase().trim()));
    let added = 0, skipped = 0;

    for (let i = 0; i < PRODUCTS.length; i++) {
      const p = PRODUCTS[i];
      setMigrateProgress(`Processing ${i + 1} / ${PRODUCTS.length}: ${p.name}`);

      if (existingNames.has(p.name.toLowerCase().trim())) {
        skipped++;
        continue;
      }

      try {
        await fetch(`${API_BASE}/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: p.name,
            category: p.category,
            price: p.price,
            image: typeof p.image === "string" ? p.image : "",
          }),
        });
        added++;
        existingNames.add(p.name.toLowerCase().trim());
      } catch {
        skipped++;
      }
    }

    setMigrateProgress(`Done! Added ${added}, skipped ${skipped} (already existed).`);
    setMigrating(false);
    loadStats(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Owner overview</p>
          <h1 style={styles.title}>Today on the Organic Store</h1>
        </div>
        <div style={styles.tabs}>
          <button onClick={() => setTab("dashboard")} style={tab === "dashboard" ? styles.tabActive : styles.tab}>Dashboard</button>
          <button onClick={() => setTab("products")} style={tab === "products" ? styles.tabActive : styles.tab}>Manage Products</button>
        </div>
      </div>

      {tab === "dashboard" && (
        <>
          <div style={styles.grid}>
            <StatCard icon="🌱" label="Members" value={loading ? "—" : stats.members} sub="Registered customers" accent="#2d6a0e" />
            <StatCard icon="🧺" label="Products" value={loading ? "—" : stats.products.length} sub="Listed in catalog" accent="#a8631b" />
            <StatCard icon="📦" label="Orders" value={loading ? "—" : stats.totalOrders} sub="Placed so far" accent="#2a5d9f" />
            <StatCard icon="💰" label="Revenue" value={loading ? "—" : `₹${stats.revenue.toLocaleString("en-IN")}`} sub="From all orders" accent="#7a3e9d" />
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Recent orders</h2>
            <p style={styles.muted}>Click a row to view full order details.</p>
            {loading ? (
              <p style={styles.muted}>Loading…</p>
            ) : stats.recentOrders.length === 0 ? (
              <p style={styles.muted}>No orders yet. New orders will appear here automatically.</p>
            ) : (
              <div style={styles.table}>
                <div style={styles.tableHead}>
                  <span style={{ flex: 2 }}>Order</span>
                  <span style={{ flex: 2 }}>Customer</span>
                  <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
                  <span style={{ flex: 1, textAlign: "right" }}>Status</span>
                </div>
                {stats.recentOrders.map((o, i) => {
                  const status = (o.status || "PENDING").toUpperCase();
                  const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
                  const isOpen = expandedId === (o.id ?? i);
                  return (
                    <div key={o.id || i}>
                      <div
                        onClick={() => setExpandedId(isOpen ? null : (o.id ?? i))}
                        style={{ ...styles.tableRow, cursor: "pointer" }}
                      >
                        <span style={{ flex: 2, fontWeight: 600, color: "#1a4008" }}>#{o.id}</span>
                        <span style={{ flex: 2, color: "#555" }}>{o.customerName || "—"}</span>
                        <span style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
                          ₹{(o.total || 0).toLocaleString("en-IN")}
                        </span>
                        <span style={{ flex: 1, textAlign: "right" }}>
                          <span style={{ ...styles.pill, background: colors.bg, color: colors.fg }}>{status}</span>
                        </span>
                      </div>
                      {isOpen && (
                        <div style={styles.detailBox}>
                          <p style={styles.detailLine}><strong>📧 Email:</strong> {o.email || "—"}</p>
                          <p style={styles.detailLine}><strong>📞 Phone:</strong> {o.phone || "—"}</p>
                          <p style={styles.detailLine}><strong>📍 Address:</strong> {o.address || "—"}, {o.city || ""}, {o.state || ""} {o.pincode ? "- " + o.pincode : ""}</p>
                          <p style={styles.detailLine}><strong>🛒 Items:</strong> {o.items || "—"}</p>
                          <p style={styles.detailLine}><strong>💳 Payment:</strong> {o.paymentMethod || "—"}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                            <strong style={{ fontSize: 13, color: "#1a4008" }}>Update Status:</strong>
                            <select
                              value={status}
                              onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                              style={{ padding: "6px 12px", borderRadius: 8, border: "2px solid #d4edbc", fontSize: 13, outline: "none", cursor: "pointer" }}
                            >
                              <option value="PENDING">PENDING</option>
                              <option value="SHIPPED">SHIPPED</option>
                              <option value="DELIVERED">DELIVERED</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {tab === "products" && (
        <>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Import Starter Catalog</h2>
            <p style={styles.muted}>
              One-time import: brings all {PRODUCTS.length} products from your starter catalog into the database, so you can edit their prices and details here.
            </p>
            <button onClick={handleMigrateCatalog} disabled={migrating} style={styles.addBtn}>
              {migrating ? "Importing…" : `Import ${PRODUCTS.length} Products`}
            </button>
            {migrateProgress && <p style={{ marginTop: 10, fontSize: 13, color: "#2d6a0e" }}>{migrateProgress}</p>}
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleAddProduct} style={styles.form}>
              <div style={styles.formRow}>
                <div style={{ flex: 2 }}>
                  <label style={styles.label}>Product Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Organic Honey"
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Pantry"
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 250"
                    style={styles.input}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Product Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setForm({ ...form, imageFile: file, imagePreview: file ? URL.createObjectURL(file) : null });
                  }}
                  style={styles.input}
                />
                {form.imagePreview && (
                  <img src={form.imagePreview} alt="preview" style={{ marginTop: 10, width: 100, height: 100, objectFit: "cover", borderRadius: 8, border: "1px solid #e8f5dc" }} />
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={saving} style={styles.addBtn}>
                  {saving ? "Saving…" : editingId ? "💾 Update Product" : "+ Add Product"}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} style={styles.cancelBtn}>
                    Cancel
                  </button>
                )}
              </div>
              {saveMsg && <p style={{ margin: "10px 0 0", fontSize: 13, color: saveMsg.startsWith("✅") ? "#2d6a0e" : "#e74c3c" }}>{saveMsg}</p>}
            </form>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Product Catalog ({stats.products.length})</h2>
            {loading ? (
              <p style={styles.muted}>Loading…</p>
            ) : stats.products.length === 0 ? (
              <p style={styles.muted}>No products yet. Add your first product above.</p>
            ) : (
              <div style={styles.table}>
                <div style={styles.tableHead}>
                  <span style={{ flex: 2 }}>Name</span>
                  <span style={{ flex: 1 }}>Category</span>
                  <span style={{ flex: 1, textAlign: "right" }}>Price</span>
                  <span style={{ flex: 1, textAlign: "right" }}>Action</span>
                </div>
                {stats.products.map((p) => (
                  <div key={p.id} style={styles.tableRow}>
                    <span style={{ flex: 2, fontWeight: 600, color: "#1a4008", display: "flex", alignItems: "center", gap: 10 }}>
                      {p.image && <img src={p.image} alt={p.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />}
                      {p.name}
                    </span>
                    <span style={{ flex: 1, color: "#555" }}>{p.category || "—"}</span>
                    <span style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>₹{p.price}</span>
                    <span style={{ flex: 1, textAlign: "right", display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button onClick={() => handleEditClick(p)} style={styles.editBtn}>Edit</button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={styles.deleteBtn}>Delete</button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardIcon, background: `${accent}1a`, color: accent }}>{icon}</div>
      <div>
        <p style={styles.cardLabel}>{label}</p>
        <p style={{ ...styles.cardValue, color: accent }}>{value}</p>
        <p style={styles.cardSub}>{sub}</p>
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f9fef5", minHeight: "100%", padding: "32px 28px", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  eyebrow: { fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7a9c5e", fontWeight: 700, margin: "0 0 4px" },
  title: { fontSize: 26, fontWeight: 800, color: "#1a4008", margin: 0 },
  tabs: { display: "flex", gap: 8 },
  tab: { padding: "10px 18px", borderRadius: 10, border: "1px solid #e8f5dc", background: "white", color: "#2d6a0e", fontWeight: 700, cursor: "pointer", fontSize: 13 },
  tabActive: { padding: "10px 18px", borderRadius: 10, border: "1px solid #2d6a0e", background: "#2d6a0e", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 13 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 },
  card: { background: "white", border: "1px solid #e8f5dc", borderRadius: 16, padding: 18, display: "flex", gap: 14, alignItems: "flex-start", boxShadow: "0 2px 10px rgba(45,106,14,0.04)" },
  cardIcon: { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  cardLabel: { fontSize: 12, color: "#888", margin: "2px 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  cardValue: { fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2 },
  cardSub: { fontSize: 12, color: "#999", margin: "4px 0 0" },
  panel: { background: "white", border: "1px solid #e8f5dc", borderRadius: 16, padding: 20, boxShadow: "0 2px 10px rgba(45,106,14,0.04)", marginBottom: 20 },
  panelTitle: { fontSize: 16, fontWeight: 700, color: "#1a4008", margin: "0 0 14px" },
  muted: { fontSize: 13, color: "#999", margin: "0 0 10px" },
  table: { display: "flex", flexDirection: "column", gap: 0 },
  tableHead: { display: "flex", fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 0 10px", borderBottom: "1px solid #f0f9e8" },
  tableRow: { display: "flex", alignItems: "center", fontSize: 13, padding: "12px 0", borderBottom: "1px solid #f0f9e8" },
  pill: { display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 },
  detailBox: { background: "#f9fef5", borderRadius: 10, padding: "12px 16px", marginBottom: 8, border: "1px solid #e8f5dc" },
  detailLine: { fontSize: 13, color: "#555", margin: "4px 0" },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  formRow: { display: "flex", gap: 14, flexWrap: "wrap" },
  label: { fontSize: 12, fontWeight: 700, color: "#1a4008", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid #d4edbc", fontSize: 14, outline: "none", boxSizing: "border-box" },
  addBtn: { alignSelf: "flex-start", background: "#2d6a0e", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  cancelBtn: { alignSelf: "flex-start", background: "white", color: "#888", border: "2px solid #e8f5dc", padding: "12px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  deleteBtn: { background: "#fdecea", color: "#e74c3c", border: "1px solid #f5c6c2", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  editBtn: { background: "#e6f0fb", color: "#2a5d9f", border: "1px solid #c3d9f5", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
};