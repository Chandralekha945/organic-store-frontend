import { useState } from "react";
import { useAllProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductDetails({ productId, setPage }) {
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const product = allProducts.find(p => p.id === productId);
  if (!product) return <div style={{ textAlign: "center", padding: "5rem" }}><h2>Product not found</h2><button onClick={() => setPage("products")}>Back to Products</button></div>;

  const related = allProducts.filter(p => p.category.toLowerCase() === product.category.toLowerCase() && p.id !== product.id).slice(0, 4);
  const inCart = cart.find(i => i.id === product.id);
  const wishlisted = isWishlisted(product.id);

  const stars = (r) => Array.from({ length: 5 }, (_, i) => <span key={i} style={{ color: i < Math.floor(r) ? "#f5a623" : "#ddd" }}>★</span>);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1.5rem", fontSize: 14, color: "#888" }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", color: "#2d6a0e", cursor: "pointer", padding: 0, fontWeight: 600 }}>Home</button>
        <span>›</span>
        <button onClick={() => setPage("products")} style={{ background: "none", border: "none", color: "#2d6a0e", cursor: "pointer", padding: 0, fontWeight: 600 }}>Products</button>
        <span>›</span>
        <span style={{ color: "#444" }}>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
        {/* Image */}
        <div>
          <div style={{ borderRadius: 20, overflow: "hidden", border: "2px solid #e8f5dc" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%", height: 380, objectFit: "cover" }} />
          </div>
        </div>

        {/* Details */}
        <div>
          <span style={{ background: "#e8f5dc", color: "#2d6a0e", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#1a4008", margin: "0.75rem 0 0.5rem" }}>{product.name}</h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <span style={{ fontSize: 18 }}>{stars(product.rating)}</span>
            <span style={{ fontWeight: 700, color: "#1a4008" }}>{product.rating}</span>
            <span style={{ color: "#888", fontSize: 14 }}>({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: "1.5rem" }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: "#2d6a0e" }}>₹{product.price}</span>
            <span style={{ color: "#888", fontSize: 16 }}>/ {product.unit}</span>
          </div>

          <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "1.5rem", fontSize: 15 }}>{product.description}</p>

          {/* Stock */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: product.stock > 10 ? "#3b8a14" : "#e74c3c", display: "inline-block" }} />
            <span style={{ color: product.stock > 10 ? "#3b8a14" : "#e74c3c", fontWeight: 600, fontSize: 14 }}>
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
            </span>
          </div>

          {/* Qty Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <span style={{ fontWeight: 600, color: "#1a4008" }}>Quantity:</span>
            <div style={{ display: "flex", alignItems: "center", border: "2px solid #d4edbc", borderRadius: 10, overflow: "hidden" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: "#f0f9e8", border: "none", width: 36, height: 36, fontSize: 18, cursor: "pointer" }}>-</button>
              <span style={{ padding: "0 16px", fontWeight: 700, fontSize: 16, color: "#1a4008" }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: "#f0f9e8", border: "none", width: 36, height: 36, fontSize: 18, cursor: "pointer" }}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => { addToCart({ ...product, qty }); }}
              disabled={product.stock === 0}
              style={{ flex: 1, background: "#2d6a0e", color: "white", border: "none", padding: "14px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer", minWidth: 160 }}
            >
              {inCart ? "✓ Update Cart" : "🛒 Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              style={{ padding: "14px 20px", borderRadius: 12, border: "2px solid #d4edbc", background: wishlisted ? "#fff0f0" : "white", cursor: "pointer", fontSize: 20 }}
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          {/* Features */}
          <div style={{ display: "flex", gap: 16, marginTop: "1.5rem", flexWrap: "wrap" }}>
            {["🌱 Organic", "🚚 Free delivery ₹500+", "↩️ Easy returns"].map(f => (
              <span key={f} style={{ fontSize: 13, color: "#4a7c2a", fontWeight: 600 }}>{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", gap: 4, borderBottom: "2px solid #e8f5dc", marginBottom: "1.5rem" }}>
          {["description", "benefits", "usage"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: "none", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: 15, fontWeight: 600, color: activeTab === tab ? "#2d6a0e" : "#888", borderBottom: activeTab === tab ? "2px solid #2d6a0e" : "none", marginBottom: -2, textTransform: "capitalize" }}>
              {tab}
            </button>
          ))}
        </div>
        <div style={{ color: "#555", lineHeight: 1.8, fontSize: 15 }}>
          {activeTab === "description" && <p>{product.description}</p>}
          {activeTab === "benefits" && <ul style={{ paddingLeft: "1.5rem" }}>{["Rich in natural nutrients", "Free from harmful chemicals", "Supports local farmers", "Long shelf life", "Traditional processing methods"].map(b => <li key={b} style={{ marginBottom: 6 }}>{b}</li>)}</ul>}
          {activeTab === "usage" && <p>Use daily as part of your healthy lifestyle. Store in a cool, dry place away from direct sunlight. Best consumed within 6 months of opening.</p>}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a4008", marginBottom: "1.5rem" }}>Related Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {related.map(p => (
              <div key={p.id} onClick={() => setPage(`product-${p.id}`)} style={{ cursor: "pointer", background: "white", borderRadius: 12, overflow: "hidden", border: "1px solid #e8f5dc" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                <div style={{ padding: 12 }}>
                  <p style={{ fontWeight: 700, color: "#1a4008", margin: "0 0 4px" }}>{p.name}</p>
                  <p style={{ color: "#2d6a0e", fontWeight: 800, margin: 0 }}>₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}