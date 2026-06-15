import { useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";

const API_BASE = "http://localhost:8080/api";
const DB_ID_OFFSET = 100000; // keeps DB product IDs separate from static ones

export function useAllProducts() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/products`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        if (cancelled) return;
        const mapped = Array.isArray(data)
          ? data.map(p => ({
              id: DB_ID_OFFSET + p.id,
              name: p.name,
              category: p.category || "Others",
              price: p.price,
              unit: "1 unit",
              description: `${p.name} — freshly stocked, available now.`,
              image: p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
              stock: 50,
              rating: 4.5,
              reviews: 0,
            }))
          : [];
        setDbProducts(mapped);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allProducts = [...PRODUCTS, ...dbProducts];
  return { allProducts, loading };
}