import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("latest");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearch(params.get("search") || "");
    setCategory(params.get("category") || "");
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

      const res = await api.get(
        `/artisan-api/products?${queryParams.toString()}`
      );

      if (res.data.success) {
        setProducts(res.data.payload || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.totalProducts || 0);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
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
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside className="sticky top-24 h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <SlidersHorizontal size={18} />
                Filters
              </h3>

              {(search ||
                category ||
                minPrice ||
                maxPrice ||
                sort !== "latest") && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Search
              </label>

              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search crafts..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="">All Categories</option>

                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium">
                Price Range (₹)
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
                />

                <span>-</span>

                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Sort By
              </label>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="price_asc">
                  Price: Low to High
                </option>
                <option value="price_desc">
                  Price: High to Low
                </option>
              </select>
            </div>
          </aside>

          {/* Main */}
          <main className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                  Discover Handcrafted Treasures
                </h1>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Explore unique artisan-made creations
                  from across India.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {totalProducts} Products Found
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="animate-pulse text-lg font-semibold text-slate-600 dark:text-slate-300">
                  Loading handcrafted products...
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-2xl font-bold">
                  No Products Found
                </h3>

                <p className="mt-3 text-slate-500">
                  Try adjusting your filters or search
                  terms.
                </p>

                <button
                  onClick={handleClearFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setPage((p) => Math.max(1, p - 1))
                  }
                  disabled={page === 1}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="rounded-xl bg-slate-100 px-5 py-3 font-semibold dark:bg-slate-800">
                  {page} / {totalPages}
                </span>

                <button
                  onClick={() =>
                    setPage((p) =>
                      Math.min(totalPages, p + 1)
                    )
                  }
                  disabled={page === totalPages}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium shadow-sm transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;