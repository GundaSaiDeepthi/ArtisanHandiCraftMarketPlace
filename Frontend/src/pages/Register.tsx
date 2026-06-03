import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Key, User, Phone, Briefcase, FileText, Camera, AlertCircle } from "lucide-react";

export const Register: React.FC = () => {
  const { registerUser, registerArtisan, error, clearError } = useAuth();
  const [role, setRole] = useState<"USER" | "ARTISAN">("USER");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Artisan specific states
  const [artisanBio, setArtisanBio] = useState("");
  const [artisanSpecialization, setArtisanSpecialization] = useState("");
  const [artisanExperience, setArtisanExperience] = useState("");

  // Profile image
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !password) {
      setLocalError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      setLocalError(null);
      clearError();

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      
      if (profileImage) {
        formData.append("profileImageUrl", profileImage);
      }

      if (role === "USER") {
        await registerUser(formData);
      } else {
        formData.append("artisanBio", artisanBio);
        formData.append("artisanSpecialization", artisanSpecialization);
        formData.append("artisanExperience", artisanExperience || "0");
        await registerArtisan(formData);
      }

      // Successful registration -> go verify email OTP!
      navigate(`/verify-otp?email=${encodeURIComponent(email.toLowerCase().trim())}`);
    } catch (err: any) {
      setLocalError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "85vh",
      padding: "3rem 0"
    }}>
      <div className="glass-card anim-slide-up" style={{
        maxWidth: "600px",
        width: "100%",
        padding: "2.5rem",
        borderRadius: "var(--radius-2xl)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontFamily: "var(--font-display)", fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem" }}>Join ArtisanMarket to explore or list handmade crafts</p>
        </div>

        {/* Role Selection Tabs */}
        <div style={{
          display: "flex",
          backgroundColor: "var(--muted)",
          padding: "0.25rem",
          borderRadius: "var(--radius-lg)",
          marginBottom: "1.75rem"
        }}>
          <button
            type="button"
            onClick={() => { setRole("USER"); setLocalError(null); }}
            style={{
              flexGrow: 1,
              padding: "0.5rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all var(--transition-fast)",
              backgroundColor: role === "USER" ? "var(--card)" : "transparent",
              color: role === "USER" ? "var(--foreground)" : "var(--muted-foreground)"
            }}
          >
            Customer Account
          </button>
          <button
            type="button"
            onClick={() => { setRole("ARTISAN"); setLocalError(null); }}
            style={{
              flexGrow: 1,
              padding: "0.5rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all var(--transition-fast)",
              backgroundColor: role === "ARTISAN" ? "var(--card)" : "transparent",
              color: role === "ARTISAN" ? "var(--foreground)" : "var(--muted-foreground)"
            }}
          >
            Artisan Account
          </button>
        </div>

        {(localError || error) && (
          <div className="badge badge-danger" style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-lg)",
            fontSize: "0.85rem",
            marginBottom: "1.5rem",
            whiteSpace: "normal",
            lineHeight: 1.4
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{localError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Profile Picture Upload Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{ position: "relative", width: "90px", height: "90px" }}>
              <img
                src={imagePreview || "https://res.cloudinary.com/demo/image/upload/default-avatar.png"}
                alt="Profile Preview"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
              />
              <label style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "var(--primary)",
                color: "white",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "var(--shadow-md)"
              }}>
                <Camera size={14} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Upload profile picture (optional)</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="grid-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">First Name *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "2.25rem" }}
                  required
                />
                <User size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Last Name</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "2.25rem" }}
                />
                <User size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
              </div>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address *</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.25rem" }}
                required
              />
              <Mail size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number (10 digits)</label>
            <div style={{ position: "relative" }}>
              <input
                type="tel"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.25rem" }}
              />
              <Phone size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password *</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="At least 8 characters (1 uppercase, 1 special)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.25rem" }}
                required
              />
              <Key size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
            </div>
          </div>

          {/* Artisan Fields */}
          {role === "ARTISAN" && (
            <div className="anim-slide-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", borderTop: "1px solid var(--border)", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Artisan Profile Details</h3>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Specialization / Craft Type *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="e.g. Wood Carver, Pottery Specialist, Bead Weaver"
                    value={artisanSpecialization}
                    onChange={(e) => setArtisanSpecialization(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: "2.25rem" }}
                    required
                  />
                  <Briefcase size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Years of Experience *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    value={artisanExperience}
                    onChange={(e) => setArtisanExperience(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: "2.25rem" }}
                    min="0"
                    required
                  />
                  <Briefcase size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Biography / Your Artisan Story *</label>
                <div style={{ position: "relative" }}>
                  <textarea
                    placeholder="Tell customers about yourself, your workshop, and your creative values..."
                    value={artisanBio}
                    onChange={(e) => setArtisanBio(e.target.value)}
                    className="form-input form-textarea"
                    rows={3}
                    style={{ paddingLeft: "2.25rem" }}
                    required
                  ></textarea>
                  <FileText size={14} style={{ position: "absolute", left: "0.75rem", top: "12px", color: "var(--muted-foreground)" }} />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.75rem", gap: "0.5rem", marginTop: "1rem" }}
          >
            <UserPlus size={18} /> {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem" }}>
          <span style={{ color: "var(--muted-foreground)" }}>Already have an account? </span>
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;
