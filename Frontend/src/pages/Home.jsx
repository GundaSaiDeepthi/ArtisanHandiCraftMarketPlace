import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Award,
} from "lucide-react";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/user-api/products");

        if (res.data.success && res.data.payload) {
          setFeaturedProducts(res.data.payload.slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const categories = [
    {
      name: "Wood Craft",
      image:
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Pottery",
      image:
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Jewelry",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Textiles",
      image:
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Painting",
      image:
        "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Home Decor",
      image:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#070b13] transition-colors duration-300">

      {/* HERO */}
      <section className="relative overflow-hidden py-24 lg:py-32">

        <div className="absolute inset-0 bg-[#070b13]" />

        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-400">
              <Sparkles size={16} className="text-pink-400" />
              100% Handcrafted Handicrafts
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-white lg:text-6xl">
              Preserving Traditions,
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                One Craft at a Time
              </span>
            </h1>

            <p className="mb-10 max-w-xl text-lg text-slate-400">
              Explore unique creations handcrafted by local artisans. Every item
              has a history, and every purchase supports a family's livelihood.
            </p>

            <div className="flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white transition hover:bg-violet-700 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                Browse HandiCrafts
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-slate-700 bg-slate-900/40 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-slate-800"
              >
                Become an Artisan
              </Link>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex justify-center">

            <img
              src="/img1.jpg"
              alt="Artisan Crafting"
              className="w-full max-w-md rounded-[32px] border border-slate-800 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            />

          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-20">

        <div className="mb-14 text-center">

          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Shop by Category
          </h2>

          <p className="text-slate-500 dark:text-slate-400">
            Discover creations categorized by authentic handicraft mediums
          </p>

        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:shadow-lg hover:shadow-violet-500/5"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-violet-100 dark:ring-violet-500/10 transition duration-300 group-hover:scale-110"
              />

              <span className="font-semibold text-slate-900 dark:text-white text-center text-sm md:text-base">
                {cat.name}
              </span>
            </Link>
          ))}

        </div>

      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 pb-20">

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Featured Creations
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Selected masterpieces from our registered local artisans
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        {loading ? (
          <div className="py-20 text-center text-lg text-slate-500">
            Loading products...
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="py-20 text-center text-lg text-slate-500">
            No products available.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

      {/* VALUE SECTION */}
      <section className="bg-slate-100 py-20 dark:bg-[#070b13] border-t border-slate-200 dark:border-slate-800/80">

        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-8 text-center transition hover:-translate-y-1 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:shadow-lg hover:shadow-violet-500/5">

            <ShieldCheck
              size={40}
              className="mx-auto mb-4 text-violet-600 dark:text-violet-500"
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              100% Certified Handcrafted
            </h3>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-8 text-center transition hover:-translate-y-1 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:shadow-lg hover:shadow-violet-500/5">

            <HeartHandshake
              size={40}
              className="mx-auto mb-4 text-violet-600 dark:text-violet-500"
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Supporting Artisan Livelihoods
            </h3>

          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-8 text-center transition hover:-translate-y-1 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:shadow-lg hover:shadow-violet-500/5">

            <Award
              size={40}
              className="mx-auto mb-4 text-violet-600 dark:text-violet-500"
            />

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Preserving Heritage Crafts
            </h3>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;