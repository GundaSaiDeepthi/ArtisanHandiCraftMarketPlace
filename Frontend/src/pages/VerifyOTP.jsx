import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const { verifyOTP, resendOTP } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await verifyOTP(email, otp);

      alert("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      alert(
        err?.message ||
          err?.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);

      setMessage("OTP sent again to your email");
      setTimer(60);

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* Glass Card */}
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">

        {/* Header */}
        <h2 className="mb-4 text-center text-3xl font-bold text-white">
          Verify Email
        </h2>

        <p className="mb-6 text-center text-sm text-slate-400">
          OTP sent to:
          <br />
          <span className="font-semibold text-white">
            {email}
          </span>
        </p>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-center text-white tracking-widest placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-violet-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={timer > 0}
          className={`mt-4 w-full rounded-xl px-4 py-3 font-medium transition ${
            timer > 0
              ? "cursor-not-allowed bg-slate-800 text-slate-500 opacity-60"
              : "bg-slate-700 text-white hover:bg-slate-600"
          }`}
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : "Resend OTP"}
        </button>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-emerald-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;