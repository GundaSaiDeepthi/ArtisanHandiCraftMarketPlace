import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await forgotPassword(email);

      setMessage(
        "If an account exists, password reset instructions have been sent."
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        <h2 style={{ textAlign: "center" }}>
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="form-input"
            style={{
              width: "100%",
              marginBottom: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: "100%",
            }}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p
            style={{
              color: "green",
              marginTop: "15px",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;