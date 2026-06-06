import exp from "express";

import { register }
from "../services/authService.js";

import { ProductModel }
from "../models/ProductModel.js";

import { UserTypeModel }
from "../models/UserModel.js";

import { verifyToken }
from "../middlewares/verifyToken.js";

import { upload }
from "../config/multer.js";

import cloudinary
from "../config/cloudinary.js";

import {
  uploadToCloudinary,
} from "../config/cloudinaryUpload.js";

import { OrderModel }
from "../models/OrderModel.js";

export const artisanRoute =
  exp.Router();



/*
====================================================
REGISTER ARTISAN
POST => /artisan-api/users
====================================================
*/

artisanRoute.post(

  "/users",

  upload.single("profileImageUrl"),

  async (req, res, next) => {

    let cloudinaryResult;

    try {

      let userObj = req.body;

      /*
      ====================================
      UPLOAD PROFILE IMAGE
      ====================================
      */

      if (req.file) {

        cloudinaryResult =
          await uploadToCloudinary(
            req.file.buffer
          );
      }

      /*
      ====================================
      REGISTER ARTISAN
      ====================================
      */

      const newUserObj =
        await register({

          ...userObj,

          role: "ARTISAN",

          profileImageUrl:
            cloudinaryResult?.secure_url,
        });

      res.status(201).json({

        success: true,

        message:
          "Artisan registered successfully",

        payload: newUserObj,
      });

    } catch (err) {

      /*
      ====================================
      DELETE IMAGE IF ERROR
      ====================================
      */

      if (cloudinaryResult?.public_id) {

        await cloudinary.uploader.destroy(
          cloudinaryResult.public_id
        );
      }

      next(err);
    }
  }
);



/*
====================================================
ADD PRODUCT
POST => /artisan-api/products
====================================================
*/

artisanRoute.post(

  "/products",

  verifyToken("ARTISAN"),

  upload.single("image"),

  async (req, res, next) => {

    let cloudinaryResult;

    try {
      const artisanUser = await UserTypeModel.findById(req.user.userId);
      if (!artisanUser || !artisanUser.isArtisanApproved) {
        return res.status(403).json({
          success: false,
          message: "Your artisan profile is pending approval. You cannot add products yet."
        });
      }

      let product = req.body;

      /*
      ====================================
      VALIDATE STOCK
      ====================================
      */

      if (product.stock < 0) {

        return res.status(400).json({

          success: false,

          message:
            "Stock cannot be negative",
        });
      }

      /*
      ====================================
      UPLOAD PRODUCT IMAGE
      ====================================
      */

      if (req.file) {

        cloudinaryResult =
          await uploadToCloudinary(
            req.file.buffer
          );
      }

      /*
      ====================================
      ATTACH ARTISAN & IMAGE
      ====================================
      */

      product.artisan =
        req.user.userId;

      product.image =
        cloudinaryResult?.secure_url;

      /*
      ====================================
      CREATE PRODUCT
      ====================================
      */

      const newProductDoc =
        new ProductModel(product);

      const createdProduct =
        await newProductDoc.save();

      res.status(201).json({

        success: true,

        message:
          "Product added successfully",

        payload: createdProduct,
      });

    } catch (err) {

      /*
      ====================================
      ROLLBACK IMAGE
      ====================================
      */

      if (cloudinaryResult?.public_id) {

        await cloudinary.uploader.destroy(
          cloudinaryResult.public_id
        );
      }

      next(err);
    }
  }
);



/*
====================================================
GET PRODUCTS OF LOGGED-IN ARTISAN
GET => /artisan-api/my-products
====================================================
*/

artisanRoute.get(

  "/my-products",

  verifyToken("ARTISAN"),

  async (req, res, next) => {

    try {

      const artisanId =
        req.user.userId;

      const products =
        await ProductModel.find({

          artisan: artisanId,
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
====================================================
GET SINGLE PRODUCT
GET => /artisan-api/products/:productId
====================================================
*/

artisanRoute.get(

  "/products/:productId",

  async (req, res, next) => {

    try {

      const { productId } =
        req.params;

      const product =
        await ProductModel.findById(
          productId
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

        payload: product,
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
====================================================
GET PRODUCTS
SEARCH + FILTER + SORT + PAGINATION
GET => /artisan-api/products
====================================================
*/

artisanRoute.get(

  "/products",

  async (req, res, next) => {

    try {

      const {

        search,

        category,

        minPrice,

        maxPrice,

        sort,

        page = 1,

        limit = 10,
      } = req.query;

      /*
      ====================================
      FILTER OBJECT
      ====================================
      */

      let filter = {

        isAvailable: true,
      };

      /*
      ====================================
      SEARCH FILTER
      ====================================
      */

      if (search) {

        filter.title = {

          $regex: search,

          $options: "i",
        };
      }

      /*
      ====================================
      CATEGORY FILTER
      ====================================
      */

      if (category) {

        filter.category =
          category;
      }

      /*
      ====================================
      PRICE FILTER
      ====================================
      */

      if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice) {

          filter.price.$gte =
            Number(minPrice);
        }

        if (maxPrice) {

          filter.price.$lte =
            Number(maxPrice);
        }
      }

      /*
      ====================================
      SORTING
      ====================================
      */

      let sortOption = {};

      if (sort === "price_asc") {

        sortOption.price = 1;
      }

      else if (
        sort === "price_desc"
      ) {

        sortOption.price = -1;
      }

      else if (
        sort === "latest"
      ) {

        sortOption.createdAt = -1;
      }

      /*
      ====================================
      PAGINATION
      ====================================
      */

      const skip =
        (page - 1) * limit;

      /*
      ====================================
      FETCH PRODUCTS
      ====================================
      */

      const products =
        await ProductModel.find(filter)

          .populate(
            "artisan",
            "firstName lastName profileImageUrl"
          )

          .sort(sortOption)

          .skip(skip)

          .limit(Number(limit));

      /*
      ====================================
      TOTAL PRODUCTS
      ====================================
      */

      const totalProducts =
        await ProductModel.countDocuments(
          filter
        );

      res.status(200).json({

        success: true,

        currentPage:
          Number(page),

        totalPages:
          Math.ceil(
            totalProducts / limit
          ),

        totalProducts,

        payload: products,
      });

    } catch (err) {

      next(err);
    }
  }
);



/*
====================================================
UPDATE PRODUCT
PUT => /artisan-api/products/:productId
====================================================
*/

artisanRoute.put(

  "/products/:productId",

  verifyToken("ARTISAN"),

  upload.single("image"),

  async (req, res, next) => {

    let cloudinaryResult;

    try {
      const artisanUser = await UserTypeModel.findById(req.user.userId);
      if (!artisanUser || !artisanUser.isArtisanApproved) {
        return res.status(403).json({
          success: false,
          message: "Your artisan profile is pending approval. You cannot edit products yet."
        });
      }

      const artisan =
        req.user.userId;

      const productId =
        req.params.productId;

      /*
      ====================================
      FIND PRODUCT
      ====================================
      */

      const productOfDB =
        await ProductModel.findOne({

          _id: productId,

          artisan,
        });

      if (!productOfDB) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      /*
      ====================================
      UPLOAD NEW IMAGE
      ====================================
      */

      if (req.file) {

        cloudinaryResult =
          await uploadToCloudinary(
            req.file.buffer
          );
      }

      /*
      ====================================
      UPDATE DATA
      ====================================
      */

      const updatedData = {

        title:
          req.body.title,

        description:
          req.body.description,

        category:
          req.body.category,

        price:
          req.body.price,

        stock:
          req.body.stock,
      };

      /*
      ====================================
      UPDATE IMAGE
      ====================================
      */

      if (cloudinaryResult?.secure_url) {

        updatedData.image =
          cloudinaryResult.secure_url;
      }

      /*
      ====================================
      UPDATE PRODUCT
      ====================================
      */

      const updatedProduct =
        await ProductModel.findByIdAndUpdate(

          productId,

          {
            $set: updatedData,
          },

          {
            new: true,
          }
        );

      res.status(200).json({

        success: true,

        message:
          "Product updated successfully",

        payload: updatedProduct,
      });

    } catch (err) {

      if (cloudinaryResult?.public_id) {

        await cloudinary.uploader.destroy(
          cloudinaryResult.public_id
        );
      }

      next(err);
    }
  }
);



/*
====================================================
SOFT DELETE PRODUCT
PATCH => /artisan-api/products/:id/status
====================================================
*/

artisanRoute.patch(

  "/products/:id/status",

  verifyToken("ARTISAN"),

  async (req, res, next) => {

    try {
      const artisanUser = await UserTypeModel.findById(req.user.userId);
      if (!artisanUser || !artisanUser.isArtisanApproved) {
        return res.status(403).json({
          success: false,
          message: "Your artisan profile is pending approval. You cannot change product availability yet."
        });
      }

      const { id } =
        req.params;

      const { isAvailable } =
        req.body;

      /*
      ====================================
      FIND PRODUCT
      ====================================
      */

      const product =
        await ProductModel.findById(id);

      if (!product) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",
        });
      }

      /*
      ====================================
      OWNERSHIP CHECK
      ====================================
      */

      if (

        product.artisan.toString()
        !== req.user.userId

      ) {

        return res.status(403).json({

          success: false,

          message:
            "You can modify only your own products",
        });
      }

      /*
      ====================================
      UPDATE STATUS
      ====================================
      */

      product.isAvailable =
        isAvailable;

      await product.save();

      res.status(200).json({

        success: true,

        message:
          `Product ${
            isAvailable
              ? "enabled"
              : "disabled"
          } successfully`,

        payload: product,
      });

    } catch (err) {

      next(err);
    }
  }
);

artisanRoute.get(

  "/dashboard",

  verifyToken("ARTISAN"),

  async (req, res, next) => {

    try {

      const artisanId =
        req.user.userId;

      /*
      ============================
      TOTAL PRODUCTS
      ============================
      */

      const totalProducts =
        await ProductModel.countDocuments({

          artisan: artisanId,

          isAvailable: true
        });

      /*
      ============================
      GET ARTISAN PRODUCTS
      ============================
      */

      const artisanProducts =
        await ProductModel.find({

          artisan: artisanId

        }).select("_id");

      const productIds =
        artisanProducts.map(
          product => product._id
        );

      /*
      ============================
      FIND ORDERS
      ============================
      */

      const orders =
        await OrderModel.find({

          "products.product": {
            $in: productIds
          }

        })

        .populate(
          "products.product"
        );

      /*
      ============================
      CALCULATE STATS
      ============================
      */

      let totalOrders = 0;

      let totalSales = 0;

      let totalRevenue = 0;

      orders.forEach(order => {

        totalOrders++;

        totalRevenue +=
          order.totalAmount;

        order.products.forEach(item => {

          if (

            item.product &&

            productIds.some(
              id =>
                id.toString() ===
                item.product._id.toString()
            )

          ) {

            totalSales +=
              item.quantity;
          }
        });
      });

      /*
      ============================
      RESPONSE
      ============================
      */

      res.status(200).json({

        success: true,

        payload: {

          totalProducts,

          totalOrders,

          totalSales,

          totalRevenue
        }
      });

    }

    catch (err) {

      next(err);
    }
  }
);

/*
====================================================
GET ORDERS OF LOGGED-IN ARTISAN
GET => /artisan-api/orders
====================================================
*/

artisanRoute.get(

  "/orders",

  verifyToken("ARTISAN"),

  async (req, res, next) => {

    try {

      const artisanId =
        req.user.userId;

      /*
      ====================================
      GET ARTISAN PRODUCTS
      ====================================
      */

      const artisanProducts =
        await ProductModel.find({

          artisan: artisanId

        }).select("_id");

      const productIds =
        artisanProducts.map(
          product => product._id
        );

      /*
      ====================================
      FIND ORDERS
      ====================================
      */

      const orders =
        await OrderModel.find({

          "products.product": {
            $in: productIds
          }

        })

        .populate(
          "user",
          "firstName lastName email"
        )

        .populate(
          "products.product",
          "title price image artisan"
        )

        .sort({
          createdAt: -1
        });

      /*
      ====================================
      KEEP ONLY THIS ARTISAN'S PRODUCTS
      ====================================
      */

      const filteredOrders =
        orders.map(order => {

          const artisanItems =
            order.products.filter(item =>

              item.product &&

              item.product.artisan.toString()
              === artisanId

            );

          return {

            _id:
              order._id,

            user:
              order.user,

            products:
              artisanItems,

            totalAmount:
              order.totalAmount,

            paymentStatus:
              order.paymentStatus,

            orderStatus:
              order.orderStatus,

            createdAt:
              order.createdAt
          };
        });

      res.status(200).json({

        success: true,

        totalOrders:
          filteredOrders.length,

        payload:
          filteredOrders
      });

    }

    catch (err) {

      next(err);
    }
  }
);
artisanRoute.get(
  "/sales-report",
  verifyToken("ARTISAN"),
  async (req, res, next) => {
    try {
      const artisanId = req.user.userId;

      const products = await ProductModel.find({
        artisan: artisanId,
      }).select("_id title price");

      const productIds = products.map(
        (product) => product._id
      );

      const orders = await OrderModel.find({
        "products.product": {
          $in: productIds,
        },
      }).populate(
        "products.product",
        "title price"
      );

      const report = [];

      orders.forEach((order) => {
        order.products.forEach((item) => {
          if (
            item.product &&
            productIds.some(
              (id) =>
                id.toString() ===
                item.product._id.toString()
            )
          ) {
            report.push({
              productName:
                item.product.title,
              quantity:
                item.quantity,
              price:
                item.product.price,
              total:
                item.quantity *
                item.product.price,
              orderDate:
                order.createdAt,
            });
          }
        });
      });

      res.status(200).json({
        success: true,
        payload: report,
      });
    } catch (err) {
      next(err);
    }
  }
);