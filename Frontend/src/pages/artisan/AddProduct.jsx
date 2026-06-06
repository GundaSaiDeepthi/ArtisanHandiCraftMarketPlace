import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          new FormData();

        Object.keys(formData)
          .forEach(key => {

            data.append(
              key,
              formData[key]
            );
          });

        if (image) {

          data.append(
            "image",
            image
          );
        }

        const response =
          await axios.post(

            "https://artisanhandicraftmarketplace.onrender.com/artisan-api/products",

            data,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        alert(
          response.data.message
        );

        navigate(
          "/artisan/products"
        );

      }

      catch (error) {

        console.error(error);

        alert(
          error.response?.data?.message ||
          "Failed to add product"
        );
      }

      finally {

        setLoading(false);
      }
    };

  return (

    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-8">

          <div className="card shadow">

            <div className="card-body">

              <h2 className="mb-4">
                Add Product
              </h2>

              <form
                onSubmit={
                  handleSubmit
                }
              >

                <div className="mb-3">

                  <label>
                    Product Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    required
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    required
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    className="form-control"
                    required
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option>
                      Wood Craft
                    </option>

                    <option>
                      Pottery
                    </option>

                    <option>
                      Jewelry
                    </option>

                    <option>
                      Textiles
                    </option>

                    <option>
                      Painting
                    </option>

                    <option>
                      Home Decor
                    </option>

                  </select>

                </div>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label>
                      Price
                    </label>

                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      required
                      min="1"
                      value={
                        formData.price
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>
                      Stock
                    </label>

                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      required
                      min="0"
                      value={
                        formData.stock
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

                <div className="mb-3">

                  <label>
                    Material
                  </label>

                  <input
                    type="text"
                    name="material"
                    className="form-control"
                    value={
                      formData.material
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Dimensions
                  </label>

                  <input
                    type="text"
                    name="dimensions"
                    className="form-control"
                    value={
                      formData.dimensions
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Product Image
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    required
                    onChange={(e) =>
                      setImage(
                        e.target.files[0]
                      )
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading
                  }
                >

                  {
                    loading
                      ? "Adding..."
                      : "Add Product"
                  }

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddProduct;