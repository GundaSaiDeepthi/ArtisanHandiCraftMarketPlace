import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import StarRating from "../components/StarRating";
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
    <div className="mx-auto flex min-h-[400px] max-w-7xl items-center justify-center px-4">
      <span className="animate-pulse text-lg font-semibold text-gray-700 dark:text-gray-300">
        Loading craft details...
      </span>
    </div>
  );
}

if (!product) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-40 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Product Not Found
      </h2>

      <p className="my-4 text-gray-500 dark:text-gray-400">
        The product you are looking for might have been removed.
      </p>

      <Link
        to="/shop"
        className="
          inline-flex
          items-center
          justify-center
          rounded-xl
          bg-blue-600
          px-6
          py-3
          text-sm
          font-medium
          text-white
          transition-all
          duration-200
          hover:bg-blue-700
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
        "
      >
        Back to Shop
      </Link>
    </div>
  );
}

  const isFavorited = isInWishlist(product._id);

return (
  <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Top Section */}
      <section className="grid gap-10 lg:grid-cols-2">

        {/* Product Image */}
        <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="h-[650px] w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:sticky lg:top-24 h-fit">

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">

            <span className="inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {product.category}
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              {product.title}
            </h1>

            {product.artisan && (
              <p className="mt-3 text-sm text-slate-500">
                Crafted by{" "}
                <span className="font-semibold text-blue-600">
                  {product.artisan.firstName}{" "}
                  {product.artisan.lastName}
                </span>
              </p>
            )}

            {/* Ratings */}
            <div className="mt-6 flex items-center gap-3">
              <StarRating
                rating={product.rating}
                size={20}
              />

              <span className="font-bold">
                {product.rating.toFixed(1)}
              </span>

              <span className="text-slate-400">
                ({reviews.length} reviews)
              </span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="mb-2 text-lg font-semibold">
                Description
              </h3>

              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {product.description}
              </p>
            </div>

            {/* Price Card */}
            <div className="mt-8 rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Price
                  </p>

                  <h2 className="text-4xl font-black">
                    ₹{product.price.toLocaleString("en-IN")}
                  </h2>
                </div>

                {product.stock > 0 ? (
                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {product.stock} Available
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    Out of Stock
                  </span>
                )}
              </div>

            </div>

            {/* Purchase */}
            {(!user || user.role === "USER") &&
              product.stock > 0 && (
                <>
                  <div className="mt-8 flex items-center justify-between">

                    <span className="font-semibold">
                      Quantity
                    </span>

                    <div className="flex items-center rounded-xl border border-slate-300 dark:border-slate-700">

                      <button
                        onClick={() =>
                          setQuantity((q) =>
                            Math.max(1, q - 1)
                          )
                        }
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Minus size={18} />
                      </button>

                      <span className="px-5 font-bold">
                        {quantity}
                      </span>

                      <button
                        onClick={() =>
                          setQuantity((q) =>
                            Math.min(
                              product.stock,
                              q + 1
                            )
                          )
                        }
                        className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Plus size={18} />
                      </button>

                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-8 flex gap-4">

                    <button
                      onClick={handleAddToCart}
                      disabled={cartAdding}
                      className="
                        flex-1
                        rounded-xl
                        bg-blue-600
                        px-6
                        py-4
                        font-semibold
                        text-white
                        shadow-lg
                        transition
                        hover:bg-blue-700
                      "
                    >
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart size={18} />
                        {cartAdding
                          ? "Adding..."
                          : "Add To Cart"}
                      </span>
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      className={`
                        rounded-xl
                        border
                        p-4
                        transition
                        ${
                          isFavorited
                            ? "border-red-500 text-red-500"
                            : "border-slate-300 dark:border-slate-700"
                        }
                      `}
                    >
                      <Heart
                        size={20}
                        fill={
                          isFavorited
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                  </div>
                </>
              )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mt-20 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">

        {/* Reviews */}
        <div>

          <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold">
            <MessageSquare size={28} />
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-14 text-center text-slate-500 dark:border-slate-700">
              No reviews yet.
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-4 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <img
                        src={
                          rev.user?.profileImageUrl ||
                          "https://via.placeholder.com/100"
                        }
                        alt="user"
                        className="h-11 w-11 rounded-full object-cover"
                      />

                      <div>
                        <h4 className="font-semibold">
                          {rev.user
                            ? `${rev.user.firstName} ${rev.user.lastName}`
                            : "Verified Buyer"}
                        </h4>

                        <p className="text-xs text-slate-500">
                          {new Date(
                            rev.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>

                    </div>

                    <StarRating
                      rating={rev.rating}
                      size={16}
                    />
                  </div>

                  <p className="leading-7 text-slate-600 dark:text-slate-300">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Review Form */}
<div className="lg:sticky lg:top-24 h-fit">
  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">

    <h3 className="mb-6 text-2xl font-bold">
      Write a Review
    </h3>

    {user && user.role === "USER" ? (
      <>
        {reviewError && (
          <div className="mb-4 flex items-center gap-2 text-red-500">
            <AlertCircle size={18} />
            {reviewError}
          </div>
        )}

        <form
          onSubmit={handleReviewSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Rating
            </label>

            <StarRating
              rating={rating}
              size={26}
              interactive
              onRatingChange={setRating}
            />
          </div>

          <textarea
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others what you liked..."
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-transparent
              p-4
              focus:border-blue-500
              focus:outline-none
              dark:border-slate-700
            "
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="
              w-full
              rounded-xl
              bg-blue-600
              py-3
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {submittingReview
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </form>
      </>
    ) : (
      <div className="text-center">
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          Login as a customer to share your experience
          with this handcrafted product.
        </p>

        <Link
          to="/login"
          className="
            inline-flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Login to Review
        </Link>
      </div>
    )}
  </div>
</div>
      </section>
    </div>
  </div>
);

};
export default ProductDetails;