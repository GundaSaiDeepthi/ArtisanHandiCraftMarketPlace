import { useEffect, useState } from "react";
import axios from "axios";

const SalesReport = () => {
  const [sales, setSales] = useState([]);

  const getSalesReport = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "https://artisanhandicraftmarketplace.onrender.com/artisan-api/sales-report",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setSales(
        response.data.payload
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSalesReport();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4">
        Sales Report
      </h2>

      <div className="card shadow">
        <div className="card-body">

          <table className="table table-bordered">

            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {sales.map(
                (sale, index) => (
                  <tr key={index}>
                    <td>
                      {
                        sale.productName
                      }
                    </td>

                    <td>
                      {sale.quantity}
                    </td>

                    <td>
                      ₹{sale.price}
                    </td>

                    <td>
                      ₹{sale.total}
                    </td>

                    <td>
                      {new Date(
                        sale.orderDate
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default SalesReport;