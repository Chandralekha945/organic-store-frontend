import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAllProducts } from "../hooks/useProducts";

export default function Navbar({ page, setPage, user, setUser }) {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { allProducts } = useAllProducts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const go = (target) => { setPage(target); setMenuOpen(false); };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchResults = search.trim().length > 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  const btnStyle = (target) => ({
    background: "none", border: "none", color: "white", cursor: "pointer",
    fontSize: 15, fontWeight: page === target ? 700 : 400, padding: "10px 0",
    borderBottom: page === target ? "2px solid #a3d977" : "2px solid transparent",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5,
    width: "100%", textAlign: "left",
  });

  const badgeStyle = {
    background: "#e74c3c", borderRadius: "50%", width: 18, height: 18,
    fontSize: 11, display: "inline-flex", alignItems: "center",
    justifyContent: "center", fontWeight: 700, marginLeft: 2,
    position: "absolute", top: -6, right: -6,
  };

  return (
    <nav style={{ background: "#2d6a0e", color: "white", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 12 }}>

        {/* Logo */}
        <button onClick={() => go("home")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
          🌿 Aruku Natural Millets
        </button>

        {/* Search Bar */}
        <div ref={searchRef} style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 12px", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              style={{ background: "none", border: "none", outline: "none", color: "white", fontSize: 14, width: "100%" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setSearchOpen(false); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>✕</button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, overflow: "hidden" }}>
              {searchResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setPage(`product-${p.id}`); setSearch(""); setSearchOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f9e8", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5fef0"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a4008", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{p.category} • ₹{p.price}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2d6a0e" }}>₹{p.price}</span>
                </div>
              ))}
              <div
                onClick={() => { go("products"); setSearch(""); setSearchOpen(false); }}
                style={{ padding: "10px 14px", textAlign: "center", fontSize: 13, color: "#2d6a0e", fontWeight: 600, cursor: "pointer", background: "#f9fef5" }}
              >
                See all results for "{search}" →
              </div>
            </div>
          )}

          {/* No results */}
          {searchOpen && search.trim().length > 1 && searchResults.length === 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, padding: "16px", textAlign: "center" }}>
              <p style={{ color: "#888", fontSize: 13, margin: 0 }}>No products found for "{search}"</p>
            </div>
          )}
        </div>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }} className="desktop-nav">
          <button onClick={() => go("home")} style={btnStyle("home")}>Home</button>
          <button onClick={() => go("products")} style={btnStyle("products")}>Products</button>
          <button onClick={() => go("wishlist")} style={{ ...btnStyle("wishlist"), position: "relative" }}>
            ❤️ Wishlist
            {wishlist.length > 0 && <span style={badgeStyle}>{wishlist.length}</span>}
          </button>
          <button onClick={() => go("cart")} style={{ ...btnStyle("cart"), position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </button>
          {user && user.role === "OWNER" && (
            <button onClick={() => go("owner-dashboard")} style={btnStyle("owner-dashboard")}>📊 Dashboard</button>
          )}
          {user && user.role !== "OWNER" && (
            <button onClick={() => go("my-orders")} style={btnStyle("my-orders")}>📦 My Orders</button>
          )}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#a3d977", whiteSpace: "nowrap" }}>👤 {user.name.split(" ")[0]}</span>
              <button onClick={() => { setUser(null); go("home"); }} style={{ background: "#1a4008", border: "1px solid #3b8a14", color: "white", cursor: "pointer", fontSize: 13, padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap" }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => go("login")} style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 14, padding: "8px 18px", borderRadius: 8, fontWeight: 600, whiteSpace: "nowrap" }}>
              Login
            </button>
          )}
        </div>

        {/* Mobile right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="mobile-nav">
          <button onClick={() => go("cart")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 20, position: "relative", padding: 4 }}>
            🛒
            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 26, padding: 4, lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{ background: "#1a4008", padding: "0.5rem 1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid #3b8a14" }}>
          <button onClick={() => go("home")} style={btnStyle("home")}>🏠 Home</button>
          <button onClick={() => go("products")} style={btnStyle("products")}>🛍️ Products</button>
          <button onClick={() => go("wishlist")} style={btnStyle("wishlist")}>
            ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </button>
          <button onClick={() => go("cart")} style={btnStyle("cart")}>
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </button>
          {user && user.role === "OWNER" && (
            <button onClick={() => go("owner-dashboard")} style={btnStyle("owner-dashboard")}>📊 Dashboard</button>
          )}
          {user && user.role !== "OWNER" && (
            <button onClick={() => go("my-orders")} style={btnStyle("my-orders")}>📦 My Orders</button>
          )}
          <div style={{ borderTop: "1px solid #3b8a14", marginTop: 8, paddingTop: 8 }}>
            {user ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#a3d977" }}>👤 {user.name.split(" ")[0]}</span>
                <button onClick={() => { setUser(null); go("home"); }} style={{ background: "#e74c3c", border: "none", color: "white", cursor: "pointer", fontSize: 13, padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => go("login")} style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "10px 24px", borderRadius: 8, fontWeight: 600, width: "100%" }}>
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.7); }
      `}</style>
    </nav>
  );
}import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAllProducts } from "../hooks/useProducts";

export default function Navbar({ page, setPage, user, setUser }) {
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { allProducts } = useAllProducts();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const go = (target) => { setPage(target); setMenuOpen(false); };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchResults = search.trim().length > 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  const btnStyle = (target) => ({
    background: "none", border: "none", color: "white", cursor: "pointer",
    fontSize: 15, fontWeight: page === target ? 700 : 400, padding: "10px 0",
    borderBottom: page === target ? "2px solid #a3d977" : "2px solid transparent",
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5,
    width: "100%", textAlign: "left",
  });

  const badgeStyle = {
    background: "#e74c3c", borderRadius: "50%", width: 18, height: 18,
    fontSize: 11, display: "inline-flex", alignItems: "center",
    justifyContent: "center", fontWeight: 700, marginLeft: 2,
    position: "absolute", top: -6, right: -6,
  };

  return (
    <nav style={{ background: "#2d6a0e", color: "white", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, gap: 12 }}>

        {/* Logo */}
        <button onClick={() => go("home")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
          🌿 Aruku Natural Millets
        </button>

        {/* Search Bar */}
        <div ref={searchRef} style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 12px", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              style={{ background: "none", border: "none", outline: "none", color: "white", fontSize: 14, width: "100%" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setSearchOpen(false); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18, padding: 0, lineHeight: 1 }}>✕</button>
            )}
          </div>

          {/* Search Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, overflow: "hidden" }}>
              {searchResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setPage(`product-${p.id}`); setSearch(""); setSearchOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f9e8", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5fef0"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a4008", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{p.category} • ₹{p.price}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2d6a0e" }}>₹{p.price}</span>
                </div>
              ))}
              <div
                onClick={() => { go("products"); setSearch(""); setSearchOpen(false); }}
                style={{ padding: "10px 14px", textAlign: "center", fontSize: 13, color: "#2d6a0e", fontWeight: 600, cursor: "pointer", background: "#f9fef5" }}
              >
                See all results for "{search}" →
              </div>
            </div>
          )}

          {/* No results */}
          {searchOpen && search.trim().length > 1 && searchResults.length === 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, padding: "16px", textAlign: "center" }}>
              <p style={{ color: "#888", fontSize: 13, margin: 0 }}>No products found for "{search}"</p>
            </div>
          )}
        </div>

        {/* Desktop Links */}
        <div style={{ display: "flex", gap: "1.2rem", alignItems: "center" }} className="desktop-nav">
          <button onClick={() => go("home")} style={btnStyle("home")}>Home</button>
          <button onClick={() => go("products")} style={btnStyle("products")}>Products</button>
          <button onClick={() => go("wishlist")} style={{ ...btnStyle("wishlist"), position: "relative" }}>
            ❤️ Wishlist
            {wishlist.length > 0 && <span style={badgeStyle}>{wishlist.length}</span>}
          </button>
          <button onClick={() => go("cart")} style={{ ...btnStyle("cart"), position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </button>
          {user && user.role === "OWNER" && (
            <button onClick={() => go("owner-dashboard")} style={btnStyle("owner-dashboard")}>📊 Dashboard</button>
          )}
          {user && user.role !== "OWNER" && (
            <button onClick={() => go("my-orders")} style={btnStyle("my-orders")}>📦 My Orders</button>
          )}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#a3d977", whiteSpace: "nowrap" }}>👤 {user.name.split(" ")[0]}</span>
              <button onClick={() => { setUser(null); go("home"); }} style={{ background: "#1a4008", border: "1px solid #3b8a14", color: "white", cursor: "pointer", fontSize: 13, padding: "6px 14px", borderRadius: 8, whiteSpace: "nowrap" }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => go("login")} style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 14, padding: "8px 18px", borderRadius: 8, fontWeight: 600, whiteSpace: "nowrap" }}>
              Login
            </button>
          )}
        </div>

        {/* Mobile right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="mobile-nav">
          <button onClick={() => go("cart")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 20, position: "relative", padding: 4 }}>
            🛒
            {cartCount > 0 && <span style={badgeStyle}>{cartCount}</span>}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 26, padding: 4, lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{ background: "#1a4008", padding: "0.5rem 1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid #3b8a14" }}>
          <button onClick={() => go("home")} style={btnStyle("home")}>🏠 Home</button>
          <button onClick={() => go("products")} style={btnStyle("products")}>🛍️ Products</button>
          <button onClick={() => go("wishlist")} style={btnStyle("wishlist")}>
            ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </button>
          <button onClick={() => go("cart")} style={btnStyle("cart")}>
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </button>
          {user && user.role === "OWNER" && (
            <button onClick={() => go("owner-dashboard")} style={btnStyle("owner-dashboard")}>📊 Dashboard</button>
          )}
          {user && user.role !== "OWNER" && (
            <button onClick={() => go("my-orders")} style={btnStyle("my-orders")}>📦 My Orders</button>
          )}
          <div style={{ borderTop: "1px solid #3b8a14", marginTop: 8, paddingTop: 8 }}>
            {user ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#a3d977" }}>👤 {user.name.split(" ")[0]}</span>
                <button onClick={() => { setUser(null); go("home"); }} style={{ background: "#e74c3c", border: "none", color: "white", cursor: "pointer", fontSize: 13, padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => go("login")} style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "10px 24px", borderRadius: 8, fontWeight: 600, width: "100%" }}>
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.7); }
      `}</style>
    </nav>
  );
}