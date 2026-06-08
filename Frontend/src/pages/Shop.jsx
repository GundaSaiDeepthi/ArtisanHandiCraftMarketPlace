import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("latest");

  const location = useLocation();
  const navigate = useNavigate();

  // Load URL queries on startup
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";
    const urlCategory = params.get("category") || "";
    
    setSearch(urlSearch);
    setCategory(urlCategory);
    setPage(1);
  }, [location.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (sort) queryParams.append("sort", sort);
      queryParams.append("page", page.toString());
      queryParams.append("limit", "8");

      const res = await api.get(`/artisan-api/products?${queryParams.toString()}`);
      if (res.data.success) {
        setProducts(res.data.payload || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.totalProducts || 0);
      }
    }  catch (err) {
  console.error("Error loading products:", err);
  setProducts([]);
}
     finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sort, page]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("latest");
    setPage(1);
    navigate("/shop");
  };

  const categories = [
    "Wood Craft",
    "Pottery",
    "Jewelry",
    "Textiles",
    "Painting",
    "Home Decor",
  ];

  return (
    <div className="container anim-fade shop-layout" style={{ paddingTop: "2rem", display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem" }}>
      {/* Sidebar Filters */}
      <aside className="glass shop-sidebar" style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-xl)",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.2rem", margin: 0 }}>
            <SlidersHorizontal size={18} /> Filters
          </h3>
          {(search || category || minPrice || maxPrice || sort !== "latest") && (
            <button onClick={handleClearFilters} className="btn-ghost" style={{ fontSize: "0.8rem", border: "none", background: "none", cursor: "pointer", color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.25rem", padding: "2px 6px", borderRadius: "var(--radius-sm)" }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div className="form-group">
          <label className="form-label">Search</label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search crafts..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="form-input"
              style={{ paddingRight: "2rem" }}
            />
            <Search size={16} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          </div>
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="form-input"
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="form-group">
          <label className="form-label">Price Range (₹)</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
              className="form-input"
              style={{ padding: "0.5rem" }}
            />
            <span style={{ color: "var(--muted-foreground)" }}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
              className="form-input"
              style={{ padding: "0.5rem" }}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="form-group">
          <label className="form-label">Sort By</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="form-input"
          >
            <option value="latest">Latest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </aside>

      {/* Product Grid Area */}
      <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", margin: 0 }}>All Creations</h2>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>
              Showing {products.length} of {totalProducts} items
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "8rem 0" }}>
            <span className="anim-pulse" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Filtering unique creations...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="glass" style={{ textAlign: "center", padding: "5rem", borderRadius: "var(--radius-xl)" }}>
            <p style={{ fontSize: "1.2rem", color: "var(--muted-foreground)", marginBottom: "1rem" }}>
              No handicrafts match your filters.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "2rem"
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary"
              style={{ padding: "0.5rem 0.75rem" }}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span style={{ fontWeight: 600 }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-secondary"
              style={{ padding: "0.5rem 0.75rem" }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <style>{`
        .shop-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }
        @media (max-width: 768px) {
          .shop-layout {
            grid-template-columns: 1fr !important;
          }
          .shop-sidebar {
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
export default Shop;
