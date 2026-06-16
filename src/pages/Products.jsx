import { useState } from "react";
import { CATEGORIES, CATEGORY_ICONS } from "../data/products";
import { useAllProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

export default function Products({ setPage }) {
  const { allProducts } = useAllProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 500]);

  let filtered = allProducts.filter(p => {
  const matchCat = activeCategory === "All" || p.category.toLowerCase() === activeCategory.toLowerCase();
  const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
  const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
  return matchCat && matchSearch && matchPrice;
});

  if (sortBy === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === "popular") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1a4008", marginBottom: 6 }}>Our Products</h1>
        <p style={{ color: "#6a9940" }}>{filtered.length} products found</p>
      </div>

      {/* Search + Sort */}
      <div style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 38px", borderRadius: 10, border: "2px solid #d4edbc", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, border: "2px solid #d4edbc", fontSize: 14, outline: "none", background: "white", minWidth: 160 }}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? "#2d6a0e" : "white",
              color: activeCategory === cat ? "white" : "#2d6a0e",
              border: "2px solid #2d6a0e",
              padding: "7px 16px", borderRadius: 24,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <span>{CATEGORY_ICONS[cat] || "🌿"}</span> {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h3 style={{ color: "#1a4008", marginBottom: 8 }}>No products found</h3>
          <p style={{ color: "#888" }}>Try changing your search or category filter</p>
          <button onClick={() => { setSearch(""); setActiveCategory("All"); }} style={{ marginTop: 16, background: "#2d6a0e", color: "white", border: "none", padding: "10px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 20 }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} setPage={setPage} />)}
        </div>
      )}
    </div>
  );
}