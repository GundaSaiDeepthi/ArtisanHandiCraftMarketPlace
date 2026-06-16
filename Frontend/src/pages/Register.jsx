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
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition";

const iconClass =
  "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

const Register = () => {
  const { registerUser, registerArtisan, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [artisanBio, setArtisanBio] = useState("");
  const [artisanSpecialization, setArtisanSpecialization] = useState("");
  const [artisanExperience, setArtisanExperience] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    clearError();

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError("");

    if (!role) return setLocalError("Please select account type");
    if (!firstName) return setLocalError("First name is required");
    if (!email) return setLocalError("Email is required");
    if (!password) return setLocalError("Password is required");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);

      if (profileImage) {
        formData.append("profileImageUrl", profileImage);
      }

      if (role === "ARTISAN") {
        formData.append("artisanBio", artisanBio);
        formData.append(
          "artisanSpecialization",
          artisanSpecialization
        );
        formData.append(
          "artisanExperience",
          artisanExperience
        );

        await registerArtisan(formData);
      } else {
        await registerUser(formData);
      }

      navigate(`/verify-otp?email=${email}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">

      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 dark:bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-300 mb-4">
            <UserPlus size={14} />
            Join Artisan Marketplace
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Create Account
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Connect with artisans and discover handcrafted treasures
          </p>
        </div>

        {(localError || error) && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-red-600 dark:text-red-400">
            <AlertCircle size={16} />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4 mb-8">

          <button
            type="button"
            onClick={() => setRole("USER")}
            className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
              role === "USER"
                ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg"
                : "border-slate-200 dark:border-slate-700 hover:border-violet-400"
            }`}
          >
            <User
              size={40}
              className={`mx-auto ${
                role === "USER"
                  ? "text-violet-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            />

            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
              Customer
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole("ARTISAN")}
            className={`rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
              role === "ARTISAN"
                ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-lg"
                : "border-slate-200 dark:border-slate-700 hover:border-violet-400"
            }`}
          >
            <Briefcase
              size={40}
              className={`mx-auto ${
                role === "ARTISAN"
                  ? "text-violet-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            />

            <p className="mt-3 font-semibold text-slate-900 dark:text-white">
              Artisan
            </p>
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center mb-8">
          <div className="relative group">

            <img
              src={imagePreview || "/default-avatar.jpg"}
              alt="Profile"
              className="h-36 w-36 rounded-full border-4 border-violet-500 object-cover shadow-xl transition-transform duration-300 group-hover:scale-105"
            />

            <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-700 transition">
              <Camera size={16} />

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setProfileImage(file);
                    setImagePreview(
                      URL.createObjectURL(file)
                    );
                  }
                }}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">
              <User className={iconClass} size={16} />
              <input
                className={inputClass}
                placeholder="First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
              />
            </div>

            <div className="relative">
              <User className={iconClass} size={16} />
              <input
                className={inputClass}
                placeholder="Last Name"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
              />
            </div>
          </div>

          <div className="relative">
            <Mail className={iconClass} size={16} />
            <input
              className={inputClass}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <Phone className={iconClass} size={16} />
            <input
              className={inputClass}
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value)
              }
            />
          </div>

          <div className="relative">
            <Key className={iconClass} size={16} />
            <input
              type="password"
              className={inputClass}
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          {role === "ARTISAN" && (
            <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-5">

              <input
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white"
                placeholder="Specialization"
                value={artisanSpecialization}
                onChange={(e) =>
                  setArtisanSpecialization(
                    e.target.value
                  )
                }
              />

              <input
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white"
                placeholder="Years of Experience"
                value={artisanExperience}
                onChange={(e) =>
                  setArtisanExperience(
                    e.target.value
                  )
                }
              />

              <textarea
                rows="4"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-white"
                placeholder="Tell customers about your craft..."
                value={artisanBio}
                onChange={(e) =>
                  setArtisanBio(e.target.value)
                }
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-violet-500/25 disabled:opacity-50"
          >
            <UserPlus size={18} />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

        <p className="text-center text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;