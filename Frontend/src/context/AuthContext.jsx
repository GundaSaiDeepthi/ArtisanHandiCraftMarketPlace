import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const clearError = () =>
    setError(null);

  /*
  ==================================
  CHECK AUTH
  ==================================
  */

  const checkAuth = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/common-api/check-auth"
      );

      if (
        res.data.success &&
        res.data.payload
      ) {
        setUser(
          res.data.payload
        );
      } else {
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem(
        "token"
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /*
  ==================================
  LOAD AUTH ON APP START
  ==================================
  */

  useEffect(() => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    checkAuth();
  }, []);

  /*
  ==================================
  LOGIN
  ==================================
  */

  const login = async (
    credentials
  ) => {
    try {
      setError(null);

      const res =
        await api.post(
          "/common-api/login",
          credentials
        );

      const token =
        res.data.token;

      const userData =
        res.data.payload;

      if (token) {
        localStorage.setItem(
          "token",
          token
        );

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      setUser(userData);

      return userData;
    } catch (err) {
      const errMsg =
        err.response?.data
          ?.message ||
        "Login failed. Please check credentials.";

      setError(errMsg);

      throw new Error(
        errMsg
      );
    }
  };

  /*
  ==================================
  REGISTER USER
  ==================================
  */

  const registerUser =
    async (formData) => {
      try {
        setError(null);

        const res =
          await api.post(
            "/user-api/users",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          err.response?.data
            ?.error ||
          "Registration failed.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  REGISTER ARTISAN
  ==================================
  */

  const registerArtisan =
    async (formData) => {
      try {
        setError(null);

        const res =
          await api.post(
            "/artisan-api/users",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          err.response?.data
            ?.error ||
          "Artisan registration failed.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  VERIFY OTP
  ==================================
  */

  const verifyOTP =
    async (
      email,
      otp
    ) => {
      try {
        setError(null);

        const res =
          await api.post(
            "/user-api/verify-email",
            {
              email,
              otp,
            }
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          "OTP verification failed.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  RESEND OTP
  ==================================
  */

  const resendOTP =
    async (email) => {
      try {
        setError(null);

        const res =
          await api.post(
            "/user-api/resend-otp",
            {
              email,
            }
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          "Failed to resend OTP.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  FORGOT PASSWORD
  ==================================
  */

  const forgotPassword =
    async (email) => {
      try {
        setError(null);

        const res =
          await api.post(
            "/common-api/forgot-password",
            {
              email,
            }
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          "Request failed.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  RESET PASSWORD
  ==================================
  */

  const resetPassword =
    async (payload) => {
      try {
        setError(null);

        const res =
          await api.put(
            "/common-api/reset-password",
            payload
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          "Failed to reset password.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  UPDATE PROFILE
  ==================================
  */

  const updateProfile =
    async (formData) => {
      try {
        setError(null);

        const isMultipart =
          formData instanceof
          FormData;

        const res =
          await api.put(
            "/user-api/profile",
            formData,
            {
              headers:
                isMultipart
                  ? {
                      "Content-Type":
                        "multipart/form-data",
                    }
                  : undefined,
            }
          );

        const updatedUser =
          res.data.payload;

        setUser(
          updatedUser
        );

        return updatedUser;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          "Failed to update profile.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  CHANGE PASSWORD
  ==================================
  */

  const changePassword =
    async (
      passwords
    ) => {
      try {
        setError(null);

        const res =
          await api.put(
            "/common-api/change-password",
            passwords
          );

        return res.data;
      } catch (err) {
        const errMsg =
          err.response?.data
            ?.message ||
          "Failed to change password.";

        setError(errMsg);

        throw new Error(
          errMsg
        );
      }
    };

  /*
  ==================================
  LOGOUT
  ==================================
  */

  const logout =
    async () => {
      try {
        await api.get(
          "/common-api/logout"
        );
      } catch (err) {
        console.log(err);
      } finally {
        localStorage.removeItem(
          "token"
        );

        delete api.defaults.headers
          .common[
          "Authorization"
        ];

        setUser(null);
      }
    };

  /*
  ==================================
  CONTEXT VALUE
  ==================================
  */

  const value = {
    user,
    loading,
    error,

    login,
    logout,

    registerUser,
    registerArtisan,

    verifyOTP,
    resendOTP,

    forgotPassword,
    resetPassword,

    updateProfile,
    changePassword,

    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};

export default AuthContext;