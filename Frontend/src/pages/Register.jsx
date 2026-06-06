import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  Mail,
  Key,
  User,
  Phone,
  Briefcase,
  FileText,
  Camera,
  AlertCircle,
} from "lucide-react";

const Register = () => {
  const { registerUser, registerArtisan, error, clearError } = useAuth();

  const [role, setRole] = useState("USER");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [artisanBio, setArtisanBio] = useState("");
  const [artisanSpecialization, setArtisanSpecialization] =
    useState("");
  const [artisanExperience, setArtisanExperience] =
    useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) {
      return setLocalError("First name is required.");
    }

    if (!email.trim()) {
      return setLocalError("Email is required.");
    }

    if (password.length < 8) {
      return setLocalError(
        "Password must be at least 8 characters."
      );
    }

    if (
      phoneNumber &&
      !/^[0-9]{10}$/.test(phoneNumber)
    ) {
      return setLocalError(
        "Phone number must contain exactly 10 digits."
      );
    }

    if (role === "ARTISAN") {
      if (
        !artisanSpecialization.trim() ||
        !artisanBio.trim() ||
        !artisanExperience
      ) {
        return setLocalError(
          "Please fill all artisan details."
        );
      }
    }

    try {
      setLoading(true);
      setLocalError("");
      clearError();

      const formData = new FormData();

      formData.append("firstName", firstName.trim());
      formData.append("lastName", lastName.trim());
      formData.append(
        "email",
        email.toLowerCase().trim()
      );
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);

      if (profileImage) {
        formData.append(
          "profileImageUrl",
          profileImage
        );
      }

      if (role === "USER") {
        await registerUser(formData);
      } else {
        formData.append(
          "artisanBio",
          artisanBio.trim()
        );

        formData.append(
          "artisanSpecialization",
          artisanSpecialization.trim()
        );

        formData.append(
          "artisanExperience",
          artisanExperience
        );

        await registerArtisan(formData);
      }

      navigate(
        `/verify-otp?email=${encodeURIComponent(
          email.toLowerCase().trim()
        )}`
      );
    } catch (err) {
      setLocalError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed."
      );
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
        minHeight: "85vh",
        padding: "3rem 0",
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "600px",
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
              fontWeight: 800,
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color: "var(--muted-foreground)",
            }}
          >
            Join ArtisanMarket today
          </p>
        </div>

        {(localError || error) && (
          <div
            className="badge badge-danger"
            style={{
              display: "flex",
              gap: "0.5rem",
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Profile Image */}

          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                margin: "0 auto",
                position: "relative",
              }}
            >
              <img
                src={
                  imagePreview ||
                  "/default-avatar.png"
                }
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <label
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  cursor: "pointer",
                }}
              >
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) =>
              setPhoneNumber(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {role === "ARTISAN" && (
            <>
              <input
                type="text"
                placeholder="Specialization"
                value={artisanSpecialization}
                onChange={(e) =>
                  setArtisanSpecialization(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Experience"
                value={artisanExperience}
                onChange={(e) =>
                  setArtisanExperience(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Bio"
                value={artisanBio}
                onChange={(e) =>
                  setArtisanBio(
                    e.target.value
                  )
                }
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            <UserPlus size={18} />

            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;