import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  User,
  IndianRupee,
} from "lucide-react";

const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/artisan-api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.payload || []);
    } catch (error) {
      console.error(
        "Failed to fetch artisan orders",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getPaymentBadge = (status) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";

      default:
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    }
  };

  const getOrderBadge = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";

      case "SHIPPED":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";

      case "PROCESSING":
        return "bg-violet-500/20 text-violet-400 border border-violet-500/30";

      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />
          <p className="text-slate-300">
            Loading Orders...
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
            My Orders
          </h1>

          <p className="mt-2 text-slate-400">
            Track and manage customer orders.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-8 text-center">
            <ShoppingBag
              size={48}
              className="mx-auto mb-4 text-blue-400"
            />

            <h3 className="mb-2 text-xl font-semibold text-white">
              No Orders Yet
            </h3>

            <p className="text-slate-400">
              Orders from customers will appear
              here once they purchase your products.
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
                        Order ID
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Products
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-slate-800 transition hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4 text-slate-300">
                          #{order._id.slice(-6)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {order.user?.firstName}{" "}
                            {order.user?.lastName}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {order.products?.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-slate-300"
                                >
                                  <span className="font-medium text-white">
                                    {
                                      item.product
                                        ?.title
                                    }
                                  </span>
                                  {" × "}
                                  {item.quantity}
                                </div>
                              )
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-semibold text-emerald-400">
                          ₹
                          {Number(
                            order.totalAmount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadge(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getOrderBadge(
                              order.orderStatus
                            )}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-400">
                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-5 lg:hidden">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-white">
                      #{order._id.slice(-6)}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getOrderBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-300">
                      <User size={16} />
                      {order.user?.firstName}{" "}
                      {order.user?.lastName}
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Package size={16} />
                      {order.products?.length} Product(s)
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-emerald-400">
                      <IndianRupee size={16} />
                      {Number(
                        order.totalAmount
                      ).toLocaleString("en-IN")}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentBadge(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>

                      <span className="text-sm text-slate-400">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </span>
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

export default ArtisanOrders;