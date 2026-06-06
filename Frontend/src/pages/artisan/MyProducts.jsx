import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyProducts = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(

          "https://artisanhandicraftmarketplace.onrender.com/artisan-api/my-products",

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setProducts(
        response.data.payload
      );

    }

    catch (error) {

      console.error(
        "Error fetching products",
        error
      );
    }

    finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchProducts();

  }, []);

  const toggleAvailability =
    async (
      productId,
      currentStatus
    ) => {

      try {

        const token =
          localStorage.getItem("token");

        await axios.patch(

          `https://artisanhandicraftmarketplace.onrender.com/artisan-api/products/${productId}/status`,

          {
            isAvailable:
              !currentStatus
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        fetchProducts();

      }

      catch (error) {

        console.error(
          "Status update failed",
          error
        );
      }
    };

  if (loading) {

    return (

      <div className="container py-5">

        <h3>
          Loading Products...
        </h3>

      </div>
    );
  }

  return (

    <div className="container py-5">

      <div
        className="
        d-flex
        justify-content-between
        align-items-center
        mb-4"
      >

        <h2>
          My Products
        </h2>

        <Link

          to="/artisan/add-product"

          className="
          btn
          btn-primary"
        >
          Add Product
        </Link>

      </div>

      {
        products.length === 0
          ? (

            <div
              className="
              alert
              alert-info"
            >

              No products found

            </div>

          )
          : (

            <div
              className="
              table-responsive"
            >

              <table
                className="
                table
                table-bordered
                table-hover"
              >

                <thead
                  className="
                  table-dark"
                >

                  <tr>

                    <th>
                      Image
                    </th>

                    <th>
                      Title
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    products.map(
                      product => (

                        <tr
                          key={
                            product._id
                          }
                        >

                          <td>

                            <img

                              src={
                                product.image
                              }

                              alt={
                                product.title
                              }

                              width="70"

                              height="70"

                              style={{
                                objectFit:
                                  "cover"
                              }}
                            />

                          </td>

                          <td>
                            {
                              product.title
                            }
                          </td>

                          <td>
                            {
                              product.category
                            }
                          </td>

                          <td>
                            ₹
                            {
                              product.price
                            }
                          </td>

                          <td>
                            {
                              product.stock
                            }
                          </td>

                          <td>

                            {
                              product.isAvailable
                                ? (

                                  <span
                                    className="
                                    badge
                                    bg-success"
                                  >

                                    Active

                                  </span>

                                )
                                : (

                                  <span
                                    className="
                                    badge
                                    bg-danger"
                                  >

                                    Disabled

                                  </span>

                                )
                            }

                          </td>

                          <td>

                            <div
                              className="
                              d-flex
                              gap-2"
                            >

                              <Link

                                to={`/artisan/edit-product/${product._id}`}

                                className="
                                btn
                                btn-warning
                                btn-sm"
                              >

                                Edit

                              </Link>

                              <button

                                className={

                                  product.isAvailable

                                    ? "btn btn-danger btn-sm"

                                    : "btn btn-success btn-sm"
                                }

                                onClick={() =>

                                  toggleAvailability(

                                    product._id,

                                    product.isAvailable
                                  )
                                }
                              >

                                {
                                  product.isAvailable

                                    ? "Disable"

                                    : "Enable"
                                }

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          )
      }

    </div>
  );
};

export default MyProducts;