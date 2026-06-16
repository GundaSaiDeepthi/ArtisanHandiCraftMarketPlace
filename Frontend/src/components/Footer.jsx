import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-16 pb-8 text-sm text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-2xl font-extrabold text-transparent">
              ArtisanMarket
            </h2>

            <p className="leading-relaxed text-slate-400">
              A marketplace dedicated to honoring and supporting local artisans
              by bringing their unique handcrafted items directly to your
              doorstep.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Craft Categories
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop?category=Wood%20Craft"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Wood Crafts
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Pottery"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Traditional Pottery
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Jewelry"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Handmade Jewelry
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Textiles"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Artisan Textiles
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=Home%20Decor"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Home Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Shop Collection
                </Link>
              </li>

              <li>
                <Link
                  to="/register?role=artisan"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Join as Artisan
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Account Login
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="transition-colors duration-200 hover:text-white"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Promise */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Our Promise
            </h3>

            <p className="leading-relaxed text-slate-400">
              Every item sold here is verified to be 100% handcrafted by
              genuine artisans. We support fair trade, sustainable wages, and
              help preserve traditional craftsmanship.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-slate-800"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-slate-500 md:flex-row md:text-left">
          <p>
            © {new Date().getFullYear()} ArtisanHandiCraftMarketPlace. All
            rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart
              size={15}
              className="fill-red-500 text-red-500"
            />
            <span>for local creators.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;