import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { OrderModel } from "../models/OrderModel.js";
import { ProductModel } from "../models/ProductModel.js";

export const mockPaymentRoute = exp.Router();

// Create a mock order (no real payment gateway)
mockPaymentRoute.post(
  "/mock-create-order",
  verifyToken("USER"),
  async (req, res, next) => {
    try {
      const { products, totalAmount } = req.body;
      // Simple stock validation (reuse logic from real payment API)
      for (let item of products) {
        const product = await ProductModel.findById(item.product);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (item.quantity > product.stock) {
          return res.status(400).json({ success: false, message: `${product.title} has insufficient stock` });
        }
      }
      // Create a dummy order with status PENDING
      const newOrder = new OrderModel({
        user: req.user.userId,
        products,
        totalAmount,
        paymentStatus: "PENDING",
        orderStatus: "PLACED",
      });
      await newOrder.save();
      res.status(200).json({ success: true, message: "Mock order created", payload: { orderId: newOrder._id } });
    } catch (err) {
      next(err);
    }
  }
);

// Verify mock payment (simply mark as PAID)
mockPaymentRoute.post(
  "/mock-verify-payment",
  verifyToken("USER"),
  async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      order.paymentStatus = "PAID";
      order.orderStatus = "PLACED";
      await order.save();
      res.status(200).json({ success: true, message: "Mock payment verified", payload: order });
    } catch (err) {
      next(err);
    }
  }
);
