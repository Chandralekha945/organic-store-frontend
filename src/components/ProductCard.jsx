import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product, setPage }) {
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const inCart = cart.find(i => i.id === product.id);
  const wishlisted = isWishlisted(product.id);

  const stars = (rating) => "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(rating));

  return (
    <div style={{
      background: "white", borderRadius: 16, overflow: "hidden",
      border: "1px solid #e8f5dc", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      transition: "transform 0.2s, box-shadow 0.2s", display: "flex", flexDirection: "column",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: 190, objectFit: "cover", cursor: "pointer", transition: "transform 0.3s" }}
          onClick={() => setPage(`product-${product.id}`)}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
        {/* Wishlist button */}
        <button
          onClick={() => toggleWishlist(product)}
          style={{ position: "absolute", top: 10, right: 10, background: "white", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
        {/* Category badge */}
        <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(45,106,14,0.85)", color: "white", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
          {product.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <h3
          onClick={() => setPage(`product-${product.id}`)}
          style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1a4008", cursor: "pointer", lineHeight: 1.3 }}
        >
          {product.name}
        </h3>

        <p style={{ margin: 0, fontSize: 12, color: "#888", lineHeight: 1.5, flex: 1 }}>
          {product.description.slice(0, 70)}...
        </p>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#f5a623", fontSize: 12 }}>{stars(product.rating)}</span>
          <span style={{ fontSize: 12, color: "#888" }}>({product.reviews})</span>
        </div>

        {/* Price + Unit */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#2d6a0e" }}>₹{product.price}</span>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 5 }}>{product.unit}</span>
          </div>
          <span style={{ fontSize: 11, color: product.stock > 10 ? "#3b8a14" : "#e74c3c", fontWeight: 600 }}>
            {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          style={{
            background: inCart ? "#1a4008" : "#2d6a0e",
            color: "white", border: "none", padding: "10px",
            borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: product.stock === 0 ? "not-allowed" : "pointer",
            opacity: product.stock === 0 ? 0.5 : 1, transition: "background 0.2s", marginTop: 4,
          }}
        >
          {product.stock === 0 ? "Out of Stock" : inCart ? `✓ In Cart (${inCart.qty})` : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}