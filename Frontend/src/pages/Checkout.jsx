import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { motion } from "framer-motion";

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Create Razorpay Order
      const createRes = await api.post(
        "/payment-api/create-order",
        {
          products: cartItems.map((item) => ({
            product: item.product?._id,
            quantity: item.quantity,
          })),
          totalAmount,
        }
      );

      const order = createRes.data.payload;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Artisan Marketplace",

        description: "Handicraft Purchase",

        order_id: order.id,

        handler: async function (response) {
          try {
            await api.post(
              "/payment-api/verify-payment",
              {
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                products: cartItems.map((item) => ({
                  product: item.product?._id,
                  quantity: item.quantity,
                })),

                totalAmount,
              }
            );

            clearCart();

            alert("Payment Successful!");

            navigate("/");
          } catch (err) {
            console.error(err);

            alert("Payment Verification Failed");
          }
        },

        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Checkout Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="checkout-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Checkout</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.product?._id}>
                {item.product?.title} × {item.quantity}
                {" = "}₹
                {(
                  (item.product?.price || 0) *
                  item.quantity
                ).toFixed(2)}
              </li>
            ))}
          </ul>

          <h2>
            Total: ₹
            {Number(totalAmount).toFixed(2)}
          </h2>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Pay Now"}
          </button>
        </>
      )}
    </motion.div>
  );
};

export default Checkout;