import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/admin-api/orders");
      setOrders(res.data.payload || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin-api/orders/${orderId}`, {
        status: newStatus,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Title */}
        <h1 className="mb-6 text-3xl font-bold text-white">
          Admin - Order Management
        </h1>

        {/* Error */}
        {error && (
          <p className="mb-4 rounded bg-red-900/30 px-4 py-2 text-red-400">
            {error}
          </p>
        )}

        {/* Refresh Button */}
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="mb-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

        {/* Loading */}
        {loading ? (
          <p className="text-gray-300">Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-800">

            <table className="min-w-full text-left text-sm text-gray-300">

              {/* Table Head */}
              <thead className="bg-gray-900 text-gray-200">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-800">

                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-900/50"
                  >

                    {/* Order ID */}
                    <td className="px-4 py-3">
                      {order._id
                        ? `${order._id.slice(0, 8)}...`
                        : "N/A"}
                    </td>

                    {/* User */}
                    <td className="px-4 py-3">
                      {order.userId || "N/A"}
                    </td>

                    {/* Total */}
                    <td className="px-4 py-3 font-semibold text-white">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-700 px-2 py-1 text-xs">
                        {order.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-white outline-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        ) : (
          <p className="rounded bg-gray-900 px-4 py-3 text-gray-300">
            No orders found.
          </p>
        )}

      </div>
    </motion.div>
  );
};

export default AdminOrders;