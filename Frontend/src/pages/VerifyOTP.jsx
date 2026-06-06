
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

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      alert(
        err?.message ||
        err?.response?.data?.message ||
        "Failed to resend OTP"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "30px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Verify Email
        </h2>

        <p
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          OTP sent to:
          <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            maxLength={6}
            onChange={(e) =>
              setOtp(
                e.target.value.replace(/\D/g, "")
              )
            }
            className="form-input"
            required
            style={{
              width: "100%",
              marginBottom: "15px",
            }}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
            }}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={timer > 0}
          className="btn btn-secondary"
          style={{
            width: "100%",
            marginTop: "15px",
            opacity: timer > 0 ? 0.6 : 1,
            cursor:
              timer > 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : "Resend OTP"}
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "green",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;

