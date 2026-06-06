import { useEffect, useState } from "react";
import axios from "axios";

const ArtisanOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://artisanhandicraftmarketplace.onrender.com/artisan-api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.payload);
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

  if (loading) {
    return (
      <div className="container py-5">
        <h3>Loading Orders...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found.
        </div>
      ) : (
        <div className="table-responsive">

          <table className="table table-bordered table-hover align-middle">

            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr key={order._id}>

                  <td>
                    {order._id.slice(-6)}
                  </td>

                  <td>
                    {order.user?.firstName}{" "}
                    {order.user?.lastName}
                  </td>

                  <td>

                    {order.products?.map(
                      (item, index) => (
                        <div key={index}>
                          <strong>
                            {item.product?.title}
                          </strong>
                          {" "}
                          (Qty:
                          {" "}
                          {item.quantity})
                        </div>
                      )
                    )}

                  </td>

                  <td>
                    ₹{order.totalAmount}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        order.paymentStatus ===
                        "PAID"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`badge ${
                        order.orderStatus ===
                        "DELIVERED"
                          ? "bg-success"
                          : order.orderStatus ===
                            "SHIPPED"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                  </td>

                  <td>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
};

export default ArtisanOrders;