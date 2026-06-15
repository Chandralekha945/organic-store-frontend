import { useState, useEffect, useRef } from "react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ChatWidget({ setPage, user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("idle");
  const [orderData, setOrderData] = useState({ name: "", phone: "", address: "" });
  const [fieldIdx, setFieldIdx] = useState(0);
  const [showQuick, setShowQuick] = useState(true);
  const [localCart, setLocalCart] = useState([]);
  const { addToCart } = useCart();
  const msgEndRef = useRef(null);

  const fields = [
    { key: "name",    q: "What is your full name?" },
    { key: "phone",   q: "Your 10-digit phone number?" },
    { key: "address", q: "Full delivery address (house, street, city, pincode)?" },
  ];

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      addBot(user
        ? `Hi ${user.name.split(" ")[0]}! 👋 I can help you browse products, place an order, or track a delivery. What would you like?`
        : "Hi! Welcome to Organic Store. I can help you browse products, place an order, or track a delivery. How can I help?"
      );
    }
  }, [open]);

  const addBot = (text, extra) => {
    setMessages(m => [...m, { from: "bot", text, extra, time: now() }]);
  };

  const addUser = (text) => {
    setMessages(m => [...m, { from: "user", text, time: now() }]);
  };

  const respond = (raw) => {
    const txt = raw.toLowerCase();

    // collecting order details
    if (step === "collecting") {
      const updated = { ...orderData, [fields[fieldIdx].key]: raw };
      setOrderData(updated);
      const nextIdx = fieldIdx + 1;
      if (nextIdx < fields.length) {
        setFieldIdx(nextIdx);
        setTimeout(() => addBot(fields[nextIdx].q), 400);
      } else {
        setFieldIdx(0);
        setStep("idle");
        setTimeout(() => confirmOrder(updated), 400);
      }
      return;
    }

    if (step === "tracking") {
      setStep("idle");
      setTimeout(() => addBot(
        null,
        <div style={styles.orderCard}>
          <div style={styles.cardRow}><span>Order ID</span><span style={{ fontWeight: 600 }}>#{raw.toUpperCase()}</span></div>
          <div style={styles.cardRow}><span>Status</span><span style={styles.pill}>Shipped</span></div>
          <div style={styles.cardRow}><span>Est. delivery</span><span>2–3 business days</span></div>
          <div style={styles.cardRow}><span>Courier</span><span>BlueDart</span></div>
        </div>
      ), 500);
      return;
    }

    // keyword routing
    if (txt.match(/browse|product|catalog|show|what.*(have|sell)/)) {
      showProducts();
    } else if (txt.match(/place|order|buy|purchase|checkout/)) {
      if (localCart.length === 0) {
        showProducts("Sure! Here are our products — click Add to cart:");
      } else {
        showCartSummary();
      }
    } else if (txt.match(/cart|basket/)) {
      showCartSummary();
    } else if (txt.match(/track|status|where.*order|delivery/)) {
      addBot("Please share your Order ID and I'll check the status for you.");
      setStep("tracking");
    } else if (txt.match(/price|cost|how much|rate/)) {
      showProducts("Here are all our products with prices:");
    } else if (txt.match(/hi|hello|hey|namaste/)) {
      addBot("Hello! How can I help you today? I can browse products, take an order, or track a delivery.");
    } else if (txt.match(/thank/)) {
      addBot("You're welcome! Happy shopping! 🌿");
    } else if (txt.match(/oil/)) {
      showCategoryProducts("Cold Pressed Oils");
    } else if (txt.match(/honey/)) {
      showCategoryProducts("Honey");
    } else if (txt.match(/coffee/)) {
      showCategoryProducts("Coffee");
    } else if (txt.match(/millet/)) {
      showCategoryProducts("Millets");
    } else if (txt.match(/flour/)) {
      showCategoryProducts("Flours");
    } else {
      addBot("I can help you with browsing products, placing orders, or tracking deliveries. What would you like?");
    }
  };

  const showProducts = (msg) => {
    addBot(msg || "Here are our products:");
    setTimeout(() => {
      addBot(null,
        <div>
          {PRODUCTS.slice(0, 8).map((p, i) => (
            <div key={i} style={styles.productRow}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a4008" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{p.unit} · {p.category}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2d6a0e" }}>₹{p.price}</span>
                <button onClick={() => handleAddToCart(p)} style={styles.addBtn}>Add</button>
              </div>
            </div>
          ))}
          <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>
            Or say a category: oils, honey, coffee, millets, flour
          </p>
        </div>
      );
    }, 300);
  };

  const showCategoryProducts = (cat) => {
    const filtered = PRODUCTS.filter(p => p.category === cat);
    addBot(null,
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a4008", marginBottom: 8 }}>{cat}</p>
        {filtered.map((p, i) => (
          <div key={i} style={styles.productRow}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a4008" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{p.unit}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#2d6a0e" }}>₹{p.price}</span>
              <button onClick={() => handleAddToCart(p)} style={styles.addBtn}>Add</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleAddToCart = (product) => {
    setLocalCart(prev => {
      const ex = prev.find(c => c.id === product.id);
      if (ex) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...product, qty: 1 }];
    });
    addToCart(product); // also sync with global cart
    const total = localCart.reduce((s, c) => s + c.price * c.qty, 0) + product.price;
    addBot(`Added ${product.name} to cart! 🛒 Cart total: ₹${total}. Say "checkout" to place order.`);
  };

  const showCartSummary = () => {
    if (localCart.length === 0) {
      addBot("Your chat cart is empty. Say 'browse products' to start shopping!");
      return;
    }
    const subtotal = localCart.reduce((s, c) => s + c.price * c.qty, 0);
    const delivery = subtotal >= 500 ? 0 : 60;
    addBot(null,
      <div style={styles.orderCard}>
        <p style={{ fontWeight: 600, color: "#1a4008", marginBottom: 8, fontSize: 13 }}>Your Cart</p>
        {localCart.map((c, i) => (
          <div key={i} style={styles.cardRow}>
            <span>{c.name} ×{c.qty}</span>
            <span>₹{c.price * c.qty}</span>
          </div>
        ))}
        <div style={{ ...styles.cardRow, color: delivery === 0 ? "#3b6d11" : "#555" }}>
          <span>Delivery</span><span>{delivery === 0 ? "FREE" : `₹${delivery}`}</span>
        </div>
        <div style={styles.cardTotal}>
          <span>Total</span><span>₹{subtotal + delivery}</span>
        </div>
        <button onClick={startCheckout} style={styles.confirmBtn}>
          Proceed to Checkout →
        </button>
      </div>
    );
  };

  const startCheckout = () => {
    if (localCart.length === 0) { addBot("Your cart is empty!"); return; }
    setStep("collecting");
    setFieldIdx(0);
    setOrderData({ name: user?.name || "", phone: "", address: user?.address || "" });
    addBot("Let me collect your delivery details.");
    setTimeout(() => addBot(fields[0].q), 400);
  };

  const confirmOrder = async (data) => {
    const subtotal = localCart.reduce((s, c) => s + c.price * c.qty, 0);
    const delivery = subtotal >= 500 ? 0 : 60;
    const total = subtotal + delivery;
    const orderId = "ORD" + Date.now().toString().slice(-6);

    // POST to Spring Boot backend
    try {
      await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {}),
        },
        body: JSON.stringify({
          customerName: data.name,
          total,
          status: "PENDING",
          deliveryAddress: data.address,
          phone: data.phone,
        }),
      });
    } catch (e) {
      // backend not connected — still show confirmation
    }

    addBot(null,
      <div style={styles.orderCard}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <span style={{ fontWeight: 700, color: "#1a4008", fontSize: 14 }}>Order Confirmed!</span>
        </div>
        <div style={styles.cardRow}><span>Order ID</span><span style={{ fontWeight: 600 }}>#{orderId}</span></div>
        <div style={styles.cardRow}><span>Name</span><span>{data.name}</span></div>
        <div style={styles.cardRow}><span>Phone</span><span>{data.phone}</span></div>
        <div style={styles.cardRow}><span>Address</span><span style={{ maxWidth: 160, textAlign: "right", fontSize: 11 }}>{data.address}</span></div>
        <div style={{ ...styles.cardRow, paddingTop: 8, borderTop: "1px solid #e8f5dc" }}>
          <span>Total paid</span><span style={{ fontWeight: 700, color: "#2d6a0e" }}>₹{total}</span>
        </div>
        <p style={{ fontSize: 12, color: "#3b6d11", marginTop: 8 }}>
          Estimated delivery: 3–5 business days 🚚
        </p>
      </div>
    );
    setLocalCart([]);
    setTimeout(() => addBot("Is there anything else I can help you with?"), 800);
  };

  const handleSend = () => {
    const txt = input.trim();
    if (!txt) return;
    setInput("");
    setShowQuick(false);
    addUser(txt);
    setTimeout(() => respond(txt), 500);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const styles = {
    productRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f0f9e8" },
    addBtn: { background: "#2d6a0e", color: "white", border: "none", borderRadius: 6, padding: "3px 10px", fontSize: 12, cursor: "pointer" },
    orderCard: { background: "#f9fef5", border: "1px solid #e8f5dc", borderRadius: 10, padding: 12, marginTop: 4 },
    cardRow: { display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", padding: "3px 0" },
    cardTotal: { display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, color: "#1a4008", padding: "8px 0 0", borderTop: "1px solid #e8f5dc", marginTop: 4 },
    pill: { background: "#e8f5dc", color: "#2d6a0e", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
    confirmBtn: { width: "100%", background: "#2d6a0e", color: "white", border: "none", padding: "9px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 10 },
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Chat Box */}
      {open && (
        <div style={{ position: "absolute", bottom: 70, right: 0, width: 350, background: "white", borderRadius: 20, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", border: "1px solid #e8f5dc", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "#2d6a0e", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "white", fontWeight: 700, margin: 0, fontSize: 14 }}>Order Assistant</p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#a3d977", display: "inline-block" }} />
                Online · Organic Store
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", opacity: 0.8 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ height: 320, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "#f9fef5" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: m.from === "user" ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
                {m.from === "bot" && (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#e8f5dc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🌿</div>
                )}
                <div>
                  <div style={{
                    padding: "9px 13px", borderRadius: 14, fontSize: 13, lineHeight: 1.5, maxWidth: 240,
                    background: m.from === "user" ? "#2d6a0e" : "white",
                    color: m.from === "user" ? "white" : "#333",
                    border: m.from === "bot" ? "1px solid #e8f5dc" : "none",
                    borderBottomLeftRadius: m.from === "bot" ? 4 : 14,
                    borderBottomRightRadius: m.from === "user" ? 4 : 14,
                  }}>
                    {m.text && <span>{m.text}</span>}
                    {m.extra && <div style={{ marginTop: m.text ? 8 : 0 }}>{m.extra}</div>}
                  </div>
                  <p style={{ fontSize: 10, color: "#aaa", margin: "2px 4px", textAlign: m.from === "user" ? "right" : "left" }}>{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={msgEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuick && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 12px", borderTop: "1px solid #f0f9e8", background: "white" }}>
              {["Browse products", "Place an order", "Track my order", "Check prices"].map(q => (
                <button key={q} onClick={() => { setShowQuick(false); addUser(q); setTimeout(() => respond(q), 400); }}
                  style={{ background: "#f0f9e8", border: "1px solid #d4edbc", borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#2d6a0e", fontWeight: 600 }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid #f0f9e8", background: "white", alignItems: "center" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "9px 14px", borderRadius: 20, border: "1px solid #d4edbc", fontSize: 13, outline: "none", background: "#f9fef5" }}
            />
            <button onClick={handleSend} style={{ width: 36, height: 36, borderRadius: "50%", background: "#2d6a0e", border: "none", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button onClick={() => setOpen(o => !o)}
        style={{ width: 56, height: 56, borderRadius: "50%", background: "#2d6a0e", border: "none", color: "white", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 16px rgba(45,106,14,0.4)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}