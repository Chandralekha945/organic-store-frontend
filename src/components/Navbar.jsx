import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar({ page, setPage, user, setUser }) {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (target) => { setPage(target); setMenuOpen(false); };

  const NavBtn = ({ label, target, icon }) => (
    <button onClick={() => go(target)} style={{
      background: "none", border: "none", color: "white", cursor: "pointer",
      fontSize: 15, fontWeight: page === target ? 700 : 400, padding: "4px 0",
      borderBottom: page === target ? "2px solid #a3d977" : "2px solid transparent",
      transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5,
    }}>
      {icon && <span>{icon}</span>}{label}
    </button>
  );

  return (
    <nav style={{ background: "#2d6a0e", color: "white", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <button onClick={() => go("home")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
          🌿 Aruku Natural Millets
        </button>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <NavBtn label="Home" target="home" />
          <NavBtn label="Products" target="products" />

          {/* Wishlist */}
          <button onClick={() => go("wishlist")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "4px 0", borderBottom: page === "wishlist" ? "2px solid #a3d977" : "2px solid transparent", position: "relative", display: "flex", alignItems: "center", gap: 5 }}>
            ❤️ Wishlist
            {wishlist.length > 0 && (
              <span style={{ background: "#e74c3c", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginLeft: 2 }}>
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button onClick={() => go("cart")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "4px 0", borderBottom: page === "cart" ? "2px solid #a3d977" : "2px solid transparent", position: "relative", display: "flex", alignItems: "center", gap: 5 }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{ background: "#e74c3c", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Owner Dashboard link (only for owner) */}
{user && user.role === "OWNER" && (
  <button onClick={() => go("owner-dashboard")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "4px 0", borderBottom: page === "owner-dashboard" ? "2px solid #a3d977" : "2px solid transparent" }}>
    📊 Dashboard
  </button>
)}
{user && user.role !== "OWNER" && (
  <button onClick={() => go("my-orders")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "4px 0", borderBottom: page === "my-orders" ? "2px solid #a3d977" : "2px solid transparent" }}>
    📦 My Orders
  </button>
)}
         
          {/* Auth */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#a3d977" }}>👤 {user.name.split(" ")[0]}</span>
              <button onClick={() => { setUser(null); go("home"); }} style={{ background: "#1a4008", border: "1px solid #3b8a14", color: "white", cursor: "pointer", fontSize: 13, padding: "6px 14px", borderRadius: 8 }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => go("login")} style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 14, padding: "8px 18px", borderRadius: 8, fontWeight: 600 }}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}