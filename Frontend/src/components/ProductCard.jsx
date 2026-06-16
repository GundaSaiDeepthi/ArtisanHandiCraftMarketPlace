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
  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] =
    useState(false);

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
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <img
          src={product.image || "/default-product.png"}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/10" />

        {/* Floating Buttons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          {(!user || user.role === "USER") && (
            <button
              onClick={handleWishlistClick}
              disabled={wishlistLoading}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-md transition-all duration-300 hover:scale-110 ${
                favorited
                  ? "text-red-500"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              <Heart
                size={18}
                fill={favorited ? "currentColor" : "none"}
              />
            </button>
          )}

          <Link
            to={`/products/${product._id}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-slate-200 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-white"
          >
            <Eye size={18} />
          </Link>
        </div>

        {/* Stock Badge */}
        {product.stock <= 0 ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            Out of Stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
            Only {product.stock} Left
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Category + Artisan */}
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>{product.category}</span>

          {product.artisan && (
            <span className="font-medium text-slate-300">
              By {product.artisan.firstName}
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/products/${product._id}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors hover:text-violet-400">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-4 flex items-center gap-2">
          <StarRating
            rating={product.rating || 0}
            size={14}
          />

          <span className="text-xs text-slate-400">
            ({product.reviewsCount || 0})
          </span>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
          
          <div>
            <p className="text-2xl font-extrabold text-white">
              ₹
              {(product.price || 0).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          {(!user || user.role === "USER") && (
            <button
              onClick={handleCartClick}
              disabled={
                adding || product.stock <= 0
              }
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-violet-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart size={16} />

              {adding ? "Adding..." : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;