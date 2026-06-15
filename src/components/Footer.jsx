export default function Footer({ setPage }) {
  return (
    <footer style={{ background: "#1a4008", color: "#a3d977", padding: "3rem 1.5rem 1.5rem", marginTop: "auto" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <p style={{ fontWeight: 800, fontSize: 20, color: "white", marginBottom: 10 }}>🌿 Organic Store</p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "#7ec850", margin: 0 }}>
            Pure organic products delivered to your doorstep from trusted farmers and artisans across India.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            {["📘", "📸", "🐦", "▶️"].map((icon, i) => (
              <span key={i} style={{ fontSize: 18, cursor: "pointer", opacity: 0.8 }}>{icon}</span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontWeight: 700, color: "white", marginBottom: 12, fontSize: 15 }}>Quick Links</p>
          {[
            { label: "Home", page: "home" },
            { label: "Products", page: "products" },
            { label: "Cart", page: "cart" },
            { label: "Wishlist", page: "wishlist" },
            { label: "My Orders", page: "orders" },
          ].map(({ label, page }) => (
            <button key={page} onClick={() => setPage(page)} style={{ display: "block", background: "none", border: "none", color: "#7ec850", cursor: "pointer", padding: "3px 0", fontSize: 14, textAlign: "left" }}>
              → {label}
            </button>
          ))}
        </div>

        <div>
          <p style={{ fontWeight: 700, color: "white", marginBottom: 12, fontSize: 15 }}>Categories</p>
          {["Cold Pressed Oils", "Millets", "Flours", "Coffee", "Honey"].map(cat => (
            <p key={cat} style={{ fontSize: 14, color: "#7ec850", margin: "3px 0" }}>→ {cat}</p>
          ))}
        </div>

        <div>
          <p style={{ fontWeight: 700, color: "white", marginBottom: 12, fontSize: 15 }}>Contact Us</p>
          <p style={{ fontSize: 14, color: "#7ec850", lineHeight: 2, margin: 0 }}>
            📧 arukunaturalmillets@gmail.com<br />
            📞 +91 95509 72999<br />
            📍 Aruku, Andhra Pradesh<br />
            🕐 Mon–Sat: 9 AM – 6 PM
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #2d6a0e", paddingTop: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <p style={{ fontSize: 13, color: "#5a9e30", margin: 0 }}>© 2026 Organic Store. All Rights Reserved.</p>
        <p style={{ fontSize: 13, color: "#5a9e30", margin: 0 }}>Made with 💚 in India</p>
      </div>
    </footer>
  );
}