import exp from "express";

import Razorpay from "razorpay";

import crypto from "crypto";

import {
  authenticate,
  register,
  forgotPassword,
  resetPassword
}
from "../services/authService.js";

import { sendEmail }
from "../utils/sendEmail.js";

import { UserTypeModel }
from "../models/UserModel.js";

import { ProductModel }
from "../models/ProductModel.js";

import { CartModel }
from "../models/CartModel.js";

import { OrderModel }
from "../models/OrderModel.js";

import { WishlistModel }
from "../models/WishlistModel.js";

import { ReviewModel }
from "../models/ReviewModel.js";

import { verifyToken }
from "../middlewares/verifyToken.js";

import { upload }
from "../config/multer.js";

import cloudinary
from "../config/cloudinary.js";

import {
  uploadToCloudinary,
} from "../config/cloudinaryUpload.js";

export const userRoute =
  exp.Router();

/*
==================================================
RAZORPAY CONFIG
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
GENERATE OTP
==================================================
*/

const generateOTP = () => {

  return Math.floor(

    100000 +
    Math.random() * 900000

  ).toString();
};

/*
==================================================
REGISTER USER
==================================================
*/

userRoute.post(

  "/users",

  upload.single(
    "profileImageUrl"
  ),

  async (
    req,
    res,
    next
  ) => {

    let cloudinaryResult;

    try {

      let userObj =
        req.body;

      /*
      ==================================
      UPLOAD IMAGE
      ==================================
      */

      if (req.file) {

        cloudinaryResult =
          await uploadToCloudinary(
            req.file.buffer
          );
      }

      
  

      /*
      ==================================
      REGISTER USER
      ==================================
      */
 const newUserObj =
  await register({

    ...userObj,

    role:
      userObj.role || "USER",

    profileImageUrl:
      cloudinaryResult?.secure_url,
       
});
      

          

      res.status(201).json({

        success: true,

        message:
          "User registered successfully. Please verify your email.",

        payload:
          newUserObj,
      });

    } catch (err) {

      if (
        cloudinaryResult
          ?.public_id
      ) {

        await cloudinary
          .uploader
          .destroy(
            cloudinaryResult.public_id
          );
      }

      next(err);
    }
  }
);

/*
==================================================
VERIFY EMAIL
==================================================
*/

userRoute.post(

  "/verify-email",

  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        email,
        otp,
      } = req.body;

      if (
        !email ||
        !otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and OTP are required",
        });
      }

      const user =
        await UserTypeModel.findOne({

          email:
            email
              .toLowerCase()
              .trim(),
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (
        user.isEmailVerified
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email already verified",
        });
      }

      if (
        user.emailOTP !== otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",
        });
      }

if (
  !user.otpExpiry ||
  user.otpExpiry < new Date()
){

        return res.status(400).json({

          success: false,

          message:
            "OTP expired",
        });
      }

      user.isEmailVerified =
        true;

      user.emailOTP =
        null;

      user.otpExpiry =
        null;

      await user.save();

      res.status(200).json({

        success: true,

        message:
          "Email verified successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
RESEND OTP
==================================================
*/

userRoute.post(

  "/resend-otp",

  async (
    req,
    res,
    next
  ) => {

    try {

      const { email } =
        req.body;

      const user =
        await UserTypeModel.findOne({

          email:
            email
              .toLowerCase()
              .trim(),
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (
        user.isEmailVerified
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email already verified",
        });
      }

      const otp =
        generateOTP();

      user.emailOTP =
        otp;

     user.otpExpiry =
  new Date(
    Date.now() +
    10 * 60 * 1000
  );

      await user.save();

      await sendEmail({

        to:
          user.email,

        subject:
          "Resend OTP",

        text:
          `Your new OTP is ${otp}. OTP valid for 10 minutes.`,
      });

      res.status(200).json({

        success: true,

        message:
          "OTP resent successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
LOGIN USER
==================================================
*/

userRoute.post(

  "/login",

  async (
    req,
    res,
    next
  ) => {

    try {

      const userCredentials =
        req.body;

      const result =
        await authenticate(
          userCredentials
        );

      res.cookie(
        "token",
        result.token,
        {

          httpOnly: true,

          secure:
            process.env.NODE_ENV
            === "production",

          sameSite:
            process.env.NODE_ENV
            === "production"
              ? "none"
              : "lax",

          maxAge:
  7 * 24 * 60 * 60 * 1000
        }
      );

      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token:
          result.token,

        payload:
          result.user,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
LOGOUT USER
==================================================
*/

userRoute.get(

  "/logout",

  (req, res) => {

    res.clearCookie(
      "token",
      {

        httpOnly: true,

        secure:
          process.env.NODE_ENV
          === "production",

        sameSite:
          process.env.NODE_ENV
          === "production"
            ? "none"
            : "lax",
      }
    );

    res.status(200).json({

      success: true,

      message:
        "Logout successful",
    });
  }
);

/*
==================================================
GET USER PROFILE
==================================================
*/

userRoute.get(

  "/profile",

 verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
) ,

  async (
    req,
    res,
    next
  ) => {

    try {

      const user =
        await UserTypeModel.findById(
          req.user.userId
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
UPDATE PROFILE
==================================================
*/

userRoute.put(

  "/profile",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  upload.single(
    "profileImageUrl"
  ),

  async (
    req,
    res,
    next
  ) => {

    let cloudinaryResult;

    try {

      const userId =
        req.user.userId;

      const user =
        await UserTypeModel.findById(
          userId
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (req.file) {

        cloudinaryResult =
          await uploadToCloudinary(
            req.file.buffer
          );
      }

      const updatedData = {
        firstName: req.body.firstName !== undefined ? req.body.firstName : user.firstName,
        lastName: req.body.lastName !== undefined ? req.body.lastName : user.lastName,
        phoneNumber: req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber,
        artisanBio: req.body.artisanBio !== undefined ? req.body.artisanBio : user.artisanBio,
        artisanSpecialization: req.body.artisanSpecialization !== undefined ? req.body.artisanSpecialization : user.artisanSpecialization,
        artisanExperience: req.body.artisanExperience !== undefined ? req.body.artisanExperience : user.artisanExperience,
      };

      if (req.body.address) {
        try {
          updatedData.address = typeof req.body.address === "string" 
            ? JSON.parse(req.body.address) 
            : req.body.address;
        } catch (e) {
          updatedData.address = {
            street: req.body.street || user.address?.street || "",
            city: req.body.city || user.address?.city || "",
            state: req.body.state || user.address?.state || "",
            country: req.body.country || user.address?.country || "India",
            postalCode: req.body.postalCode || user.address?.postalCode || "",
          };
        }
      } else if (req.body.street || req.body.city || req.body.state || req.body.postalCode) {
        updatedData.address = {
          street: req.body.street !== undefined ? req.body.street : (user.address?.street || ""),
          city: req.body.city !== undefined ? req.body.city : (user.address?.city || ""),
          state: req.body.state !== undefined ? req.body.state : (user.address?.state || ""),
          country: req.body.country !== undefined ? req.body.country : (user.address?.country || "India"),
          postalCode: req.body.postalCode !== undefined ? req.body.postalCode : (user.address?.postalCode || ""),
        };
      }

      if (
        cloudinaryResult
          ?.secure_url
      ) {

        updatedData.profileImageUrl =
          cloudinaryResult.secure_url;
      }

      const updatedUser =
        await UserTypeModel.findByIdAndUpdate(

          userId,

          {
            $set:
              updatedData,
          },

          {
            new: true,
          }
        ).select(

          "-password"
        );

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        payload:
          updatedUser,
      });

    } catch (err) {

      if (
        cloudinaryResult
          ?.public_id
      ) {

        await cloudinary
          .uploader
          .destroy(
            cloudinaryResult.public_id
          );
      }

      next(err);
    }
  }
);

/*
==================================================
GET ALL PRODUCTS
==================================================
*/

userRoute.get(

  "/products",

  async (
    req,
    res,
    next
  ) => {

    try {

      const products =
        await ProductModel.find({

          isAvailable:
            true,
        })

          .populate(
            "artisan",
            "firstName lastName email profileImageUrl"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        payload:
          products,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET SINGLE PRODUCT
==================================================
*/

userRoute.get(

  "/products/:productId",

  async (
    req,
    res,
    next
  ) => {

    try {

      const product =
        await ProductModel.findById(
          req.params.productId
        ).populate(

          "artisan",
          "firstName lastName email profileImageUrl"
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      res.status(200).json({

        success: true,

        payload:
          product,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
ADD TO CART
==================================================
*/

userRoute.post(

  "/cart",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        productId,
        quantity = 1,
      } = req.body;

      const userId =
        req.user.userId;

        if (!productId) {
  return res.status(400).json({
    success: false,
    message: "Product ID required",
  });
}

if (quantity < 1) {
  return res.status(400).json({
    success: false,
    message: "Quantity must be greater than 0",
  });
}
      const product =
        await ProductModel.findById(
          productId
        );

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      let cart =
        await CartModel.findOne({

          user: userId,
        });

      if (!cart) {

        cart =
          new CartModel({

            user: userId,

            products: [],
          });
      }

      const existingProduct =
        cart.products.find(

          item =>

            item.product.toString()
            === productId
        );

      if (existingProduct) {

        existingProduct.quantity +=
          quantity;
      }

      else {

        cart.products.push({

          product:
            productId,

          quantity,
        });
      }

      await cart.save();

      res.status(200).json({

        success: true,

        message:
          "Product added to cart",

        payload:
          cart,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET CART
==================================================
*/

userRoute.get(

  "/cart",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const cart =
        await CartModel.findOne({

          user:
            req.user.userId,
        })

          .populate({

            path:
              "products.product",

            populate: {

              path:
                "artisan",

              select:
                "firstName lastName profileImageUrl",
            },
          });

      res.status(200).json({

        success: true,

        payload:
          cart,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
REMOVE FROM CART
==================================================
*/

userRoute.delete(

  "/cart/:productId",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const userId =
        req.user.userId;

      const productId =
        req.params.productId;

      const cart =
        await CartModel.findOne({
          user: userId,
        });

      if (!cart) {

        return res.status(404).json({

          success: false,

          message:
            "Cart not found",
        });
      }

      cart.products =
        cart.products.filter(

          item =>

            item.product.toString()
            !== productId
        );

      await cart.save();

      const populatedCart = await CartModel.findOne({ user: userId }).populate({
        path: "products.product",
        populate: {
          path: "artisan",
          select: "firstName lastName profileImageUrl",
        }
      });

      res.status(200).json({

        success: true,

        message:
          "Product removed from cart",

        payload:
          populatedCart,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
UPDATE CART QUANTITY
==================================================
*/

userRoute.put(

  "/cart/:productId",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const userId =
        req.user.userId;

      const productId =
        req.params.productId;

      const { quantity } = req.body;

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }

      const cart =
        await CartModel.findOne({
          user: userId,
        });

      if (!cart) {

        return res.status(404).json({

          success: false,

          message:
            "Cart not found",
        });
      }

      const item = cart.products.find(
        p => p.product.toString() === productId
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Product not found in cart",
        });
      }

      item.quantity = quantity;

      await cart.save();

      const populatedCart = await CartModel.findOne({ user: userId }).populate({
        path: "products.product",
        populate: {
          path: "artisan",
          select: "firstName lastName profileImageUrl",
        }
      });

      res.status(200).json({

        success: true,

        message:
          "Cart updated",

        payload:
          populatedCart,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
PLACE ORDER
==================================================
*/

userRoute.post(

  "/orders",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        products,
        totalAmount,
        paymentId,
      } = req.body;

      const newOrder =
        new OrderModel({

          user:
            req.user.userId,

          products,

          totalAmount,

          paymentId,

          paymentStatus:
            "PAID",

          orderStatus:
            "PLACED",
        });

      await newOrder.save();

      /*
      ==================================
      CLEAR CART
      ==================================
      */

      await CartModel.findOneAndUpdate(

        {
          user:
            req.user.userId,
        },

        {
          $set: {
            products: [],
          },
        }
      );

      /*
      ==================================
      SEND ORDER EMAIL
      ==================================
      */

      const user =
        await UserTypeModel.findById(
          req.user.userId
        );

      await sendEmail({

        to:
          user.email,

        subject:
          "Order Placed Successfully",

        text:
          `Your order has been placed successfully. Total Amount: ₹${totalAmount}`,
      });

      res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        payload:
          newOrder,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET USER ORDERS
==================================================
*/

userRoute.get(

  "/orders",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const orders =
        await OrderModel.find({

          user:
            req.user.userId,
        })

          .populate(
            "products.product"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        payload:
          orders,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
CANCEL ORDER
==================================================
*/

userRoute.put(

  "/orders/cancel/:orderId",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const order =
  await OrderModel.findOne({
    _id: req.params.orderId,
    user: req.user.userId,
  });

      if (!order) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",
        });
      }

      order.orderStatus =
        "CANCELLED";

      await order.save();

      res.status(200).json({

        success: true,

        message:
          "Order cancelled successfully",

        payload:
          order,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
ADD REVIEW
==================================================
*/

userRoute.post(

  "/reviews",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        productId,
        rating,
        comment,
      } = req.body;
      if (
  rating < 1 ||
  rating > 5
) {
  return res.status(400).json({
    success:false,
    message:"Rating must be between 1 and 5"
  });
}

      const existingReview =
        await ReviewModel.findOne({

          user:
            req.user.userId,

          product:
            productId,
        });

      if (existingReview) {

        return res.status(400).json({

          success: false,

          message:
            "Review already added",
        });
      }

      const review =
        new ReviewModel({

          user:
            req.user.userId,

          product:
            productId,

          rating,

          comment,
        });

      await review.save();

      // Recalculate product rating and reviewsCount
      const reviews = await ReviewModel.find({ product: productId });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      await ProductModel.findByIdAndUpdate(productId, {
        rating: avgRating,
        reviewsCount: reviews.length,
      });

      res.status(201).json({

        success: true,

        message:
          "Review added successfully",

        payload:
          review,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET REVIEWS
==================================================
*/

userRoute.get(

  "/reviews/:productId",

  async (
    req,
    res,
    next
  ) => {

    try {

      const reviews =
        await ReviewModel.find({

          product:
            req.params.productId,
        })

          .populate(

            "user",

            "firstName lastName profileImageUrl"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({

        success: true,

        payload:
          reviews,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
ADD TO WISHLIST
==================================================
*/

userRoute.post(

  "/wishlist/:productId",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const userId =
        req.user.userId;

      const productId =
        req.params.productId;

      let wishlist =
        await WishlistModel.findOne({

          user: userId,
        });

      if (!wishlist) {

        wishlist =
          new WishlistModel({

            user: userId,

            products: [],
          });
      }

      const exists =
        wishlist.products.some(

          item =>

            item.toString()
            === productId
        );

      if (exists) {

        return res.status(400).json({

          success: false,

          message:
            "Already in wishlist",
        });
      }
const product =
  await ProductModel.findById(productId);

if (!product) {
  return res.status(404).json({
    success: false,
    message: "Product not found",
  });
}
      wishlist.products.push(
        productId
      );

      await wishlist.save();

      res.status(200).json({

        success: true,

        message:
          "Added to wishlist",

        payload:
          wishlist,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
GET WISHLIST
==================================================
*/

userRoute.get(

  "/wishlist",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const wishlist =
        await WishlistModel.findOne({

          user:
            req.user.userId,
        }).populate(
          "products"
        );

      res.status(200).json({

        success: true,

        payload:
          wishlist,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
REMOVE FROM WISHLIST
==================================================
*/

userRoute.delete(

  "/wishlist/:productId",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const wishlist =
        await WishlistModel.findOne({

          user:
            req.user.userId,
        });

      if (!wishlist) {

        return res.status(404).json({

          success: false,

          message:
            "Wishlist not found",
        });
      }

      wishlist.products =
        wishlist.products.filter(

          item =>

            item.toString()
            !==
            req.params.productId
        );

      await wishlist.save();

      res.status(200).json({

        success: true,

        message:
          "Removed from wishlist",

        payload:
          wishlist,
      });

    } catch (err) {

      next(err);
    }
  }
);

/*
==================================================
CREATE RAZORPAY ORDER
==================================================
*/

userRoute.post(

  "/create-order",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const { amount } =
        req.body;

      const options = {

        amount:
          amount * 100,

        currency:
          "INR",

        receipt:
          `receipt_${Date.now()}`,
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.status(200).json({

        success: true,

        payload:
          order,
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

userRoute.post(

  "/verify-payment",

  verifyToken(
  "USER",
  "ARTISAN",
  "ADMIN"
),

  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

      } = req.body;

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

      res.status(200).json({

        success: true,

        message:
          "Payment verified successfully",
      });

    } catch (err) {

      next(err);
    }
  }
);

