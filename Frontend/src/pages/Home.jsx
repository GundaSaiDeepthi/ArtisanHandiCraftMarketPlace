import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ProductCard } from "../components/ProductCard";
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
          setFeaturedProducts(
            res.data.payload.slice(0, 4)
          );
        }
      } catch (err) {
        console.error(
          "Error loading featured products:",
          err
        );
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
    <div
      className="anim-fade"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5rem",
        paddingBottom: "2rem",
      }}
    >
      {/* Hero Section */}
      <section
        className="dark-gradient"
        style={{
          position: "relative",
          padding: "8rem 0 6rem 0",
          color: "white",
          overflow: "hidden",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(40px)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(50px)",
            zIndex: 1,
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.08)",
                border:
                  "1px solid rgba(255,255,255,0.15)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--accent)",
                marginBottom: "1.5rem",
              }}
            >
              <Sparkles size={14} />
              100% Handcrafted Handicrafts
            </div>

            <h1
              style={{
                fontSize: "3.5rem",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                fontFamily: "var(--font-display)",
              }}
            >
              Preserving Traditions,
              <br />
              <span className="grad-text">
                One Craft at a Time
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.2rem",
                opacity: 0.85,
                marginBottom: "2.5rem",
                maxWidth: "600px",
                lineHeight: 1.6,
              }}
            >
              Explore unique creations handcrafted by
              local artisans. Every item has a history,
              and every purchase supports a family's
              livelihood.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              <Link
                to="/shop"
                className="btn btn-primary"
                style={{
                  padding: "0.85rem 2rem",
                  fontSize: "1.05rem",
                }}
              >
                Browse HandiCrafts
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register?role=artisan"
                className="btn btn-secondary"
                style={{
                  background:
                    "rgba(255,255,255,0.05)",
                  border:
                    "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  padding: "0.85rem 2rem",
                  fontSize: "1.05rem",
                }}
              >
                Become an Artisan
              </Link>
            </div>
          </div>

          <div
            className="hero-image-container"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80"
              alt="Pottery crafting"
              style={{
                borderRadius:
                  "var(--radius-2xl)",
                boxShadow: "var(--shadow-xl)",
                border:
                  "4px solid rgba(255,255,255,0.1)",
                maxHeight: "450px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h2 style={{ fontSize: "2.25rem" }}>
            Shop by Category
          </h2>

          <p
            style={{
              color:
                "var(--muted-foreground)",
            }}
          >
            Discover creations categorized by
            authentic handicraft mediums
          </p>
        </div>

        <div className="grid-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(
                cat.name
              )}`}
              className="glass-card"
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <span
                style={{
                  fontWeight: 700,
                }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h2>Featured Creations</h2>
            <p>
              Selected masterpieces from our
              artisans
            </p>
          </div>

          <Link
            to="/shop"
            className="btn btn-outline"
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
            }}
          >
            Loading products...
          </div>
        ) : featuredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
            }}
          >
            No products available.
          </div>
        ) : (
          <div className="grid-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Value Section */}
      <section
        className="glass"
        style={{
          padding: "5rem 0",
        }}
      >
        <div className="container">
          <div>
            <ShieldCheck size={30} />
            <h3>
              100% Certified Handcrafted
            </h3>
          </div>

          <div>
            <HeartHandshake size={30} />
            <h3>
              Supporting Livelihoods
            </h3>
          </div>

          <div>
            <Award size={30} />
            <h3>
              Heritage Preservation
            </h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;