import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const { resetPassword } = useAuth();

  const [searchParams] = useSearchParams();

  const token =
    searchParams.get("token");

  const navigate = useNavigate();

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      newPassword !== confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        newPassword,
      });

      alert(
        "Password reset successful"
      );

      navigate("/login");
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
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            required
            className="form-input"
            style={{
              width: "100%",
              marginBottom: "15px",
            }}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
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
              ? "Updating..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;