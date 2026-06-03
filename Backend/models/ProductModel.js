import { Schema, model }
from "mongoose";

const productSchema =
  new Schema(

    {
      /*
      ==================================
      PRODUCT TITLE
      ==================================
      */

      title: {
        type: String,

        required: [
          true,
          "Product title is required",
        ],

        trim: true,

        minlength: 3,

        maxlength: 100,
      },

      /*
      ==================================
      PRODUCT DESCRIPTION
      ==================================
      */

      description: {
        type: String,

        required: [
          true,
          "Product description is required",
        ],

        trim: true,

        minlength: 10,

        maxlength: 2000,
      },

      /*
      ==================================
      PRODUCT PRICE
      ==================================
      */

      price: {
        type: Number,

        required: [
          true,
          "Product price is required",
        ],

        min: 1,
      },

      /*
      ==================================
      PRODUCT IMAGE
      ==================================
      */

      image: {
        type: String,

        required: [
          true,
          "Product image is required",
        ],
      },

      /*
      ==================================
      PRODUCT CATEGORY
      ==================================
      */

      category: {
        type: String,

        required: [
          true,
          "Product category is required",
        ],

        enum: [

          "Wood Craft",

          "Pottery",

          "Jewelry",

          "Textiles",

          "Painting",

          "Home Decor",
        ],
      },

      /*
      ==================================
      PRODUCT STOCK
      ==================================
      */

      stock: {
        type: Number,

        required: [
          true,
          "Stock quantity is required",
        ],

        default: 0,

        min: 0,
      },

      /*
      ==================================
      ARTISAN INFORMATION
      ==================================
      */

      artisan: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: [
          true,
          "Artisan information is required",
        ],
      },

      /*
      ==================================
      PRODUCT RATING
      ==================================
      */

      rating: {
        type: Number,

        default: 0,

        min: 0,

        max: 5,
      },

      /*
      ==================================
      TOTAL REVIEWS COUNT
      ==================================
      */

      reviewsCount: {
        type: Number,

        default: 0,

        min: 0,
      },

      /*
      ==================================
      PRODUCT AVAILABILITY
      ==================================
      */

      isAvailable: {
        type: Boolean,

        default: true,
      },

      /*
      ==================================
      PRODUCT TAGS
      ==================================
      */

      tags: [
        {
          type: String,

          trim: true,
        },
      ],

      /*
      ==================================
      PRODUCT MATERIAL
      ==================================
      */

      material: {
        type: String,

        trim: true,

        default: "",
      },

      /*
      ==================================
      PRODUCT DIMENSIONS
      ==================================
      */

      dimensions: {
        type: String,

        trim: true,

        default: "",
      },

      /*
      ==================================
      FEATURED PRODUCT
      ==================================
      */

      isFeatured: {
        type: Boolean,

        default: false,
      },

      /*
      ==================================
      TOTAL SALES
      ==================================
      */

      totalSales: {
        type: Number,

        default: 0,

        min: 0,
      },
    },

    {
      timestamps: true,

      strict: "throw",

      versionKey: false,
    }
  );



/*
==================================
AUTO UPDATE AVAILABILITY
==================================
*/

productSchema.pre(

  "save",

  function (next) {

    /*
    ==================================
    AUTO HANDLE AVAILABILITY
    ==================================
    */

    if (this.stock <= 0) {

      this.isAvailable = false;
    }

    else {

      this.isAvailable = true;
    }

    /*
    ==================================
    ROUND RATING VALUE
    ==================================
    */

    this.rating =
      Number(
        this.rating.toFixed(1)
      );

    next();
  }
);



/*
==================================
TEXT SEARCH INDEX
==================================
*/

productSchema.index({

  title: "text",

  description: "text",

  category: "text",

  tags: "text",
});



/*
==================================
CATEGORY INDEX
==================================
*/

productSchema.index({

  category: 1,
});



/*
==================================
PRICE INDEX
==================================
*/

productSchema.index({

  price: 1,
});



/*
==================================
RATING INDEX
==================================
*/

productSchema.index({

  rating: -1,
});



/*
==================================
LATEST PRODUCTS INDEX
==================================
*/

productSchema.index({

  createdAt: -1,
});



/*
==================================
ARTISAN INDEX
==================================
*/

productSchema.index({

  artisan: 1,
});



/*
==================================
CREATE MODEL
==================================
*/

export const ProductModel =
  model(
    "Product",
    productSchema
  );