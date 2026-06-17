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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const go = (target) => {
    setPage(target);
    setMenuOpen(false);
    setSearch("");
    setSearchOpen(false);
    setMobileSearchOpen(false);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) setMobileSearchOpen(false);
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
    fontSize: 14, fontWeight: page === target ? 700 : 500,
    padding: "4px 0", whiteSpace: "nowrap",
    borderBottom: page === target ? "2px solid #a3d977" : "2px solid transparent",
    display: "flex", alignItems: "center", gap: 4,
    width: "auto", textAlign: "left",
  });

  const mobileBtnStyle = (target) => ({
    background: "none", border: "none", color: "white", cursor: "pointer",
    fontSize: 15, fontWeight: page === target ? 700 : 400, padding: "10px 0",
    borderBottom: page === target ? "2px solid #a3d977" : "2px solid transparent",
    display: "flex", alignItems: "center", gap: 5,
    width: "100%", textAlign: "left",
  });

  const DesktopSearchDropdown = () => (
    searchOpen && search.trim().length > 1 ? (
      <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", zIndex: 300, overflow: "hidden" }}>
        {searchResults.length > 0 ? (
          <>
            {searchResults.map(p => (
              <div key={p.id}
                onClick={() => { setPage(`product-${p.id}`); setSearch(""); setSearchOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f9e8", background: "white" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5fef0"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}
              >
                <img src={p.image} alt={p.name} style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a4008", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{p.category} • ₹{p.price}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2d6a0e", flexShrink: 0 }}>₹{p.price}</span>
              </div>
            ))}
            <div onClick={() => { go("products"); }}
              style={{ padding: "10px 14px", textAlign: "center", fontSize: 13, color: "#2d6a0e", fontWeight: 600, cursor: "pointer", background: "#f9fef5" }}>
              See all results for "{search}" →
            </div>
          </>
        ) : (
          <div style={{ padding: 16, textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>No products found for "{search}"</p>
          </div>
        )}
      </div>
    ) : null
  );

  return (
    <nav style={{ background: "#2d6a0e", color: "white", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>

      {/* ── Main Row ── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", height: 64, padding: "0 20px"}}>

        {/* Logo */}
        <button onClick={() => go("home")} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", flexShrink: 0, marginRight: "34px" }}>
          🌿 Aruku Natural Millets
        </button>

        {/* Desktop Search */}
        <div ref={searchRef} className="desktop-search" style={{ position: "relative", marginRight: "auto", maxWidth: 300 }}>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.18)", borderRadius: 10, padding: "7px 12px", gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              style={{ background: "none", border: "none", outline: "none", color: "white", fontSize: 13, width: "100%", minWidth: 0 }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setSearchOpen(false); }} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 14, padding: 0, flexShrink: 0 }}>✕</button>
            )}
          </div>
          <DesktopSearchDropdown />
        </div>

        {/* Desktop Nav Links */}
        <div className="desktop-nav" style={{ display: "flex", gap: "20px", alignItems: "center", marginLeft: "auto" }}>
          <button onClick={() => go("home")} style={btnStyle("home")}>Home</button>
          <button onClick={() => go("products")} style={btnStyle("products")}>Products</button>
          <button onClick={() => go("wishlist")} style={{ ...btnStyle("wishlist"), position: "relative" }}>
            ❤️ Wishlist
            {wishlist.length > 0 && <span style={badge}>{wishlist.length}</span>}
          </button>
          <button onClick={() => go("cart")} style={{ ...btnStyle("cart"), position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && <span style={badge}>{cartCount}</span>}
          </button>
          {user?.role === "OWNER" && (
            <button onClick={() => go("owner-dashboard")} style={btnStyle("owner-dashboard")}>📊 Dashboard</button>
          )}
          {user && user.role !== "OWNER" && (
            <button onClick={() => go("my-orders")} style={btnStyle("my-orders")}>📦 Orders</button>
          )}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#a3d977", whiteSpace: "nowrap" }}>👤 {user.name.split(" ")[0]}</span>
              <button onClick={() => { setUser(null); go("home"); }} style={{ background: "#1a4008", border: "1px solid #3b8a14", color: "white", cursor: "pointer", fontSize: 12, padding: "5px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => go("login")} style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 13, padding: "7px 14px", borderRadius: 8, fontWeight: 600, whiteSpace: "nowrap" }}>
              Login
            </button>
          )}
        </div>

        {/* Mobile: 🔍 🛒 ☰ */}
        <div className="mobile-nav" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
          <button onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMenuOpen(false); }}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 22, padding: 4, lineHeight: 1 }}>
            🔍
          </button>
          <button onClick={() => go("cart")}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 22, position: "relative", padding: 4, lineHeight: 1 }}>
            🛒
            {cartCount > 0 && <span style={badge}>{cartCount}</span>}
          </button>
          <button onClick={() => { setMenuOpen(!menuOpen); setMobileSearchOpen(false); }}
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 26, padding: 4, lineHeight: 1 }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Mobile Search Bar ── */}
      {mobileSearchOpen && (
        <div style={{ background: "#256010", padding: "10px 1rem 12px", borderTop: "1px solid #3b8a14" }}>
          <div ref={mobileSearchRef} style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", background: "white", borderRadius: 10, padding: "10px 14px", gap: 10 }}>
              <span style={{ fontSize: 16, color: "#2d6a0e", flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                autoFocus
                onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                style={{ background: "none", border: "none", outline: "none", color: "#1a4008", fontSize: 15, width: "100%", minWidth: 0 }}
              />
              {search ? (
                <button onClick={() => { setSearch(""); setSearchOpen(false); }}
                  style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: 0, flexShrink: 0 }}>✕</button>
              ) : (
                <button onClick={() => { setMobileSearchOpen(false); setSearch(""); setSearchOpen(false); }}
                  style={{ background: "none", border: "none", color: "#2d6a0e", cursor: "pointer", fontSize: 14, padding: 0, fontWeight: 600, flexShrink: 0 }}>Cancel</button>
              )}
            </div>

            {/* Mobile Search Results */}
            {searchOpen && search.trim().length > 1 && (
              <div style={{ background: "white", borderRadius: 12, marginTop: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}>
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map(p => (
                      <div key={p.id}
                        onClick={() => { setPage(`product-${p.id}`); setSearch(""); setSearchOpen(false); setMobileSearchOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer", borderBottom: "1px solid #f0f9e8", background: "white" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f5fef0"}
                        onMouseLeave={e => e.currentTarget.style.background = "white"}
                      >
                        <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a4008", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                          <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{p.category} • ₹{p.price}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#2d6a0e", flexShrink: 0 }}>₹{p.price}</span>
                      </div>
                    ))}
                    <div onClick={() => { go("products"); setMobileSearchOpen(false); }}
                      style={{ padding: "12px 14px", textAlign: "center", fontSize: 14, color: "#2d6a0e", fontWeight: 600, cursor: "pointer", background: "#f9fef5" }}>
                      See all results for "{search}" →
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 20, textAlign: "center" }}>
                    <p style={{ color: "#888", fontSize: 14, margin: 0 }}>No products found for "{search}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile Dropdown Menu ── */}
      {menuOpen && (
        <div style={{ background: "#1a4008", padding: "0.75rem 1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid #3b8a14" }}>
          <button onClick={() => go("home")} style={mobileBtnStyle("home")}>🏠 Home</button>
          <button onClick={() => go("products")} style={mobileBtnStyle("products")}>🛍️ Products</button>
          <button onClick={() => go("wishlist")} style={mobileBtnStyle("wishlist")}>
            ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
          </button>
          <button onClick={() => go("cart")} style={mobileBtnStyle("cart")}>
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </button>
          {user?.role === "OWNER" && (
            <button onClick={() => go("owner-dashboard")} style={mobileBtnStyle("owner-dashboard")}>📊 Dashboard</button>
          )}
          {user && user.role !== "OWNER" && (
            <button onClick={() => go("my-orders")} style={mobileBtnStyle("my-orders")}>📦 My Orders</button>
          )}
          <div style={{ borderTop: "1px solid #3b8a14", marginTop: 8, paddingTop: 8 }}>
            {user ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "#a3d977" }}>👤 {user.name.split(" ")[0]}</span>
                <button onClick={() => { setUser(null); go("home"); }}
                  style={{ background: "#e74c3c", border: "none", color: "white", cursor: "pointer", fontSize: 13, padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}>
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => go("login")}
                style={{ background: "#3b8a14", border: "none", color: "white", cursor: "pointer", fontSize: 15, padding: "10px 24px", borderRadius: 8, fontWeight: 600, width: "100%" }}>
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .desktop-search { display: block !important; }
        .mobile-nav { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.65); }
      `}</style>
    </nav>
  );
}

const badge = {
  background: "#e74c3c", borderRadius: "50%", width: 18, height: 18,
  fontSize: 11, display: "inline-flex", alignItems: "center",
  justifyContent: "center", fontWeight: 700,
  position: "absolute", top: -6, right: -6,
};