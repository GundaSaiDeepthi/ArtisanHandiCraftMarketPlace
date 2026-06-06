import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketContext";

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

  if (loading) {
    return <h2>Loading Orders...</h2>;
  }

  return (
    <div className="container">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="glass-card"
            style={{
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h3>Order #{order._id}</h3>

            <p>
              Status:
              <strong>
                {" "}
                {order.orderStatus}
              </strong>
            </p>

            <p>
              Total:
              ₹{order.totalAmount}
            </p>

            <p>
              Date:
              {new Date(
                order.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;