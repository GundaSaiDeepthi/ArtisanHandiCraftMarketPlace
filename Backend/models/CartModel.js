import { Schema, model }
from "mongoose";

const cartSchema =
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
          product: {
            type:
              Schema.Types.ObjectId,

            ref: "Product",
          },

          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],

      totalAmount: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,
      versionKey: false,
    }
  );

export const CartModel =
  model("Cart", cartSchema);