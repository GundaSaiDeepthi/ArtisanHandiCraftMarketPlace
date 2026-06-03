import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award } from "lucide-react";

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/user-api/products");
        if (res.data.success && res.data.payload) {
          // Take first 4 or 8 products as featured
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
    { name: "Wood Craft", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80" },
    { name: "Pottery", image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80" },
    { name: "Jewelry", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80" },
    { name: "Textiles", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80" },
    { name: "Painting", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80" },
    { name: "Home Decor", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="anim-fade" style={{ display: "flex", flexDirection: "column", gap: "5rem", paddingBottom: "2rem" }}>
      {/* Hero Section */}
      <section className="dark-gradient" style={{
        position: "relative",
        padding: "8rem 0 6rem 0",
        color: "white",
        overflow: "hidden",
        borderBottom: "1px solid var(--border)"
      }}>
        {/* Background glow effects */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(40px)",
          zIndex: 1
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(50px)",
          zIndex: 1
        }}></div>

        <div className="container" style={{ position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0.75rem", borderRadius: "9999px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)", marginBottom: "1.5rem" }}>
              <Sparkles size={14} /> 100% Handcrafted Handicrafts
            </div>
            <h1 style={{ fontSize: "3.5rem", lineHeight: 1.1, marginBottom: "1.5rem", fontFamily: "var(--font-display)" }}>
              Preserving Traditions, <br />
              <span className="grad-text">One Craft at a Time</span>
            </h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.85, marginBottom: "2.5rem", maxWidth: "600px", lineHeight: 1.6 }}>
              Explore unique creations handcrafted by local artisans. Every item has a history, and every purchase supports a family's livelihood.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link to="/shop" className="btn btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "1.05rem" }}>
                Browse HandiCrafts <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=artisan" className="btn btn-secondary" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "white", padding: "0.85rem 2rem", fontSize: "1.05rem" }}>
                Become an Artisan
              </Link>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80" 
              alt="Pottery crafting" 
              style={{
                borderRadius: "var(--radius-2xl)",
                boxShadow: "var(--shadow-xl)",
                border: "4px solid rgba(255,255,255,0.1)",
                maxHeight: "450px",
                objectFit: "cover"
              }}
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2.25rem" }}>Shop by Category</h2>
          <p style={{ color: "var(--muted-foreground)" }}>Discover creations categorized by authentic handicraft mediums</p>
        </div>

        <div className="grid-6" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "1.5rem"
        }}>
          {categories.map((cat, idx) => (
            <Link 
              key={idx} 
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
                borderRadius: "var(--radius-xl)",
                textAlign: "center",
                gap: "0.75rem",
                overflow: "hidden"
              }}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--border)"
                }}
              />
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Handicrafts */}
      <section className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
          <div>
            <h2 style={{ fontSize: "2.25rem" }}>Featured Creations</h2>
            <p style={{ color: "var(--muted-foreground)" }}>Selected masterpieces from our registered local artisans</p>
          </div>
          <Link to="/shop" className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}>
            <span className="anim-pulse" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Loading unique crafts...</span>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted-foreground)" }}>
            No products uploaded yet. Stay tuned!
          </div>
        ) : (
          <div className="grid-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Value Promise Section */}
      <section className="glass" style={{
        padding: "5rem 0",
        borderRadius: "var(--radius-2xl)",
        margin: "0 1.5rem"
      }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <ShieldCheck size={30} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>100% Certified Handcrafted</h3>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              Every single product listed on our marketplace is verified to be handmade without industrial assembly lines.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <HeartHandshake size={30} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Supporting Livelihoods</h3>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              Artisans receive over 85% of the sales revenue directly, cutting out middlemen and supporting their family businesses.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Award size={30} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Heritage Preservation</h3>
            <p style={{ color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              Each item sold helps keep traditional methods, regional cultures, and generational skills alive in modern times.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-image-container { display: none !important; }
          .hero-image-container + div, section .container { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) {
          .grid-6 { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .glass .container { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .grid-6 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};
export default Home;
