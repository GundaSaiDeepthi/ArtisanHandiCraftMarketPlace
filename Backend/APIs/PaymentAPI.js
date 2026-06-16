import exp from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

import { verifyToken }
from "../middlewares/verifyToken.js";

import { OrderModel }
from "../models/OrderModel.js";

import { ProductModel }
from "../models/ProductModel.js";

export const paymentRoute =
  exp.Router();

/*
==================================================
RAZORPAY INSTANCE
==================================================
*/

const razorpay =
  new Razorpay({

    key_id:
      process.env.RAZORPAY_KEY_ID,

    key_secret:
      process.env.RAZORPAY_SECRET,
  });

/*
==================================================
CREATE PAYMENT ORDER
==================================================
*/

paymentRoute.post(

  "/create-order",

  verifyToken("USER"),

  async (req, res, next) => {

    try {

      const {
        products,
        totalAmount,
      } = req.body;

      /*
      ==================================
      VALIDATE PRODUCTS
      ==================================
      */

      for (let item of products) {

        const product =
          await ProductModel.findById(
            item.product
          );

        if (!product) {

          return res.status(404).json({

            success: false,

            message:
              "Product not found",
          });
        }

        /*
        ==================================
        STOCK VALIDATION
        ==================================
        */

        if (
          item.quantity >
          product.stock
        ) {

          return res.status(400).json({

            success: false,

            message:
              `${product.title} has insufficient stock`,
          });
        }
      }

      /*
      ==================================
      CREATE RAZORPAY ORDER
      ==================================
      */

      const options = {

        amount:
          totalAmount * 100,

        currency: "INR",

        receipt:
          `receipt_${Date.now()}`,
      };

      const razorpayOrder =
        await razorpay.orders.create(
          options
        );

      res.status(200).json({

        success: true,

        message:
          "Payment order created",

        payload: razorpayOrder,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
VERIFY PAYMENT
==================================================
*/

paymentRoute.post(

  "/verify-payment",

  verifyToken("USER"),

  async (req, res, next) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

        products,

        totalAmount,

      } = req.body;

      /*
      ==================================
      GENERATE SIGNATURE
      ==================================
      */

      const generatedSignature =
        crypto

          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_SECRET
          )

          .update(
            razorpay_order_id +
            "|" +
            razorpay_payment_id
          )

          .digest("hex");

      /*
      ==================================
      VERIFY SIGNATURE
      ==================================
      */

      if (
        generatedSignature !==
        razorpay_signature
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Payment verification failed",
        });
      }

      /*
      ==================================
      UPDATE PRODUCT STOCK
      ==================================
      */

      for (let item of products) {

        const product =
          await ProductModel.findById(
            item.product
          );

        if (!product) continue;

        /*
        ==============================
        REDUCE STOCK
        ==============================
        */

        product.stock -=
          item.quantity;

        /*
        ==============================
        OUT OF STOCK
        ==============================
        */

        if (
          product.stock <= 0
        ) {

          product.stock = 0;

          product.isAvailable =
            false;
        }

        await product.save();
      }

      /*
      ==================================
      CREATE ORDER
      ==================================
      */

      const newOrder =
        new OrderModel({

          user:
            req.user.userId,

          products,

          totalAmount,

          paymentId:
            razorpay_payment_id,

          paymentStatus:
            "PAID",

          orderStatus:
            "PLACED",
        });

      await newOrder.save();

      res.status(200).json({

        success: true,

        message:
          "Payment verified successfully",

        payload: newOrder,
      });

    } catch (err) {

      next(err);
    }
  }
);