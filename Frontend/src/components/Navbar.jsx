import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { 
  ShoppingBag, 
  Heart, 
  Sun, 
  Moon, 
  LogOut, 
  Menu, 
  X,
  Search,
  Grid
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const cartCount = cartItems.reduce(
  (acc, item) => acc + (item.quantity || 1),
  0
);

  return (
    <nav className="glass navbar" style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 1000,
      height: "70px",
      display: "flex",
      alignItems: "center"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={() => setMobileMenuOpen(false)}>
          <span style={{ 
            fontFamily: "var(--font-display)", 
            fontWeight: 800, 
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            ArtisanMarket
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form" style={{
          position: "relative",
          maxWidth: "400px",
          width: "100%",
          display: "none"
        }}>
          <input
            type="text"
            placeholder="Search unique handicrafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingRight: "2.5rem",
              borderRadius: "var(--radius-xl)",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              fontSize: "0.9rem"
            }}
          />
          <button type="submit" style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--muted-foreground)",
            cursor: "pointer"
          }}>
            <Search size={18} />
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link to="/shop" style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Grid size={16} /> Shop
          </Link>
          
          {user && user.role === "USER" && (
            <>
              <Link to="/wishlist" style={{ position: "relative" }}>
                <Heart size={22} style={{ fill: wishlistItems.length > 0 ? "var(--danger)" : "none", color: wishlistItems.length > 0 ? "var(--danger)" : "var(--foreground)" }} />
                {wishlistItems.length > 0 && (
                  <span className="badge badge-danger" style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "0.65rem", padding: "2px 5px" }}>
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" style={{ position: "relative" }}>
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="badge badge-primary" style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "0.65rem", padding: "2px 5px" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {user && user.role === "ARTISAN" && (
            <Link to="/artisan" style={{ fontWeight: 600 }} className="badge badge-primary">
              Artisan Panel
            </Link>
          )}

          {user && user.role === "ADMIN" && (
            <Link to="/admin" style={{ fontWeight: 600 }} className="badge badge-danger">
              Admin Panel
            </Link>
          )}

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="btn-ghost" style={{ border: "none", background: "none", cursor: "pointer", display: "flex", padding: "6px", borderRadius: "50%" }}>
            {theme === "dark" ? <Sun size={20} style={{ color: "yellow" }} /> : <Moon size={20} />}
          </button>

          {/* User Options */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img 
                  src={user.profileImageUrl || "/default-avatar.png"} 
                  alt={user.firstName} 
                  style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
                />
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{user.firstName}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{ display: "flex", padding: "6px", border: "none", background: "none", cursor: "pointer", color: "var(--danger)" }}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link to="/login" className="btn btn-ghost" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Log In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Register</Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div style={{ display: "none" }} className="mobile-toggle">
          <button onClick={toggleTheme} className="btn-ghost" style={{ border: "none", background: "none", cursor: "pointer", marginRight: "0.5rem" }}>
            {theme === "dark" ? <Sun size={20} style={{ color: "yellow" }} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn-ghost" style={{ border: "none", background: "none", cursor: "pointer" }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="glass animated-fade" style={{
          position: "fixed",
          top: "70px",
          left: 0,
          width: "100%",
          height: "calc(100vh - 70px)",
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          gap: "1.5rem"
        }}>
          <form onSubmit={handleSearchSubmit} style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search unique handicrafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
            <button type="submit" style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted-foreground)" }}>
              <Search size={18} />
            </button>
          </form>

          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.2rem", fontWeight: 600 }}>Shop Handicrafts</Link>
          
          {user && user.role === "USER" && (
            <>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.2rem", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                <span>My Wishlist</span>
                <span className="badge badge-danger">{wishlistItems.length}</span>
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.2rem", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                <span>My Cart</span>
                <span className="badge badge-primary">{cartCount}</span>
              </Link>
            </>
          )}

          {user && user.role === "ARTISAN" && (
            <Link to="/artisan" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.2rem", fontWeight: 600 }}>Artisan Dashboard</Link>
          )}

          {user && user.role === "ADMIN" && (
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.2rem", fontWeight: 600 }}>Admin Dashboard</Link>
          )}

          {user && (
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: "1.2rem", fontWeight: 600 }}>My Profile</Link>
          )}

          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "1rem 0" }} />

          {user ? (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-danger" style={{ width: "100%" }}>
              Log Out
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ textAlign: "center" }}>Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ textAlign: "center" }}>Register</Link>
            </div>
          )}
        </div>
      )}

      {/* CSS adjustments embedded */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; align-items: center; }
        }
        @media (min-width: 769px) {
          .search-form { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
