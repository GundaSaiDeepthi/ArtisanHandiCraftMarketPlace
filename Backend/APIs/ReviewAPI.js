import mongoose from "mongoose";

const reviewSchema =
  new mongoose.Schema(

    {
      /*
      ==================================
      USER WHO GAVE REVIEW
      ==================================
      */

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true,
      },

      /*
      ==================================
      PRODUCT REVIEWED
      ==================================
      */

      product: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "products",

        required: true,
      },

      /*
      ==================================
      RATING
      ==================================
      */

      rating: {
        type: Number,

        required: true,

        min: 1,

        max: 5,
      },

      /*
      ==================================
      REVIEW COMMENT
      ==================================
      */

      comment: {
        type: String,

        required: true,

        trim: true,
      },
    },

    {
      timestamps: true,
    }
  );

/*
==================================
PREVENT DUPLICATE REVIEWS
ONE USER -> ONE REVIEW PER PRODUCT
==================================
*/

reviewSchema.index(
  {
    user: 1,
    product: 1,
  },
  {
    unique: true,
  }
);

export const ReviewModel =
  mongoose.model(
    "reviews",
    reviewSchema
  );