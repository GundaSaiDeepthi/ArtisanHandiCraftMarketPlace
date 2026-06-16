import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  TrendingUp,
} from "lucide-react";

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSalesReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/artisan-api/sales-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSales(response.data.payload || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSalesReport();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = sales.length;

    const totalQuantity = sales.reduce(
      (sum, sale) => sum + (sale.quantity || 0),
      0
    );

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale.total || 0),
      0
    );

    return {
      totalOrders,
      totalQuantity,
      totalRevenue,
    };
  }, [sales]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />
          <p className="text-slate-300">
            Loading Sales Report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
            Sales Report
          </h1>

          <p className="mt-2 text-slate-400">
            Monitor your product sales, revenue, and order history.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Total Sales
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  {stats.totalOrders}
                </h3>
              </div>

              <ShoppingBag className="text-violet-400" size={32} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Products Sold
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  {stats.totalQuantity}
                </h3>
              </div>

              <Package className="text-emerald-400" size={32} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Revenue
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  ₹{stats.totalRevenue.toLocaleString("en-IN")}
                </h3>
              </div>

              <TrendingUp className="text-amber-400" size={32} />
            </div>
          </div>

        </div>

        {/* Empty State */}
        {sales.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-12 text-center backdrop-blur-xl">
            <IndianRupee
              size={56}
              className="mx-auto mb-4 text-slate-500"
            />

            <h3 className="mb-2 text-xl font-semibold text-white">
              No Sales Found
            </h3>

            <p className="text-slate-400">
              Your completed sales will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Quantity
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {sales.map((sale, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-800 transition hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4 font-medium text-white">
                          {sale.productName}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {sale.quantity}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          ₹{sale.price}
                        </td>

                        <td className="px-6 py-4 font-semibold text-emerald-400">
                          ₹{sale.total}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {new Date(
                            sale.orderDate
                          ).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 lg:hidden">
              {sales.map((sale, index) => (
                <div
                  key={index}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <h3 className="font-semibold text-white">
                    {sale.productName}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">
                        Quantity
                      </p>
                      <p className="font-medium text-white">
                        {sale.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Price
                      </p>
                      <p className="font-medium text-white">
                        ₹{sale.price}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Total
                      </p>
                      <p className="font-semibold text-emerald-400">
                        ₹{sale.total}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">
                        Date
                      </p>
                      <p className="font-medium text-white">
                        {new Date(
                          sale.orderDate
                        ).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SalesReport;