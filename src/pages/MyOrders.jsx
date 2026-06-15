import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080/api";

const STATUS_COLORS = {
  PENDING: { bg: "#fdf1de", fg: "#a8631b" },
  SHIPPED: { bg: "#e6f0fb", fg: "#2a5d9f" },
  PAID: { bg: "#e6f0fb", fg: "#2a5d9f" },
  DELIVERED: { bg: "#e8f5dc", fg: "#2d6a0e" },
};

export default function MyOrders({ user, setPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/orders`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        const mine = (Array.isArray(data) ? data : []).filter(o => o.email === user.email);
        mine.sort((a, b) => (b.id || 0) - (a.id || 0));
        setOrders(mine);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <h2 style={{ color: "#1a4008" }}>Please login to view your orders</h2>
        <button onClick={() => setPage("login")} style={{ marginTop: 16, background: "#2d6a0e", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
          Login
        </button>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const delivered = orders.filter(o => (o.status || "").toUpperCase() === "DELIVERED").length;
  const inTransit = orders.filter(o => ["PENDING", "SHIPPED", "PAID"].includes((o.status || "").toUpperCase())).length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a4008", marginBottom: 6 }}>My Orders</h1>
      <p style={{ color: "#6a9940", marginBottom: "1.5rem" }}>{orders.length} orders total</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: "2rem" }}>
        <StatBox value={orders.length} label="Total Orders" />
        <StatBox value={delivered} label="Delivered" />
        <StatBox value={inTransit} label="In Transit" />
        <StatBox value={`₹${totalSpent.toLocaleString("en-IN")}`} label="Total Spent" />
      </div>

      {loading ? (
        <p style={{ color: "#999" }}>Loading…</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>📦</div>
          <h3 style={{ color: "#1a4008" }}>No orders yet</h3>
          <p style={{ color: "#888", marginBottom: 16 }}>When you place an order, it'll show up here.</p>
          <button onClick={() => setPage("products")} style={{ background: "#2d6a0e", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
            Shop Now
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map(o => {
            const status = (o.status || "PENDING").toUpperCase();
            const colors = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
            return (
              <div key={o.id} style={{ background: "white", border: "1px solid #e8f5dc", borderRadius: 16, padding: "1.2rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <strong style={{ color: "#1a4008", fontSize: 16 }}>#ORD{String(o.id).padStart(6, "0")}</strong>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: colors.bg, color: colors.fg }}>{status}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#2d6a0e" }}>₹{(o.total || 0).toLocaleString("en-IN")}</span>
                </div>
                <p style={{ color: "#555", fontSize: 14, margin: "4px 0" }}>🛒 {o.items || "—"}</p>
                <p style={{ color: "#888", fontSize: 13, margin: "4px 0" }}>📍 {o.address}, {o.city}, {o.state} {o.pincode ? "- " + o.pincode : ""}</p>
                <p style={{ color: "#888", fontSize: 13, margin: "4px 0" }}>💳 {o.paymentMethod || "—"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div style={{ background: "white", border: "1px solid #e8f5dc", borderRadius: 16, padding: "1rem", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#1a4008" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{label}</div>
    </div>
  );
}