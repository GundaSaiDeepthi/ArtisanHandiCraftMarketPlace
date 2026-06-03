import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    artisan?: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImageUrl: string;
    };
  };
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  totalAmount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const res = await api.post("/user-api/cart", { productId, quantity });
      if (res.data.success) {
        await fetchCart();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to add item to cart.";
      throw new Error(errMsg);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await api.delete(`/user-api/cart/${productId}`);
      if (res.data.success && res.data.payload) {
        setCartItems(res.data.payload.products || []);
      } else {
        await fetchCart();
      }
    } catch (err: any) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const res = await api.put(`/user-api/cart/${productId}`, { quantity });
      if (res.data.success && res.data.payload) {
        setCartItems(res.data.payload.products || []);
      } else {
        await fetchCart();
      }
    } catch (err: any) {
      console.error("Failed to update cart quantity:", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        totalAmount,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
