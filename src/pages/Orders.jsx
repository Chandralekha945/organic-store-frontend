import { useState, useEffect } from "react";

const SAMPLE_ORDERS = [
  { id: "ORD001234", date: "2026-06-08", status: "delivered", total: 640, items: [{ name: "Sesame Oil", qty: 2, price: 320 }], address: "123 Main St, Bhimavaram, AP" },
  { id: "ORD001189", date: "2026-06-03", status: "shipped", total: 450, items: [{ name: "Forest Honey", qty: 1, price: 450 }], address: "123 Main St, Bhimavaram, AP" },
  { id: "ORD001102", date: "2026-05-28", status: "delivered", total: 185, items: [{ name: "Ragi Flour", qty: 1, price: 100 }, { name: "Besan Flour", qty: 1, price: 85 }], address: "123 Main St, Bhimavaram, AP" },
];

const STATUS_COLORS = {
  pending: { bg: "#fff3cd", color: "#856404", label: "⏳ Pending" },
  confirmed: { bg: "#d1ecf1", color: "#0c5460", label: "✅ Confirmed" },
  shipped: { bg: "#cce5ff", color: "#004085", label: "🚚 Shipped" },
  delivered: { bg: "#d4edda", color: "#155724", label: "📦 Delivered" },
  cancelled: { bg: "#f8d7da", color: "#721c24", label: "❌ Cancelled" },
};

const STEPS = ["pending", "confirmed", "shipped", "delivered"];

export default function Orders({ user, setPage }) {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!user) return;
    // Fetch from backend when connected
    // fetch("http://localhost:8080/api/orders/mine", {
    //   headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    // }).then(r => r.json()).then(setOrders).catch(() => {});
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h2 style={{ color: "#1a4008" }}>Please login to view your orders</h2>
        <button onClick={() => setPage("login")} style={{ marginTop: 16, background: "#2d6a0e", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
          Login Now
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
        <h2 style={{ color: "#1a4008" }}>No orders yet</h2>
        <p style={{ color: "#888" }}>Your orders will appear here once you place one</p>
        <button onClick={() => setPage("products")} style={{ marginTop: 16, background: "#2d6a0e", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
          Shop Now
        </button>
      </div>
    );
  }

  const OrderDetail = ({ order }) => {
    const stepIdx = STEPS.indexOf(order.status);
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "2rem", maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ color: "#1a4008", fontWeight: 800, margin: 0 }}>Order #{order.id}</h2>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#888" }}>✕</button>
          </div>

          {/* Progress Tracker */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontWeight: 700, color: "#1a4008", marginBottom: 12 }}>Order Status</p>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              {STEPS.map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i <= stepIdx ? "#2d6a0e" : "#e8f5dc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: i <= stepIdx ? "white" : "#aaa", fontWeight: 700 }}>
                      {i < stepIdx ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: 10, color: i <= stepIdx ? "#2d6a0e" : "#aaa", marginTop: 4, textAlign: "center", textTransform: "capitalize" }}>{step}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < stepIdx ? "#2d6a0e" : "#e8f5dc", margin: "0 4px", marginBottom: 16 }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={{ background: "#f9fef5", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
            <p style={{ fontWeight: 700, color: "#1a4008", marginBottom: 10 }}>Items Ordered</p>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#555", marginBottom: 6 }}>
                <span>{item.name} × {item.qty}</span>
                <span style={{ fontWeight: 600 }}>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "#1a4008", padding: "8px 0", borderTop: "2px solid #e8f5dc" }}>
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>

          <p style={{ fontSize: 13, color: "#888", marginTop: 10 }}>📍 {order.address}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1a4008", marginBottom: "0.5rem" }}>My Orders</h1>
      <p style={{ color: "#6a9940", marginBottom: "2rem" }}>{orders.length} orders total</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: "2rem" }}>
        {[
          { label: "Total Orders", value: orders.length },
          { label: "Delivered", value: orders.filter(o => o.status === "delivered").length },
          { label: "In Transit", value: orders.filter(o => o.status === "shipped").length },
          { label: "Total Spent", value: "₹" + orders.reduce((s, o) => s + o.total, 0).toLocaleString() },
        ].map(s => (
          <div key={s.label} style={{ background: "white", border: "1px solid #e8f5dc", borderRadius: 14, padding: "1rem", textAlign: "center" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#2d6a0e", margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Order List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map(order => {
          const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          return (
            <div key={order.id} style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #e8f5dc", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: "#1a4008" }}>#{order.id}</span>
                  <span style={{ background: s.bg, color: s.color, padding: "2px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.label}</span>
                </div>
                <p style={{ color: "#888", fontSize: 13, margin: "0 0 4px" }}>
                  {order.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                </p>
                <p style={{ color: "#888", fontSize: 12, margin: 0 }}>
                  📅 {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontWeight: 800, color: "#2d6a0e", fontSize: 18, margin: "0 0 8px" }}>₹{order.total}</p>
                <button onClick={() => setSelected(order)} style={{ background: "#f0f9e8", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selected && <OrderDetail order={selected} />}
    </div>
  );
}