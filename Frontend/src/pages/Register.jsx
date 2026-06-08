import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  UserPlus,
  User,
  Briefcase,
  Mail,
  Phone,
  Key,
  Camera,
  AlertCircle,
  FileText,
} from "lucide-react";

const Register = () => {
  const {
    registerUser,
    registerArtisan,
    error,
    clearError,
  } = useAuth();

  const navigate = useNavigate();

  const [role, setRole] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [artisanBio, setArtisanBio] =
    useState("");

  const [
    artisanSpecialization,
    setArtisanSpecialization,
  ] = useState("");

  const [
    artisanExperience,
    setArtisanExperience,
  ] = useState("");

  const [profileImage, setProfileImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [localError, setLocalError] =
    useState("");

 useEffect(() => {
  clearError();

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
    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      return setLocalError(
        "Please select an account type."
      );
    }

    if (!firstName.trim()) {
      return setLocalError(
        "First name is required."
      );
    }

    if (!email.trim()) {
      return setLocalError(
        "Email is required."
      );
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

      formData.append(
        "firstName",
        firstName.trim()
      );

      formData.append(
        "lastName",
        lastName.trim()
      );

      formData.append(
        "email",
        email.toLowerCase().trim()
      );

      formData.append(
        "password",
        password
      );

      formData.append(
        "phoneNumber",
        phoneNumber
      );

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
        err.message ||
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
        padding: "2rem 0",
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: "700px",
          width: "100%",
          padding: "2.5rem",
          borderRadius:
            "var(--radius-2xl)",
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
              fontSize: "1.8rem",
              fontWeight: 800,
            }}
          >
            Create Account
          </h2>

          <p
            style={{
              color:
                "var(--muted-foreground)",
            }}
          >
            Join Artisan Marketplace
            today
          </p>
        </div>

        {(localError || error) && (
          <div
            className="badge badge-danger"
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1rem",
              width: "100%",
            }}
          >
            <AlertCircle size={16} />
            <span>
              {localError || error}
            </span>
          </div>
        )}

        {/* Account Type */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
              onClick={() => {
    setRole("USER");

    setArtisanBio("");
    setArtisanExperience("");
    setArtisanSpecialization("");
  }}
            style={{
  cursor: "pointer",
  padding: "1rem",

  border:
    role === "USER"
      ? "2px solid var(--primary)"
      : "1px solid var(--border)",

  background:
    role === "USER"
      ? "rgba(59,130,246,0.08)"
      : "transparent",
        boxShadow:
    role === "USER"
      ? "0 4px 15px rgba(0,0,0,0.08)"
      : "none",

  borderRadius: "16px",

  textAlign: "center",

  transition:
    "all 0.3s ease",
}}
          >
            <User size={40} />

            <h5>Customer</h5>

            <p>
              Buy Handmade Products
            </p>
          </div>

          <div
            onClick={() =>
              setRole("ARTISAN")
            }
           style={{
  cursor: "pointer",

  padding: "1rem",

  border:
    role === "ARTISAN"
      ? "2px solid var(--primary)"
      : "1px solid var(--border)",

  background:
    role === "ARTISAN"
      ? "rgba(59,130,246,0.08)"
      : "transparent",

       boxShadow:
    role === "ARTISAN"
      ? "0 4px 15px rgba(0,0,0,0.08)"
      : "none",

  borderRadius: "16px",

  textAlign: "center",

  transition:
    "all 0.3s ease",
}}
          >
            <Briefcase size={40} />

            <h5>Artisan</h5>

            <p>
              Sell Handmade Products
            </p>
          </div>
        </div>
{/* Profile Image */}

<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  }}
>
  <div
    style={{
      width: "140px",
      height: "140px",
      position: "relative",
    }}
  >
    <img
      src={
        imagePreview ||
        "/default-avatar.jpg"
      }
      alt="Profile"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        objectFit: "cover",
        border:
          "4px solid var(--primary)",
      }}
    />

    <label
      style={{
        position: "absolute",
        right: 5,
        bottom: 5,
        background:
          "var(--primary)",
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Camera
        size={16}
        color="#fff"
      />

      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handleImageChange}
      />
    </label>
  </div>
</div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
         <div className="form-group">
  <label className="form-label">
    First Name
  </label>

  <div
    style={{
      position: "relative",
    }}
  >
    {/* FirstName*/}
    <input
      type="text"
      value={firstName}
      required
      onChange={(e) =>
        setFirstName(e.target.value)
      }
      className="form-input"
      placeholder="John"
      style={{
        paddingLeft: "2.5rem",
      }}
    />

    <User
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
{/* Last Name */}
         <div className="form-group">
  <label className="form-label">
    Last Name
  </label>

  <div style={{ position: "relative" }}>
    <input
      type="text"
      value={lastName}
      onChange={(e) =>
        setLastName(e.target.value)
      }
      className="form-input"
      placeholder="Doe"
      style={{
        paddingLeft: "2.5rem",
      }}
    />

    <User
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
{/* Email*/}
         <div className="form-group">
  <label className="form-label">
    Email Address
  </label>

  <div style={{ position: "relative" }}>
    <input
      type="email"
      value={email}
      required
      onChange={(e) =>
        setEmail(e.target.value)
      }
      className="form-input"
      placeholder="you@example.com"
      style={{
        paddingLeft: "2.5rem",
      }}
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
{/* Phone Number */}

        <div className="form-group">
  <label className="form-label">
    Phone Number
  </label>

  <div style={{ position: "relative" }}>
    <input
      type="tel"
      value={phoneNumber}
      required
      onChange={(e) =>
        setPhoneNumber(e.target.value)
      }
      className="form-input"
      placeholder="9876543210"
      style={{
        paddingLeft: "2.5rem",
      }}
    />

    <Phone
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
{/* Password */}

         <div className="form-group">
  <label className="form-label">
    Password
  </label>

  <div style={{ position: "relative" }}>
    <input
      type="password"
      value={password}
      required
      onChange={(e) =>
        setPassword(e.target.value)
      }
      className="form-input"
      placeholder="Minimum 8 characters(1 uppercase, 1 lowercase, 1 number, 1 special character)"
      style={{
        paddingLeft: "2.5rem",
      }}
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


        {role === "ARTISAN" && (
  <>
    {/* Specialization */}

    <div className="form-group">
      <label className="form-label">
        Specialization
      </label>

      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type="text"
          value={artisanSpecialization}
          required
          onChange={(e) =>
            setArtisanSpecialization(
              e.target.value
            )
          }
          className="form-input"
          placeholder="Wood Carving"
          style={{
            paddingLeft: "2.5rem",
          }}
        />

        <Briefcase
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

    {/* Experience */}

    <div className="form-group">
      <label className="form-label">
        Experience (Years)
      </label>

      <div
        style={{
          position: "relative",
        }}
      >
        <input
          type="number"
          value={artisanExperience}
          required
          onChange={(e) =>
            setArtisanExperience(
              e.target.value
            )
          }
          className="form-input"
          placeholder="5"
          style={{
            paddingLeft: "2.5rem",
          }}
        />

        <FileText
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

    {/* Bio */}

    <div className="form-group">
      <label className="form-label">
        Artisan Bio
      </label>

      <div
        style={{
          position: "relative",
        }}
      >
        <textarea
          rows="4"
          value={artisanBio}
          required
          onChange={(e) =>
            setArtisanBio(
              e.target.value
            )
          }
          className="form-input"
          placeholder="Tell customers about your skills, products and experience..."
          style={{
            paddingLeft: "2.5rem",
            resize: "vertical",
          }}
        />

        <FileText
          size={16}
          style={{
            position: "absolute",
            left: "0.85rem",
            top: "18px",
            color:
              "var(--muted-foreground)",
          }}
        />
      </div>
    </div>
  </>
)}

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
  <UserPlus size={18} />

  {loading
    ? "Creating Account..."
    : role === "ARTISAN"
    ? "Register as Artisan"
    : "Register as Customer"}
</button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
          }}
        >
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;