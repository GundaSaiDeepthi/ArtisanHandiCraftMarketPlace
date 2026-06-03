import { Schema, model }
from "mongoose";

const wishlistSchema =
  new Schema(

    {
      user: {
        type:
          Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      products: [

        {
          type:
            Schema.Types.ObjectId,

          ref: "Product",
        },
      ],
    },

    {
      timestamps: true,
      versionKey: false,
    }
  );

export const WishlistModel =
  model(
    "Wishlist",
    wishlistSchema
  );