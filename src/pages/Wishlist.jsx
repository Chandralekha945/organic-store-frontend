import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist({ setPage }) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "6rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: 80, marginBottom: "1rem" }}>❤️</div>
        <h2 style={{ color: "#1a4008", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Your wishlist is empty</h2>
        <p style={{ color: "#888", marginBottom: "2rem" }}>Save your favourite products here</p>
        <button onClick={() => setPage("products")} style={{ background: "#2d6a0e", color: "white", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Browse Products →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1.5rem" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1a4008", marginBottom: "1.5rem" }}>
        ❤️ My Wishlist <span style={{ fontSize: 18, color: "#888", fontWeight: 400 }}>({wishlist.length} items)</span>
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {wishlist.map(product => (
          <div key={product.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #e8f5dc", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ position: "relative" }}>
              <img src={product.image} alt={product.name} onClick={() => setPage(`product-${product.id}`)} style={{ width: "100%", height: 190, objectFit: "cover", cursor: "pointer" }} />
              <button onClick={() => removeFromWishlist(product.id)} style={{ position: "absolute", top: 10, right: 10, background: "white", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                ❤️
              </button>
            </div>
            <div style={{ padding: "1rem" }}>
              <p style={{ fontSize: 11, color: "#2d6a0e", fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase" }}>{product.category}</p>
              <h3 onClick={() => setPage(`product-${product.id}`)} style={{ margin: "0 0 6px", color: "#1a4008", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>{product.name}</h3>
              <p style={{ margin: "0 0 12px", color: "#888", fontSize: 12, lineHeight: 1.5 }}>{product.description.slice(0, 60)}...</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#2d6a0e" }}>₹{product.price}</span>
                <span style={{ fontSize: 12, color: "#888" }}>{product.unit}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { addToCart(product); removeFromWishlist(product.id); }} style={{ flex: 1, background: "#2d6a0e", color: "white", border: "none", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  🛒 Move to Cart
                </button>
                <button onClick={() => addToCart(product)} style={{ flex: 1, background: "#f0f9e8", color: "#2d6a0e", border: "2px solid #2d6a0e", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  + Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}