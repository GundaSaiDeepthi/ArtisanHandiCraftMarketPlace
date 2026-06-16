import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";
import {
  Package,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user-api/orders`,
        {
          withCredentials: true,
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("orderStatusUpdated", (data) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === data.orderId
            ? {
                ...order,
                orderStatus: data.status,
              }
            : order
        )
      );
    });

    return () => {
      socket.off("orderStatusUpdated");
    };
  }, [socket]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return {
          bg: "bg-green-100 dark:bg-green-500/10",
          text: "text-green-700 dark:text-green-400",
          icon: <CheckCircle2 size={14} />,
        };

      case "shipped":
        return {
          bg: "bg-blue-100 dark:bg-blue-500/10",
          text: "text-blue-700 dark:text-blue-400",
          icon: <Truck size={14} />,
        };

      case "processing":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-500/10",
          text: "text-yellow-700 dark:text-yellow-400",
          icon: <Clock3 size={14} />,
        };

      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-500/10",
          text: "text-slate-700 dark:text-slate-400",
          icon: <Package size={14} />,
        };
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <ShoppingBag
            size={40}
            className="mx-auto mb-4 animate-pulse text-violet-500"
          />

          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Loading Orders...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          <ShoppingBag size={14} />
          Purchase History
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          My Orders
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Track and manage all your handcrafted purchases.
        </p>
      </div>

      {/* Empty Orders */}
      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <Package
            size={60}
            className="mx-auto mb-4 text-slate-400"
          />

          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            No Orders Yet
          </h2>

          <p className="text-slate-500 dark:text-slate-400">
            Your purchased products will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => {
            const status = getStatusStyle(
              order.orderStatus
            );

            return (
              <div
                key={order._id}
                className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-white/80
                  p-6
                  shadow-lg
                  backdrop-blur-xl
                  transition-all
                  hover:shadow-xl
                  dark:border-slate-800
                  dark:bg-slate-900/80
                "
              >
                {/* Top */}
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Order #{order._id.slice(-8)}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${status.bg} ${status.text}`}
                  >
                    {status.icon}
                    {order.orderStatus}
                  </div>
                </div>

                {/* Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Total Amount
                    </p>

                    <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-400">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Order Status
                    </p>

                    <p className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;