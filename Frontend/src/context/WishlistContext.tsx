import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  artisan?: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  };
  createdAt: string;
}

interface WishlistContextType {
  wishlistItems: Product[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await api.get("/user-api/wishlist");
      if (res.data.success && res.data.payload) {
        setWishlistItems(res.data.payload.products || []);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    try {
      const res = await api.post(`/user-api/wishlist/${productId}`);
      if (res.data.success) {
        await fetchWishlist();
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to add to wishlist.";
      throw new Error(errMsg);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const res = await api.delete(`/user-api/wishlist/${productId}`);
      if (res.data.success) {
        setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
      }
    } catch (err: any) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
