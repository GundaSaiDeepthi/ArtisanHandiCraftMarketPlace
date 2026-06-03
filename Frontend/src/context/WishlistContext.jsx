import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const addToWishlist = async (productId) => {
    try {
      const res = await api.post(
        `/user-api/wishlist/${productId}`
      );

      if (res.data.success) {
        await fetchWishlist();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to add to wishlist.";

      throw new Error(errMsg);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(
        `/user-api/wishlist/${productId}`
      );

      if (res.data.success) {
        setWishlistItems((prevItems) =>
          prevItems.filter(
            (item) => item._id !== productId
          )
        );
      }
    } catch (err) {
      console.error(
        "Failed to remove from wishlist:",
        err
      );
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item._id === productId
    );
  };

  const value = {
    wishlistItems,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used within WishlistProvider"
    );
  }

  return context;
};

export default WishlistContext;