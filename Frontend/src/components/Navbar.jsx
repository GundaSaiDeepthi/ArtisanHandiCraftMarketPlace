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
  Grid,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartItems = [] } = useCart();
  const { wishlistItems = [] } = useWishlist();

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <nav
      className="glass navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        height: "70px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.5rem",
              background:
                "linear-gradient(135deg,var(--primary),var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ArtisanMarket
          </span>
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="search-form"
          style={{
            position: "relative",
            maxWidth: "400px",
            width: "100%",
            display: "none",
          }}
        >
          <input
            type="text"
            placeholder="Search handicrafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingRight: "2.5rem",
            }}
          />

          <button
            type="submit"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* Desktop Menu */}
        <div
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
          }}
        >
          <Link
            to="/shop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <Grid size={16} />
            Shop
          </Link>

          {user?.role === "USER" && (
            <>
              <Link to="/wishlist" style={{ position: "relative" }}>
                <Heart
                  size={22}
                  style={{
                    fill:
                      wishlistItems.length > 0
                        ? "var(--danger)"
                        : "none",
                    color:
                      wishlistItems.length > 0
                        ? "var(--danger)"
                        : "inherit",
                  }}
                />

                {wishlistItems.length > 0 && (
                  <span
                    className="badge badge-danger"
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                    }}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" style={{ position: "relative" }}>
                <ShoppingBag size={22} />

                {cartCount > 0 && (
                  <span
                    className="badge badge-primary"
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {user?.role === "ARTISAN" && (
            <Link to="/artisan" className="badge badge-primary">
              Artisan Panel
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/admin" className="badge badge-danger">
              Admin Panel
            </Link>
          )}

          {/* Theme */}
          <button
            onClick={toggleTheme}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? (
              <Sun size={20} color="gold" />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* User */}
          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <img
                  src={user.profileImageUrl || "/default-avatar.png"}
                  alt="profile"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <span>{user.firstName}</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "red",
                }}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>

              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="mobile-toggle" style={{ display: "none" }}>
          <button
            onClick={toggleTheme}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-nav{
            display:none !important;
          }

          .mobile-toggle{
            display:flex !important;
            align-items:center;
            gap:10px;
          }
        }

        @media(min-width:769px){
          .search-form{
            display:block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;