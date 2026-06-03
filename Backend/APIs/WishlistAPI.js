import mongoose from "mongoose";

const wishlistSchema =
  new mongoose.Schema(

    {
      /*
      ==================================
      USER
      ==================================
      */

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true,

        unique: true,
      },

      /*
      ==================================
      WISHLIST PRODUCTS
      ==================================
      */

      products: [

        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "products",
        },
      ],
    },

    {
      timestamps: true,
    }
  );

export const WishlistModel =
  mongoose.model(
    "wishlists",
    wishlistSchema
  );