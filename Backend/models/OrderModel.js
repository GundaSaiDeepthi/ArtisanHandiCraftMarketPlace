import { Schema, model }
from "mongoose";

const orderSchema =
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

          quantity: Number,
        },
      ],

      totalAmount: {
        type: Number,
        required: true,
      },

      paymentStatus: {
        type: String,

        enum: [
          "PENDING",
          "PAID",
        ],

        default: "PENDING",
      },

      orderStatus: {
        type: String,

        enum: [
          "PLACED",
          "SHIPPED",
          "DELIVERED",
        ],

        default: "PLACED",
      },
    },

    {
      timestamps: true,
      versionKey: false,
    }
  );

export const OrderModel =
  model("Order", orderSchema);