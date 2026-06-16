
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogIn,
  Key,
  Mail,
  AlertCircle,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition";

const iconClass =
  "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

const Login = () => {
  const { login, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email || !password) {
      setLocalError(
        "Please enter email and password."
      );
      return;
    }

    try {
      setLoading(true);
      setLocalError("");
      clearError();

      const userData = await login({
        email,
        password,
      });

      if (userData?.role === "ADMIN") {
        navigate("/admin");
      } else if (
        userData?.role === "ARTISAN"
      ) {
        navigate("/artisan/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message =
        err.message || "Login failed";

      setLocalError(message);

      if (
        message
          .toLowerCase()
          .includes("verify your email")
      ) {
        navigate(
          `/verify-otp?email=${encodeURIComponent(
            email
          )}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white dark:bg-slate-950 transition-colors duration-300">

      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-300 mb-4">
            <LogIn size={14} />
            Welcome Back
          </div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Sign In
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Access your artisan marketplace account
          </p>

        </div>

        {/* Error */}
        {(localError || error) && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={16}
                className={iconClass}
              />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <Key
                size={16}
                className={iconClass}
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            <LogIn size={18} />

            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center">

          <span className="text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
          </span>

          <Link
            to="/register"
            className="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Create Account
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Login;

