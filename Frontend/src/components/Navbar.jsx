
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Search,
  Grid,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { cartItems = [] } = useCart();
  const { wishlistItems = [] } = useWishlist();

  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(
      `/shop?search=${encodeURIComponent(searchQuery.trim())}`
    );

    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200 dark:border-slate-800/40 bg-white/95 dark:bg-[#070b13]/90 backdrop-blur-md transition-colors duration-300">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent">
              ArtisanMarket
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden w-full max-w-md md:block"
          >
            <input
              type="text"
              placeholder="Search unique handicrafts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a]/40 px-5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
            />

            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">

            <Link
              to="/shop"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white transition-colors"
            >
              <Grid size={18} />
              Shop
            </Link>

            {user?.role === "USER" && (
              <>
                <Link
                  to="/wishlist"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                >
                  <Heart size={20} />

                  {wishlistItems.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative text-slate-700 dark:text-slate-300 hover:text-white transition-colors"
                >
                  <ShoppingBag size={20} />

                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user?.role === "ARTISAN" && (
              <Link
                to="/artisan/dashboard"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white transition-colors"
              >
                Dashboard
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                to="/admin/orders"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-white transition-colors"
              >
                Admin Orders
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0f172a] hover:text-slate-900 dark:hover:text-white transition-all"
            >
              {theme === "dark" ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">

                <Link
                  to={
                    user.role === "ARTISAN"
                      ? "/artisan/dashboard"
                      : user.role === "ADMIN"
                      ? "/admin/orders"
                      : "/"
                  }
                  className="flex items-center gap-2"
                >
                  <img
                    src={
                      user.profileImageUrl ||
                      "/default-avatar.png"
                    }
                    alt="profile"
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-violet-500"
                  />

                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {user.firstName}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  <LogOut size={18} />
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-6">

                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-all shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                >
                  Register
                </Link>

              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-3 md:hidden">

            <button
              onClick={toggleTheme}
              className="text-slate-700 dark:text-slate-300"
            >
              {theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800/40 bg-white dark:bg-[#070b13] md:hidden">
            <div className="space-y-4 px-4 py-5">

              <form
                onSubmit={handleSearchSubmit}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search unique handicrafts..."
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full rounded-full border border-slate-300 dark:border-slate-800/80 bg-white dark:bg-[#0f172a]/40 px-5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                />
              </form>

              <Link
                to="/shop"
                className="block text-slate-700 dark:text-slate-300 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>

              {user ? (
                <>
                  <Link
                    to={
                      user.role === "ARTISAN"
                        ? "/artisan/dashboard"
                        : user.role === "ADMIN"
                        ? "/admin/orders"
                        : "/"
                    }
                    className="block text-slate-700 dark:text-slate-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user.role === "ARTISAN" ||
                    user.role === "ADMIN"
                      ? "Dashboard"
                      : "Home"}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 block text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">

                  <Link
                    to="/login"
                    className="rounded-xl border border-slate-300 dark:border-slate-800 px-4 py-2 text-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0f172a] hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Log In
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl bg-violet-600 px-4 py-2 text-center text-white hover:bg-violet-700 shadow-[0_0_15px_rgba(124,58,237,0.35)]"
                  >
                    Register
                  </Link>

                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
};

export default Navbar;

