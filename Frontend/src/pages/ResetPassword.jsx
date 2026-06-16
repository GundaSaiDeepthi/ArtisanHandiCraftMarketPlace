import React, { useState } from "react";
import {
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";

const ResetPassword = () => {
  const { resetPassword } = useAuth();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        newPassword,
      });

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(
        err.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-white
        via-slate-50
        to-white
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
        flex
        items-center
        justify-center
        px-4
        py-12
      "
    >
      <div className="w-full max-w-md">
        <div
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-xl
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="
                mx-auto
                mb-5
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-600
                shadow-lg
              "
            >
              <LockKeyhole
                size={24}
                className="text-white"
              />
            </div>

            <h1 className="text-3xl font-bold">
              Reset Password
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Enter your new password below.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                New Password
              </label>

              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  focus:border-blue-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-800
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                "
              >
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  px-4
                  py-3
                  focus:border-blue-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500/20
                  dark:border-slate-700
                  dark:bg-slate-800
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-blue-600
                px-4
                py-3
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-200
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Updating Password..."
                : "Reset Password"}
            </button>
          </form>

          {/* Footer */}
          <div
            className="
              mt-6
              border-t
              border-slate-200
              pt-6
              dark:border-slate-800
            "
          >
            <Link
              to="/login"
              className="
                flex
                items-center
                justify-center
                gap-2
                text-sm
                font-medium
                text-blue-600
                transition
                hover:text-blue-700
              "
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;