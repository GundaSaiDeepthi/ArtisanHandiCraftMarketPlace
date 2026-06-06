import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Key, Mail, AlertCircle } from "lucide-react";

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
      setLocalError("Please enter email and password.");
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
      } else if (userData?.role === "ARTISAN") {
        navigate("/artisan");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "75vh",
        padding: "2rem 0",
      }}
    >
      <div
        className="glass-card anim-slide-up"
        style={{
          maxWidth: "450px",
          width: "100%",
          padding: "2.5rem",
          borderRadius: "var(--radius-2xl)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontFamily: "var(--font-display)",
              fontWeight: 800,
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "var(--muted-foreground)",
              fontSize: "0.9rem",
            }}
          >
            Log in to access your artisan marketplace
          </p>
        </div>

        {(localError || error) && (
          <div
            className="badge badge-danger"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
              lineHeight: 1.4,
            }}
          >
            <AlertCircle
              size={16}
              style={{ flexShrink: 0 }}
            />
            <span>
              {localError || error}
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">
              Email Address
            </label>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="form-input"
                style={{
                  paddingLeft: "2.5rem",
                }}
                required
              />

              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color:
                    "var(--muted-foreground)",
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "0.375rem",
              }}
            >
              <label className="form-label">
                Password
              </label>

              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div
              style={{
                position: "relative",
              }}
            >
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="form-input"
                style={{
                  paddingLeft: "2.5rem",
                }}
                required
              />

              <Key
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  color:
                    "var(--muted-foreground)",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.75rem",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <LogIn size={18} />

            {loading
              ? "Logging In..."
              : "Log In"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            fontSize: "0.9rem",
          }}
        >
          <span
            style={{
              color:
                "var(--muted-foreground)",
            }}
          >
            Don't have an account?{" "}
          </span>

          <Link
            to="/register"
            style={{
              color: "var(--primary)",
              fontWeight: 600,
            }}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;