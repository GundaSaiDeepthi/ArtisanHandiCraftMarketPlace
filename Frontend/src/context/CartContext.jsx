import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/user-api/cart");

      if (res.data.success && res.data.payload) {
        setCartItems(res.data.payload.products || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post("/user-api/cart", {
        productId,
        quantity,
      });

      if (res.data.success) {
        await fetchCart();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to add item to cart.";

      throw new Error(errMsg);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(
        `/user-api/cart/${productId}`
      );

      if (res.data.success && res.data.payload) {
        setCartItems(res.data.payload.products || []);
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.error(
        "Failed to remove item from cart:",
        err
      );
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await api.put(
        `/user-api/cart/${productId}`,
        { quantity }
      );

      if (res.data.success && res.data.payload) {
        setCartItems(res.data.payload.products || []);
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.error(
        "Failed to update cart quantity:",
        err
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    loading,
    totalAmount,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
};

export default CartContext;