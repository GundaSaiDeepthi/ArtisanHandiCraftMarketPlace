import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Package,
} from "lucide-react";

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    setLoading(true);
    setError("");

    try {
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
        description: "Handcrafted Products Purchase",
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
          color: "#7c3aed",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Checkout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-5xl px-4 py-10"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          <ShoppingBag size={14} />
          Secure Checkout
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Complete Your Order
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Review your handcrafted treasures before payment.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Empty Cart */}
      {cartItems.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <Package
            size={50}
            className="mx-auto mb-4 text-slate-400"
          />

          <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
            Your Cart is Empty
          </h2>

          <p className="text-slate-500 dark:text-slate-400">
            Add some beautiful handcrafted products first.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Order Summary */}
          <div className="border-b border-slate-200 p-6 dark:border-slate-800">
            <h2 className="mb-5 text-2xl font-bold text-slate-900 dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product?._id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.product?.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    ₹
                    {(
                      (item.product?.price || 0) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <span className="text-xl font-semibold text-slate-900 dark:text-white">
              Total Amount
            </span>

            <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
              ₹{Number(totalAmount).toFixed(2)}
            </span>
          </div>

          {/* Payment Button */}
          <div className="p-6">
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={20} />

              {loading
                ? "Processing Payment..."
                : "Pay Now"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Checkout;