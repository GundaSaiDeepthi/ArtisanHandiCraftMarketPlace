import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const favorited = isInWishlist(product._id);

  const handleCartClick = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to add products to your cart!");
      return;
    }
    if (user.role !== "USER") {
      alert("Only customers can purchase products!");
      return;
    }
    try {
      setAdding(true);
      await addToCart(product._id, 1);
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to save products to your wishlist!");
      return;
    }
    if (user.role !== "USER") {
      alert("Only customers can use the wishlist!");
      return;
    }
    try {
      setWishlistLoading(true);
      if (favorited) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (err) {
      alert(err.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className="glass-card product-card" style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Product Image Wrapper */}
      <div style={{
        position: "relative",
        paddingTop: "100%", /* 1:1 Aspect Ratio */
        backgroundColor: "var(--muted)",
        overflow: "hidden"
      }}>
        <img
          src={product.image || "/default-product.png"}
          alt={product.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform var(--transition-slow)"
          }}
          className="product-img"
        />

        {/* Floating actions */}
        <div style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 10
        }}>
          {(!user || user.role === "USER") && (
            <button
              onClick={handleWishlistClick}
              disabled={wishlistLoading}
              className="glass action-btn"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
                color: favorited ? "var(--danger)" : "var(--foreground)",
                transition: "transform var(--transition-fast)"
              }}
            >
              <Heart size={18} style={{ fill: favorited ? "var(--danger)" : "none" }} />
            </button>
          )}

          <Link
            to={`/products/${product._id}`}
            className="glass action-btn"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              color: "var(--foreground)",
              transition: "transform var(--transition-fast)"
            }}
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Stock Status Badge */}
        {product.stock <= 0 ? (
          <span className="badge badge-danger" style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem" }}>
            Out of Stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="badge badge-warning" style={{ position: "absolute", bottom: "0.75rem", left: "0.75rem" }}>
            Only {product.stock} left
          </span>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        gap: "0.5rem"
      }}>
        {/* Category & Artisan */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
          <span>{product.category}</span>
          {product.artisan && (
            <span style={{ fontWeight: 600 }}>By {product.artisan.firstName}</span>
          )}
        </div>

        {/* Product Title */}
        <Link to={`/products/${product._id}`}>
          <h3 style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            margin: "0.25rem 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>
            {product.title}
          </h3>
        </Link>

        {/* Reviews Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <StarRating rating={product.rating} size={14} />
          <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price and Add to Cart Button */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "0.5rem"
        }}>
          <span style={{
            fontSize: "1.25rem",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            color: "var(--foreground)"
          }}>
            ₹{(product.price || 0).toLocaleString("en-IN")}
          </span>

          {(!user || user.role === "USER") && (
            <button
              onClick={handleCartClick}
              disabled={adding || product.stock <= 0}
              className="btn btn-primary"
              style={{
                padding: "0.5rem",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
      </div>
      <style>{`
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
        .action-btn:hover {
          transform: scale(1.1);
          background-color: var(--primary) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};
export default ProductCard;