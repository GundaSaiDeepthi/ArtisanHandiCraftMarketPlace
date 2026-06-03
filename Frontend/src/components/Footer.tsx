import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="dark-gradient" style={{
      backgroundColor: "var(--card)",
      borderTop: "1px solid var(--border)",
      padding: "4rem 0 2rem 0",
      marginTop: "4rem",
      color: "var(--muted-foreground)",
      fontSize: "0.9rem"
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: "3rem" }}>
          {/* Logo Section */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{ 
              fontFamily: "var(--font-display)", 
              fontWeight: 800, 
              fontSize: "1.35rem",
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              ArtisanMarket
            </span>
            <p style={{ lineHeight: 1.6 }}>
              A marketplace dedicated to honoring and supporting local artisans by bringing their unique handcrafted items to your doorstep.
            </p>
          </div>

          {/* Categories Section */}
          <div>
            <h4 style={{ color: "var(--card-foreground)", marginBottom: "1.25rem", fontSize: "1rem" }}>Craft Categories</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link to="/shop?category=Wood%20Craft">Wood Crafts</Link></li>
              <li><Link to="/shop?category=Pottery">Traditional Pottery</Link></li>
              <li><Link to="/shop?category=Jewelry">Handmade Jewelry</Link></li>
              <li><Link to="/shop?category=Textiles">Artisan Textiles</Link></li>
              <li><Link to="/shop?category=Home%20Decor">Home Decor</Link></li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 style={{ color: "var(--card-foreground)", marginBottom: "1.25rem", fontSize: "1rem" }}>Quick Links</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li><Link to="/shop">Shop Collection</Link></li>
              <li><Link to="/register?role=artisan">Join as Artisan</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/profile">My Orders</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 style={{ color: "var(--card-foreground)", marginBottom: "1.25rem", fontSize: "1rem" }}>Our Promise</h4>
            <p style={{ lineHeight: 1.6, marginBottom: "1rem" }}>
              Every item sold here is verified to be 100% handcrafted by true artisans. We support fair trade and sustainable wages.
            </p>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--border)", marginBottom: "2rem" }} />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p>© {new Date().getFullYear()} ArtisanHandiCraftMarketPlace. All rights reserved.</p>
          <p style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Made with <Heart size={14} style={{ fill: "var(--danger)", color: "var(--danger)" }} /> for local creators.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
