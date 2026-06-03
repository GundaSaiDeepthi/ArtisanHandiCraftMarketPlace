import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ARTISAN" | "ADMIN";
  profileImageUrl: string;
  isActive: boolean;
  isEmailVerified: boolean;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  artisanBio?: string;
  artisanSpecialization?: string;
  artisanExperience?: number;
  isArtisanApproved?: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<User>;
  registerUser: (formData: FormData) => Promise<any>;
  registerArtisan: (formData: FormData) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  resendOTP: (email: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (formData: FormData | object) => Promise<User>;
  changePassword: (passwords: any) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (payload: any) => Promise<any>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await api.get("/common-api/check-auth");
      if (res.data.success && res.data.payload) {
        setUser(res.data.payload);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      setError(null);
      const res = await api.post("/common-api/login", credentials);
      const userData = res.data.payload;
      const token = res.data.token;
      
      localStorage.setItem("token", token);
      setUser(userData);
      return userData;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Login failed. Please check credentials.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const registerUser = async (formData: FormData) => {
    try {
      setError(null);
      const res = await api.post("/user-api/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const registerArtisan = async (formData: FormData) => {
    try {
      setError(null);
      const res = await api.post("/artisan-api/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || "Artisan registration failed.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setError(null);
      const res = await api.post("/user-api/verify-email", { email, otp });
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "OTP verification failed.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      setError(null);
      const res = await api.post("/user-api/resend-otp", { email });
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to resend OTP.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    try {
      await api.get("/common-api/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const updateProfile = async (formData: FormData | object) => {
    try {
      setError(null);
      const isMultipart = formData instanceof FormData;
      const res = await api.put("/user-api/profile", formData, {
        headers: isMultipart ? { "Content-Type": "multipart/form-data" } : undefined,
      });
      const updatedUser = res.data.payload;
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to update profile.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const changePassword = async (passwords: any) => {
    try {
      setError(null);
      const res = await api.put("/common-api/change-password", passwords);
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to change password.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      const res = await api.post("/common-api/forgot-password", { email });
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Request failed.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const resetPassword = async (payload: any) => {
    try {
      setError(null);
      const res = await api.put("/common-api/reset-password", payload);
      return res.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to reset password.";
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        registerUser,
        registerArtisan,
        verifyOTP,
        resendOTP,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
