import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function Cart({ setPage }) {
  const { cart, updateQty, removeFromCart, cartTotal } = useCart();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "6rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: 80, marginBottom: "1rem" }}>🛒</div>
        <h2 style={{ color: "#1a4008", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ color: "#888", marginBottom: "2rem" }}>Add some organic goodness to get started!</p>
        <button onClick={() => setPage("products")} style={{ background: "#2d6a0e", color: "white", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Browse Products →
        </button>
      </div>
    );
  }

  const deliveryFee = cartTotal >= 500 ? 0 : 60;
  const total = cartTotal + deliveryFee;

  return (
    <div
        style={{
        maxWidth: 1100,
        margin: "2rem auto",
        padding: isMobile ? "0 1rem" : "0 1.5rem",
       }}
        >
      <h1
       style={{
       fontSize: isMobile ? 24 : 32,
       fontWeight: 900,
       color: "#1a4008",
        marginBottom: "1.5rem",
      }}
       >
        🛒 Your Cart <span style={{ fontSize: 18, color: "#888", fontWeight: 400 }}>({cart.length} items)</span>
      </h1>

      <div
        style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 360px",
       gap: "2rem"
       }}
       >
        {/* Cart Items */}
        <div>
          {cart.map(item => (
            <div key={item.id} 
            style={{
             background: "white",
             borderRadius: 16,
             padding: "1rem",
             marginBottom: 12,
             border: "1px solid #e8f5dc",
             display: "flex",
             flexDirection: isMobile ? "column" : "row",
             gap: "1rem",
            alignItems: isMobile ? "stretch" : "center"
           }}
          >
              <img src={item.image} alt={item.name} style={{ width: isMobile ? "100%" : 90, height: isMobile ? 200 : 90,maxHeight:200, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#1a4008", fontWeight: 700, margin: "0 0 4px", fontSize: 16 }}>{item.name}</h3>
                <p style={{ color: "#888", fontSize: 13, margin: "0 0 8px" }}>{item.category} • {item.unit}</p>
                <div
              style={{
               display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: "space-between",
                 gap: 10,
                }}
                 >
                  {/* Qty Controls */}
                  <div style={{ display: "flex", alignItems: "center", border: "2px solid #d4edbc", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: "#f0f9e8", border: "none", width: 32, height: 32, fontSize: 16, cursor: "pointer" }}>-</button>
                    <span style={{ padding: "0 14px", fontWeight: 700, color: "#1a4008" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: "#f0f9e8", border: "none", width: 32, height: 32, fontSize: 16, cursor: "pointer" }}>+</button>
                  </div>
                  <span style={{ fontWeight: 800, color: "#2d6a0e", fontSize: 18 }}>₹{(item.price * item.qty).toLocaleString()}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "#fff5f5", border: "1px solid #fcc", color: "#e74c3c", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    🗑 Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
  style={{
    position: isMobile ? "static" : "sticky",
    top: 80,
    height: "fit-content"
  }}
>
          <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e8f5dc" }}>
            <h2 style={{ color: "#1a4008", fontWeight: 800, marginBottom: "1.5rem", fontSize: 20 }}>Order Summary</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#555", fontSize: 15 }}>
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: deliveryFee === 0 ? "#3b8a14" : "#555", fontSize: 15 }}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && (
                <p style={{ fontSize: 12, color: "#6a9940", background: "#f0f9e8", padding: "8px 12px", borderRadius: 8, margin: 0 }}>
                  Add ₹{(500 - cartTotal).toFixed(0)} more for free delivery! 🎉
                </p>
              )}
              <div style={{ borderTop: "2px solid #e8f5dc", paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 20, color: "#1a4008" }}>
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => setPage("checkout")} style={{ width: "100%", background: "#2d6a0e", color: "white", border: "none", padding: "15px", borderRadius: 12, fontSize: 17, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
              Proceed to Checkout →
            </button>
            <button onClick={() => setPage("products")} style={{ width: "100%", background: "transparent", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "12px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              ← Continue Shopping
            </button>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {["🔒 Secure", "↩️ Easy Returns", "✅ Certified"].map(b => (
                <span key={b} style={{ fontSize: 12, color: "#6a9940", fontWeight: 600 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}