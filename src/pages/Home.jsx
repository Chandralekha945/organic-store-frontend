import { PRODUCTS, CATEGORIES, CATEGORY_ICONS } from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home({ setPage }) {
  const featured = PRODUCTS.slice(0, 4);
  const bestSellers = PRODUCTS.sort((a, b) => b.reviews - a.reviews).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg, #f0f9e8 0%, #e1f5ce 60%, #d4edbc 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <span style={{ background: "#2d6a0e", color: "white", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
              100% Natural & Organic
            </span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, color: "#1a4008", margin: "1rem 0", lineHeight: 1.2 }}>
              Pure Organic<br />
              <span style={{ color: "#2d6a0e" }}>Goodness</span><br />
              Delivered
            </h1>
            <p style={{ color: "#4a7c2a", fontSize: 17, lineHeight: 1.7, marginBottom: "2rem", maxWidth: 480 }}>
              Cold pressed oils, millets, organic powders and more — sourced directly from trusted farmers across India. No chemicals, no compromise.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setPage("products")} style={{ background: "#2d6a0e", color: "white", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                Shop Now →
              </button>
              <button onClick={() => setPage("products")} style={{ background: "transparent", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "14px 28px", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
                Browse Categories
              </button>
            </div>
            {/* Trust badges */}
            <div style={{ display: "flex", gap: 20, marginTop: "2rem", flexWrap: "wrap" }}>
              {["🌿 100% Organic", "🚚 Free Delivery ₹500+", "↩️ Easy Returns"].map(b => (
                <span key={b} style={{ fontSize: 13, color: "#4a7c2a", fontWeight: 600 }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, #c8e8a0, #a3d977)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, boxShadow: "0 20px 60px rgba(45,106,14,0.3)" }}>
              🌿
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "3rem 1.5rem", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: "#1a4008", marginBottom: "0.5rem" }}>Shop by Category</h2>
          <p style={{ textAlign: "center", color: "#6a9940", marginBottom: "2rem" }}>Everything you need for a healthy lifestyle</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16 }}>
            {CATEGORIES.filter(c => c !== "All").map(cat => (
              <button key={cat} onClick={() => setPage("products")} style={{
                background: "#f5fef0", border: "2px solid #e8f5dc", borderRadius: 16,
                padding: "1.2rem 0.5rem", cursor: "pointer", textAlign: "center",
                transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#2d6a0e"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#f5fef0"; e.currentTarget.style.color = "inherit"; }}
              >
                <span style={{ fontSize: 28 }}>{CATEGORY_ICONS[cat]}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1a4008", lineHeight: 1.3 }}>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "3rem 1.5rem", background: "#f9fef5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a4008", margin: 0 }}>Featured Products</h2>
              <p style={{ color: "#6a9940", margin: "4px 0 0" }}>Hand-picked organic goodness</p>
            </div>
            <button onClick={() => setPage("products")} style={{ background: "none", border: "2px solid #2d6a0e", color: "#2d6a0e", padding: "8px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
              View All →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section style={{ padding: "3rem 1.5rem", background: "#2d6a0e" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>Why Choose Us?</h2>
          <p style={{ color: "#a3d977", marginBottom: "2.5rem" }}>We're committed to quality, purity and your health</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { icon: "🌱", title: "100% Organic", desc: "No pesticides, no chemicals, only nature's best." },
              { icon: "🤝", title: "Farmer Direct", desc: "Sourced directly from trusted farmers across India." },
              { icon: "🚚", title: "Fast Delivery", desc: "Free delivery on orders above ₹500. Pan India." },
              { icon: "✅", title: "Quality Assured", desc: "Every batch tested and certified before shipping." },
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "2rem 1.5rem" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ color: "white", fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "#a3d977", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section style={{ padding: "3rem 1.5rem", background: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a4008", marginBottom: "0.5rem", textAlign: "center" }}>Best Sellers</h2>
          <p style={{ textAlign: "center", color: "#6a9940", marginBottom: "2rem" }}>Most loved by our customers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {bestSellers.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
          </div>
        </div>
      </section>
    </div>
  );
}