import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function Checkout({ setPage, user }) {
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: "",
    address: "", city: "", state: "Andhra Pradesh", pincode: "", landmark: "",
  });
  const [payMethod, setPayMethod] = useState("razorpay");
  const [errors, setErrors] = useState({});
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const deliveryFee = cartTotal >= 500 ? 0 : 60;
  const total = cartTotal + deliveryFee;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit phone";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

const saveOrderToBackend = async (id) => {
  try {
    await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
  customerName: form.name,
  email: form.email,
  phone: form.phone,
  address: form.address,
  city: form.city,
  state: form.state,
  pincode: form.pincode,
  items: cart.map(item => `${item.name} x${item.qty}`).join(", "),
  total: total,
  paymentMethod: payMethod === "cod" ? "COD" : "Online",
  status: payMethod === "cod" ? "PENDING" : "PAID",
}),
    });
  } catch (err) {
    console.error("Failed to save order:", err);
  }
};

const handlePayment = async () => {
  const id = "ORD" + Date.now().toString().slice(-6);
  setOrderId(id);

  if (payMethod === "razorpay") {
    const options = {
      key: "rzp_test_YOUR_KEY_HERE",
      amount: total * 100,
      currency: "INR",
      name: "Organic Store",
      description: `Order ${id}`,
      handler: function (response) {
        console.log("Payment ID:", response.razorpay_payment_id);
        saveOrderToBackend(id);
        clearCart();
        setOrdered(true);
      },
      prefill: { name: form.name, email: form.email, contact: form.phone },
      theme: { color: "#2d6a0e" },
    };
    if (window.Razorpay) {
      new window.Razorpay(options).open();
    } else {
      await saveOrderToBackend(id);
      clearCart();
      setOrdered(true);
    }
  } else {
    await saveOrderToBackend(id);
    clearCart();
    setOrdered(true);
  }
};

  if (cart.length === 0 && !ordered) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h2 style={{ color: "#1a4008" }}>Your cart is empty</h2>
        <button onClick={() => setPage("products")} style={{ marginTop: 16, background: "#2d6a0e", color: "white", border: "none", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>
          Shop Now
        </button>
      </div>
    );
  }

  if (ordered) {
    return (
      <div style={{ maxWidth: 500, margin: "5rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ background: "white", borderRadius: 24, padding: "3rem 2rem", border: "1px solid #e8f5dc", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 72, marginBottom: "1rem" }}>✅</div>
          <h2 style={{ color: "#1a4008", fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Order Placed!</h2>
          <p style={{ color: "#6a9940", marginBottom: 6 }}>Order ID: <strong>#{orderId}</strong></p>
          <p style={{ color: "#888", fontSize: 14, marginBottom: "2rem", lineHeight: 1.6 }}>
            Thank you {form.name}! Your order has been placed successfully. We'll send updates to <strong>{form.email}</strong>
          </p>
          <div style={{ background: "#f0f9e8", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem", fontSize: 14, color: "#4a7c2a" }}>
            🚚 Estimated delivery: 3-5 business days<br />
            📍 Delivering to: {form.city}, {form.state}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("orders")} style={{ background: "#2d6a0e", color: "white", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>
              My Order
            </button>
            <button onClick={() => setPage("home")} style={{ background: "transparent", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const inp = (field, label, type = "text", placeholder = "") => (
    <div>
      <label style={{ fontWeight: 600, color: "#1a4008", fontSize: 14, display: "block", marginBottom: 6 }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `2px solid ${errors[field] ? "#e74c3c" : "#d4edbc"}`, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
      {errors[field] && <p style={{ color: "#e74c3c", fontSize: 12, margin: "4px 0 0" }}>{errors[field]}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a4008", marginBottom: "1.5rem" }}>Checkout</h1>

      {/* Progress Steps */}
      <div style={{ display: "flex", gap: 0, marginBottom: "2rem", background: "white", borderRadius: 12, border: "1px solid #e8f5dc", overflow: "hidden" }}>
        {[{ n: 1, label: "Delivery Address" }, { n: 2, label: "Payment" }, { n: 3, label: "Review Order" }].map(s => (
          <div key={s.n} style={{ flex: 1, padding: "12px", textAlign: "center", background: step === s.n ? "#2d6a0e" : step > s.n ? "#e8f5dc" : "white", color: step === s.n ? "white" : step > s.n ? "#2d6a0e" : "#888", fontWeight: 700, fontSize: 14, borderRight: s.n < 3 ? "1px solid #e8f5dc" : "none", transition: "all 0.3s" }}>
            <span style={{ marginRight: 8 }}>{step > s.n ? "✓" : s.n}</span>{s.label}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 340px", gap: "2rem" }}>
        {/* Form */}
        <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e8f5dc" }}>
          {step === 1 && (
            <div>
              <h2 style={{ color: "#1a4008", fontWeight: 800, marginBottom: "1.5rem" }}>Delivery Address</h2>
              <div style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {inp("name", "Full Name", "text", "Your full name")}
                  {inp("phone", "Phone", "tel", "10-digit mobile")}
                </div>
                {inp("email", "Email", "email", "your@email.com")}
                {inp("address", "Full Address", "text", "House no, Street, Area")}
                {inp("landmark", "Landmark (optional)", "text", "Near...")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  {inp("city", "City", "text", "City")}
                  <div>
                    <label style={{ fontWeight: 600, color: "#1a4008", fontSize: 14, display: "block", marginBottom: 6 }}>State</label>
                    <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid #d4edbc", fontSize: 14, outline: "none" }}>
                      {["Andhra Pradesh", "Telangana", "Tamil Nadu", "Karnataka", "Maharashtra", "Kerala", "Other"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {inp("pincode", "Pincode", "text", "6-digit code")}
                </div>
              </div>
              <button onClick={() => validate() && setStep(2)} style={{ width: "100%", background: "#2d6a0e", color: "white", border: "none", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: "1.5rem" }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ color: "#1a4008", fontWeight: 800, marginBottom: "1.5rem" }}>Payment Method</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "1.5rem" }}>
                {[
                  { id: "razorpay", label: "Pay Online", desc: "UPI, Cards, Net Banking — powered by Razorpay", icon: "💳" },
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
                ].map(m => (
                  <div key={m.id} onClick={() => setPayMethod(m.id)} style={{ border: `2px solid ${payMethod === m.id ? "#2d6a0e" : "#e8f5dc"}`, borderRadius: 12, padding: "1rem", cursor: "pointer", background: payMethod === m.id ? "#f0f9e8" : "white", display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 28 }}>{m.icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, color: "#1a4008", margin: 0 }}>{m.label}</p>
                      <p style={{ color: "#888", fontSize: 13, margin: 0 }}>{m.desc}</p>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 18 }}>{payMethod === m.id ? "🟢" : "⚪"}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "transparent", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "13px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(3)} style={{ flex: 2, background: "#2d6a0e", color: "white", border: "none", padding: "13px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Review Order →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ color: "#1a4008", fontWeight: 800, marginBottom: "1.5rem" }}>Review Order</h2>
              <div style={{ background: "#f9fef5", borderRadius: 12, padding: "1rem", marginBottom: "1rem" }}>
                <p style={{ fontWeight: 700, color: "#1a4008", marginBottom: 8 }}>📍 Delivering to:</p>
                <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{form.name} • {form.phone}<br />{form.address}, {form.landmark && form.landmark + ", "}{form.city}, {form.state} - {form.pincode}</p>
              </div>
              <div style={{ background: "#f9fef5", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 700, color: "#1a4008", marginBottom: 8 }}>💳 Payment: {payMethod === "razorpay" ? "Online (Razorpay)" : "Cash on Delivery"}</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "transparent", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "13px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button onClick={handlePayment} style={{ flex: 2, background: "#2d6a0e", color: "white", border: "none", padding: "13px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                  {payMethod === "razorpay" ? "💳 Pay ₹" + total : "✅ Place Order (COD)"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", border: "1px solid #e8f5dc", height: "fit-content" }}>
          <h3 style={{ color: "#1a4008", fontWeight: 800, marginBottom: "1rem" }}>Order Summary</h3>
          <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: "1rem" }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 10, alignItems: "center", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #f0f9e8" }}>
                <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: "#1a4008", margin: 0, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                  <p style={{ color: "#888", fontSize: 12, margin: 0 }}>Qty: {item.qty}</p>
                </div>
                <span style={{ fontWeight: 700, color: "#2d6a0e", fontSize: 14 }}>₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "2px solid #e8f5dc", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#555", fontSize: 14, marginBottom: 6 }}><span>Subtotal</span><span>₹{cartTotal}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", color: deliveryFee === 0 ? "#3b8a14" : "#555", fontSize: 14, marginBottom: 10 }}><span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, color: "#1a4008" }}><span>Total</span><span>₹{total}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}