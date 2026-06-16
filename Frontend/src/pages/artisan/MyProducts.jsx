import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  Pencil,
  Eye,
  EyeOff,
} from "lucide-react";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/artisan-api/my-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(response.data.payload || []);
    } catch (error) {
      console.error(
        "Error fetching products",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleAvailability = async (
    productId,
    currentStatus
  ) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/artisan-api/products/${productId}/status`,
        {
          isAvailable: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProducts();
    } catch (error) {
      console.error(
        "Status update failed",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />
          <p className="text-slate-300">
            Loading Products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-4xl font-bold text-transparent">
              My Products
            </h1>

            <p className="mt-2 text-slate-400">
              Manage and monitor all your handcrafted products.
            </p>
          </div>

          <Link
            to="/artisan/add-product"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-medium text-white transition-all duration-300 hover:scale-105 hover:from-violet-700 hover:to-fuchsia-700"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-10 text-center">
            <Package
              size={56}
              className="mx-auto mb-4 text-blue-400"
            />

            <h3 className="mb-2 text-xl font-semibold text-white">
              No Products Found
            </h3>

            <p className="text-slate-400">
              Start by adding your first handcrafted product.
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
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Stock
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b border-slate-800 transition hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-16 w-16 rounded-xl object-cover"
                            />

                            <div>
                              <h4 className="font-semibold text-white">
                                {product.title}
                              </h4>

                              <p className="text-sm text-slate-400">
                                ID: {product._id.slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 font-semibold text-emerald-400">
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          {product.isAvailable ? (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                              Disabled
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link
                              to={`/artisan/edit-product/${product._id}`}
                              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-amber-600"
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                toggleAvailability(
                                  product._id,
                                  product.isAvailable
                                )
                              }
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
                                product.isAvailable
                                  ? "bg-red-600 text-white hover:bg-red-700"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700"
                              }`}
                            >
                              {product.isAvailable ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}

                              {product.isAvailable
                                ? "Disable"
                                : "Enable"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-5 lg:hidden">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-xl"
                >
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {product.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {product.category}
                      </p>

                      <p className="mt-2 font-bold text-emerald-400">
                        ₹
                        {Number(
                          product.price
                        ).toLocaleString("en-IN")}
                      </p>

                      <p className="text-sm text-slate-400">
                        Stock: {product.stock}
                      </p>

                      <div className="mt-2">
                        {product.isAvailable ? (
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full border border-red-500/30 bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400">
                            Disabled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      to={`/artisan/edit-product/${product._id}`}
                      className="flex-1 rounded-xl bg-amber-500 py-2 text-center text-sm font-medium text-black transition hover:bg-amber-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        toggleAvailability(
                          product._id,
                          product.isAvailable
                        )
                      }
                      className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                        product.isAvailable
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {product.isAvailable
                        ? "Disable"
                        : "Enable"}
                    </button>
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

export default MyProducts;