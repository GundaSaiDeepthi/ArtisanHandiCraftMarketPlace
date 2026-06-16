import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      await forgotPassword(email);

      setMessage(
        "If an account exists, password reset instructions have been sent to your email."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to send reset instructions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl backdrop-blur-xl transition-all dark:border-slate-800 dark:bg-slate-900/80">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
            <KeyRound size={14} />
            Password Recovery
          </div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Forgot Password
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Enter your email address and we'll send you
            reset instructions.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 dark:border-green-900 dark:bg-green-500/10 dark:text-green-400">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-950
                  py-3
                  pl-10
                  pr-4
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  focus:border-violet-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-500/20
                  transition
                "
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-violet-600
              px-4
              py-3
              font-semibold
              text-white
              transition
              hover:bg-violet-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <KeyRound size={18} />

            {loading
              ? "Sending Reset Link..."
              : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;