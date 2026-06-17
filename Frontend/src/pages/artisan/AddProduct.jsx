import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Upload, PackagePlus } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    material: "",
    dimensions: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      const response = await api.post(
        "/artisan-api/products",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
      navigate("/artisan/products");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add product"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          
          {/* Header */}
          <div className="border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <PackagePlus className="text-violet-500" size={28} />

              <h1 className="bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
                Add New Product
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-400">
              Create and publish a handcrafted product
              for your customers.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6"
          >
            
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Product Title
              </label>

              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter product title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Description
              </label>

              <textarea
                rows={5}
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                className={`${inputClasses} resize-none`}
                placeholder="Describe your handmade product..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Category
              </label>

              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">
                  Select Category
                </option>

                <option value="Wood Craft">
                  Wood Craft
                </option>

                <option value="Pottery">
                  Pottery
                </option>

                <option value="Jewelry">
                  Jewelry
                </option>

                <option value="Textiles">
                  Textiles
                </option>

                <option value="Painting">
                  Painting
                </option>

                <option value="Home Decor">
                  Home Decor
                </option>
              </select>
            </div>

            {/* Price + Stock */}
            <div className="grid gap-6 md:grid-cols-2">
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Price (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Material + Dimensions */}
            <div className="grid gap-6 md:grid-cols-2">
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Material
                </label>

                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Wood, Clay, Cotton..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Dimensions
                </label>

                <input
                  type="text"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="10 x 5 x 3 cm"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Product Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/50 p-8 transition hover:border-violet-500">
                <Upload
                  size={40}
                  className="mb-3 text-violet-500"
                />

                <span className="text-slate-300">
                  Click to upload image
                </span>

                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG, WEBP
                </span>

                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {preview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-64 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-violet-700 hover:to-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PackagePlus size={18} />

              {loading
                ? "Adding Product..."
                : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;