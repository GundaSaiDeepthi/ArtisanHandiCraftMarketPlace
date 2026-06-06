import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
        "https://artisanhandicraftmarketplace.onrender.com/artisan-api/dashboard",
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
      <div className="container py-5">
        <h3>Loading Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">
        Artisan Dashboard
      </h2>

      <div className="row g-4">

        <div className="col-md-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Total Products
              </h6>

              <h2 className="fw-bold text-primary">
                {dashboard.totalProducts}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Total Orders
              </h6>

              <h2 className="fw-bold text-success">
                {dashboard.totalOrders}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Total Sales
              </h6>

              <h2 className="fw-bold text-warning">
                {dashboard.totalSales}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow border-0 h-100">
            <div className="card-body text-center">
              <h6 className="text-muted">
                Revenue
              </h6>

              <h2 className="fw-bold text-danger">
                ₹{dashboard.totalRevenue}
              </h2>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-5">
        <h4 className="mb-3">
          Quick Actions
        </h4>

        <div className="d-flex gap-3 flex-wrap">

          <Link
            to="/artisan/add-product"
            className="btn btn-primary"
          >
            Add Product
          </Link>

          <Link
            to="/artisan/products"
            className="btn btn-success"
          >
            My Products
          </Link>

          <Link
            to="/artisan/orders"
            className="btn btn-warning"
          >
            View Orders
          </Link>
<Link
  to="/artisan/sales-report"
  className="btn btn-danger"
>
  Sales Report
</Link>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard;