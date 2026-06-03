import exp from "express";

import nodemailer from "nodemailer";

import { UserTypeModel }
from "../models/UserModel.js";

import { ProductModel }
from "../models/ProductModel.js";

import { OrderModel }
from "../models/OrderModel.js";

import { ReviewModel }
from "../models/ReviewModel.js";

import { verifyToken }
from "../middlewares/verifyToken.js";

export const adminRoute =
  exp.Router();

/*
==================================================
EMAIL TRANSPORTER
==================================================
*/

const transporter =
  nodemailer.createTransport({

    service: "gmail",

    auth: {

      user:
        process.env.EMAIL_USER,

      pass:
        process.env.EMAIL_PASS,
    },
  });

/*
==================================================
SEND ORDER STATUS EMAIL
==================================================
*/

const sendOrderStatusEmail =
  async (
    email,
    orderId,
    orderStatus
  ) => {

    await transporter.sendMail({

      from:
        process.env.EMAIL_USER,

      to: email,

      subject:
        `Order ${orderStatus}`,

      text:
        `Your order with ID ${orderId} is now ${orderStatus}.`,
    });
  };

/*
==================================================
GET ALL USERS
==================================================
*/

adminRoute.get(

  "/users",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const users =
        await UserTypeModel.find()

          .select(
            "-password -emailOTP -otpExpiry"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalUsers:
          users.length,

        payload: users,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET SINGLE USER
==================================================
*/

adminRoute.get(

  "/users/:userId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { userId } =
        req.params;

      const user =
        await UserTypeModel.findById(
          userId
        ).select(
          "-password -emailOTP -otpExpiry"
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      res.status(200).json({

        success: true,

        payload: user,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
BLOCK USER
==================================================
*/

adminRoute.patch(

  "/blockuser/:userId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { userId } =
        req.params;

      const userOfDB =
        await UserTypeModel.findById(
          userId
        );

      if (!userOfDB) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (
        userOfDB.isActive === false
      ) {

        return res.status(400).json({

          success: false,

          message:
            "User already blocked",
        });
      }

      const blockedUser =
        await UserTypeModel.findByIdAndUpdate(

          userId,

          {
            $set: {
              isActive: false,
            },
          },

          {
            new: true,
          }
        ).select(
          "-password -emailOTP -otpExpiry"
        );

      res.status(200).json({

        success: true,

        message:
          "User blocked successfully",

        payload: blockedUser,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
UNBLOCK USER
==================================================
*/

adminRoute.patch(

  "/unblockuser/:userId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { userId } =
        req.params;

      const userOfDB =
        await UserTypeModel.findById(
          userId
        );

      if (!userOfDB) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (
        userOfDB.isActive === true
      ) {

        return res.status(400).json({

          success: false,

          message:
            "User already active",
        });
      }

      const unblockedUser =
        await UserTypeModel.findByIdAndUpdate(

          userId,

          {
            $set: {
              isActive: true,
            },
          },

          {
            new: true,
          }
        ).select(
          "-password -emailOTP -otpExpiry"
        );

      res.status(200).json({

        success: true,

        message:
          "User unblocked successfully",

        payload: unblockedUser,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
APPROVE ARTISAN
==================================================
*/

adminRoute.patch(

  "/approve-artisan/:userId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { userId } =
        req.params;

      const userOfDB =
        await UserTypeModel.findById(
          userId
        );

      if (!userOfDB) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (
        userOfDB.role !== "ARTISAN"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "User is not an artisan",
        });
      }

      if (
        userOfDB.isArtisanApproved === true
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Artisan already approved",
        });
      }

      const approvedArtisan =
        await UserTypeModel.findByIdAndUpdate(

          userId,

          {
            $set: {
              isArtisanApproved: true,
            },
          },

          {
            new: true,
          }
        ).select(
          "-password -emailOTP -otpExpiry"
        );

      res.status(200).json({

        success: true,

        message:
          "Artisan approved successfully",

        payload: approvedArtisan,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
DELETE USER
==================================================
*/

adminRoute.delete(

  "/users/:userId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { userId } =
        req.params;

      const deletedUser =
        await UserTypeModel.findByIdAndDelete(
          userId
        );

      if (!deletedUser) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      res.status(200).json({

        success: true,

        message:
          "User deleted successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET ALL PRODUCTS
==================================================
*/

adminRoute.get(

  "/products",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const products =
        await ProductModel.find()

          .populate(
            "artisan",
            "firstName lastName email"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalProducts:
          products.length,

        payload: products,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
DELETE PRODUCT
==================================================
*/

adminRoute.delete(

  "/products/:productId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { productId } =
        req.params;

      const deletedProduct =
        await ProductModel.findByIdAndDelete(
          productId
        );

      if (!deletedProduct) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      /*
      ====================================
      DELETE PRODUCT REVIEWS
      ====================================
      */

      await ReviewModel.deleteMany({

        product: productId,
      });

      res.status(200).json({

        success: true,

        message:
          "Product deleted successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET ALL ORDERS
==================================================
*/

adminRoute.get(

  "/orders",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const orders =
        await OrderModel.find()

          .populate(
            "user",
            "firstName lastName email"
          )

          .populate(
            "products.product"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        totalOrders:
          orders.length,

        payload: orders,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET SINGLE ORDER
==================================================
*/

adminRoute.get(

  "/orders/:orderId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { orderId } =
        req.params;

      const order =
        await OrderModel.findById(
          orderId
        )

          .populate(
            "user",
            "firstName lastName email"
          )

          .populate(
            "products.product"
          );

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",
        });
      }

      res.status(200).json({

        success: true,

        payload: order,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
UPDATE ORDER STATUS
==================================================
*/

adminRoute.patch(

  "/orders/:orderId",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const { orderId } =
        req.params;

      const { orderStatus } =
        req.body;

      const allowedStatuses = [

        "PLACED",

        "PROCESSING",

        "SHIPPED",

        "DELIVERED",

        "CANCELLED",
      ];

      /*
      ====================================
      STATUS VALIDATION
      ====================================
      */

      if (
        !allowedStatuses.includes(
          orderStatus
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order status",
        });
      }

      const updatedOrder =
        await OrderModel.findByIdAndUpdate(

          orderId,

          {
            $set: {
              orderStatus,
            },
          },

          {
            new: true,
          }
        )

          .populate(
            "user",
            "firstName lastName email"
          )

          .populate(
            "products.product"
          );

      if (!updatedOrder) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",
        });
      }

      /*
      ====================================
      SEND EMAIL ON STATUS UPDATE
      ====================================
      */

      if (
        updatedOrder.user?.email
      ) {

        await sendOrderStatusEmail(

          updatedOrder.user.email,

          updatedOrder._id,

          orderStatus
        );
      }

      /*
      ====================================
      RESTORE STOCK IF CANCELLED
      ====================================
      */

      if (
        orderStatus ===
        "CANCELLED"
      ) {

        for (
          let item
          of
          updatedOrder.products
        ) {

          const product =
            await ProductModel.findById(
              item.product._id
            );

          if (product) {

            product.stock +=
              item.quantity;

            product.isAvailable =
              true;

            await product.save();
          }
        }
      }

      res.status(200).json({

        success: true,

        message:
          `Order status updated to ${orderStatus}`,

        payload:
          updatedOrder,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
ADMIN DASHBOARD STATS
==================================================
*/

adminRoute.get(

  "/dashboard",

  verifyToken("ADMIN"),

  async (req, res, next) => {

    try {

      const totalUsers =
        await UserTypeModel.countDocuments({

          role: "USER",
        });

      const totalArtisans =
        await UserTypeModel.countDocuments({

          role: "ARTISAN",
        });

      const totalProducts =
        await ProductModel.countDocuments();

      const totalOrders =
        await OrderModel.countDocuments();

      /*
      ====================================
      TOTAL REVENUE
      ====================================
      */

      const totalRevenueData =
        await OrderModel.aggregate([

          {
            $match: {

              paymentStatus:
                "PAID",
            },
          },

          {
            $group: {

              _id: null,

              totalRevenue: {

                $sum:
                  "$totalAmount",
              },
            },
          },
        ]);

      const totalRevenue =
        totalRevenueData[0]
          ?.totalRevenue || 0;

      /*
      ====================================
      RECENT ORDERS
      ====================================
      */

      const recentOrders =
        await OrderModel.find()

          .sort({
            createdAt: -1,
          })

          .limit(5)

          .populate(
            "user",
            "firstName lastName"
          );

      res.status(200).json({

        success: true,

        payload: {

          totalUsers,

          totalArtisans,

          totalProducts,

          totalOrders,

          totalRevenue,

          recentOrders,
        },
      });

    } catch (err) {

      next(err);
    }
  }
);