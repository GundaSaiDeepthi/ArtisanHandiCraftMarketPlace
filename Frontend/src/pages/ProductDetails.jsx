import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { StarRating } from "../components/StarRating";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Heart, Plus, Minus, MessageSquare, AlertCircle } from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cart quantity state
  const [quantity, setQuantity] = useState(1);
  const [cartAdding, setCartAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const prodRes = await api.get(`/user-api/products/${productId}`);
      if (prodRes.data.success) {
        setProduct(prodRes.data.payload);
      }

      const revRes = await api.get(`/user-api/reviews/${productId}`);
      if (revRes.data.success) {
        setReviews(revRes.data.payload || []);
      }
    } catch (err) {
      console.error("Error loading product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add products to your cart!");
      return;
    }
    if (user.role !== "USER") {
      alert("Only customers can purchase products!");
      return;
    }
    try {
      setCartAdding(true);
      await addToCart(product?._id, quantity);
      alert("Added to cart successfully!");
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    } finally {
      setCartAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please login to use the wishlist!");
      return;
    }
    if (user.role !== "USER") {
      alert("Only customers can use the wishlist!");
      return;
    }
    try {
      setWishlistLoading(true);
      if (isInWishlist(product._id)) {
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }
    try {
      setSubmittingReview(true);
      setReviewError(null);
      const res = await api.post("/user-api/reviews", {
        productId,
        rating,
        comment: comment.trim(),
      });
      if (res.data.success) {
        setComment("");
        setRating(5);
        // Refresh product rating stats and reviews list
        await fetchProductAndReviews();
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: "flex", justifyContent: "center", padding: "10rem 0" }}>
        <span className="anim-pulse" style={{ fontSize: "1.2rem", fontWeight: 600 }}>Loading craft details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "10rem 0" }}>
        <h2>Product Not Found</h2>
        <p style={{ color: "var(--muted-foreground)", margin: "1rem 0" }}>The product you are looking for might have been removed.</p>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  return (
    <div className="container anim-fade" style={{ paddingTop: "2rem", display: "flex", flexDirection: "column", gap: "4rem" }}>
      {/* Product Detail Top Section */}
      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "3.5rem" }} className="product-top-grid">
        {/* Product Image */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "100%",
              maxHeight: "550px",
              objectFit: "cover",
              borderRadius: "var(--radius-2xl)",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border)"
            }}
          />
        </div>

        {/* Product Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Category */}
          <span className="badge badge-primary" style={{ width: "fit-content" }}>{product.category}</span>
          
          {/* Title */}
          <h1 style={{ fontSize: "2.5rem", marginBottom: 0 }}>{product.title}</h1>
          
          {/* Artisan Name */}
          {product.artisan && (
            <p style={{ fontSize: "0.95rem", color: "var(--muted-foreground)", fontWeight: 600 }}>
              Crafted by:{" "}
              <span style={{ color: "var(--primary)" }}>
                {product.artisan.firstName} {product.artisan.lastName}
              </span>
            </p>
          )}

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <StarRating rating={product.rating} size={20} />
            <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{product.rating.toFixed(1)}</span>
            <span style={{ color: "var(--muted-foreground)" }}>•</span>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>{reviews.length} Verified Reviews</span>
          </div>

          <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

          {/* Description */}
          <p style={{ lineHeight: 1.7, opacity: 0.9 }}>{product.description}</p>

          <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} />

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 800 }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.85rem" }}>(Inclusive of local taxes)</span>
          </div>

          {/* Stock status */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Availability:</span>
            {product.stock > 0 ? (
              <span className="badge badge-success">In Stock ({product.stock} items left)</span>
            ) : (
              <span className="badge badge-danger">Temporarily Out of Stock</span>
            )}
          </div>

          {/* Customer Purchasing Options */}
          {(!user || user.role === "USER") && product.stock > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>Quantity:</span>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.25rem"
                }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="btn-ghost"
                    style={{ padding: "0.25rem", border: "none", background: "none", cursor: "pointer" }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ width: "40px", textAlign: "center", fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="btn-ghost"
                    style={{ padding: "0.25rem", border: "none", background: "none", cursor: "pointer" }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleAddToCart}
                  disabled={cartAdding}
                  className="btn btn-primary"
                  style={{ flexGrow: 1, padding: "0.85rem", gap: "0.5rem" }}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="btn btn-secondary"
                  style={{
                    padding: "0.85rem",
                    color: isFavorited ? "var(--danger)" : "inherit",
                    border: isFavorited ? "1px solid var(--danger)" : "1px solid var(--border)"
                  }}
                >
                  <Heart size={18} style={{ fill: isFavorited ? "var(--danger)" : "none" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Reviews Section */}
      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "3.5rem" }} className="product-top-grid">
        {/* Reviews List */}
        <div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MessageSquare size={24} /> Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="glass" style={{ padding: "3rem", borderRadius: "var(--radius-xl)", textAlign: "center", color: "var(--muted-foreground)" }}>
              No reviews for this product yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {reviews.map((rev) => (
                <div key={rev._id} className="glass" style={{ padding: "1.5rem", borderRadius: "var(--radius-xl)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <img
                        src={
  rev.user?.profileImageUrl ||
  "https://via.placeholder.com/150"
}
                        alt={rev.user?.firstName || "Customer"}
                        style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                      />
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
                          {rev.user ? `${rev.user.firstName} ${rev.user.lastName}` : "Verified Buyer"}
                        </h4>
                        <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} size={14} />
                  </div>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Review Form */}
        <div>
          {user && user.role === "USER" ? (
            <div className="glass" style={{ padding: "2rem", borderRadius: "var(--radius-xl)" }}>
              <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem" }}>Write a Review</h3>
              
              {reviewError && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--danger)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                  <AlertCircle size={16} /> {reviewError}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label className="form-label">Rating</label>
                  <StarRating rating={rating} size={24} interactive={true} onRatingChange={setRating} />
                </div>

                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    placeholder="Share your experience with this handcrafted creation..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input form-textarea"
                    rows={4}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : !user ? (
            <div className="glass" style={{ padding: "2rem", borderRadius: "var(--radius-xl)", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Want to leave a review?</h3>
              <p style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                You must be logged in as a customer to review this handicraft.
              </p>
              <Link to="/login" className="btn btn-outline" style={{ width: "100%" }}>Login to Review</Link>
            </div>
          ) : null}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .product-top-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
export default ProductDetails;
