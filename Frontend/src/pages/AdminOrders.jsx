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
      setError(
        err.response?.data?.message ||
          "Failed to load orders"
      );
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
      alert(
        err.response?.data?.message ||
          "Status update failed"
      );
    }
  };

  return (
    <motion.div
      className="admin-orders-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1>Admin - Order Management</h1>

      {error && <p className="error">{error}</p>}

      <button
        className="icon-button"
        onClick={fetchOrders}
        disabled={loading}
      >
        <FiRefreshCw />
        <span style={{ marginLeft: "8px" }}>
          Refresh
        </span>
      </button>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order._id
                      ? `${order._id.slice(0, 8)}...`
                      : "N/A"}
                  </td>

                  <td>{order.userId || "N/A"}</td>

                  <td>
                    $
                    {Number(
                      order.totalAmount || 0
                    ).toFixed(2)}
                  </td>

                  <td>{order.status}</td>

                  <td>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString()
                      : "N/A"}
                  </td>

                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="PROCESSING">
                        Processing
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

                      <option value="CANCELLED">
                        Cancelled
                      </option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default AdminOrders;