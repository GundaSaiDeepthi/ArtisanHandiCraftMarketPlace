import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  IndianRupee,
  Plus,
  BarChart3,
} from "lucide-react";

const ArtisanDashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/artisan-api/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(response.data.payload);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />
          <p className="text-slate-300">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
      gradient:
        "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      icon: ShoppingBag,
      gradient:
        "from-emerald-500/20 to-green-500/20",
      iconColor: "text-emerald-400",
    },
    {
      title: "Total Sales",
      value: dashboard.totalSales,
      icon: TrendingUp,
      gradient:
        "from-amber-500/20 to-yellow-500/20",
      iconColor: "text-amber-400",
    },
    {
      title: "Revenue",
      value: `₹${Number(
        dashboard.totalRevenue || 0
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      gradient:
        "from-rose-500/20 to-red-500/20",
      iconColor: "text-rose-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
            Artisan Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your products, orders, sales,
            and revenue from one place.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br ${stat.gradient} bg-slate-900/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {stat.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                      {stat.value}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-slate-800/70 p-3">
                    <Icon
                      size={28}
                      className={stat.iconColor}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <BarChart3
              size={24}
              className="text-violet-400"
            />

            <h2 className="text-2xl font-bold text-white">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            <Link
              to="/artisan/add-product"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-violet-700 hover:to-fuchsia-700"
            >
              <Plus size={18} />
              Add Product
            </Link>

            <Link
              to="/artisan/products"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-emerald-700 hover:to-green-700"
            >
              <Package size={18} />
              My Products
            </Link>

            <Link
              to="/artisan/orders"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 font-medium text-black transition-all duration-300 hover:scale-105 hover:from-amber-600 hover:to-yellow-600"
            >
              <ShoppingBag size={18} />
              View Orders
            </Link>

            <Link
              to="/artisan/sales-report"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-rose-700 hover:to-red-700"
            >
              <TrendingUp size={18} />
              Sales Report
            </Link>

          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-xl font-semibold text-white">
              Performance Summary
            </h3>

            <div className="space-y-3 text-slate-300">
              <div className="flex justify-between">
                <span>Products Listed</span>
                <span className="font-semibold">
                  {dashboard.totalProducts}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Orders Received</span>
                <span className="font-semibold">
                  {dashboard.totalOrders}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Units Sold</span>
                <span className="font-semibold">
                  {dashboard.totalSales}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-semibold text-green-400">
                  ₹
                  {Number(
                    dashboard.totalRevenue || 0
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-xl font-semibold text-white">
              Growth Insights
            </h3>

            <p className="leading-relaxed text-slate-400">
              Track your product performance,
              monitor sales trends, and grow your
              artisan business by regularly updating
              your catalog and fulfilling orders on
              time.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;