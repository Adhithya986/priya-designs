const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");

const {
  authenticateToken,
  optionalAuth,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   GET ALL ORDERS
   ADMIN ONLY
   GET /api/orders
========================================================= */

router.get(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Get all orders error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }
  }
);


/* =========================================================
   GET MY ORDERS
   LOGGED-IN CUSTOMER
   GET /api/orders/my-orders
========================================================= */

router.get(
  "/my-orders",
  authenticateToken,
  async (req, res) => {
    try {
      const orders = await Order.find({
        userId: req.user.userId,
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Get my orders error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch your orders",
      });
    }
  }
);


/* =========================================================
   GET SINGLE ORDER
   GET /api/orders/:id
========================================================= */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error("Get single order error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to fetch order",
      });
    }
  }
);


/* =========================================================
   CREATE ORDER + REDUCE STOCK
   LOGGED-IN CUSTOMER ONLY
   POST /api/orders
========================================================= */

router.post(
  "/",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        customer,
        items,
        totalAmount,
        paymentMethod,
      } = req.body;

      // Get logged-in user's ID from JWT
      const userId = req.user.userId;


      /* -----------------------------------------------------
         VALIDATE CUSTOMER DETAILS
      ----------------------------------------------------- */

      if (
        !customer ||
        !customer.name ||
        !customer.phone ||
        !customer.address ||
        !customer.city ||
        !customer.pincode
      ) {
        return res.status(400).json({
          success: false,
          message: "Customer details are required",
        });
      }


      /* -----------------------------------------------------
         VALIDATE ORDER ITEMS
      ----------------------------------------------------- */

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Order must contain at least one product",
        });
      }


      /* -----------------------------------------------------
         VALIDATE TOTAL AMOUNT
      ----------------------------------------------------- */

      if (
        totalAmount === undefined ||
        totalAmount === null ||
        Number(totalAmount) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order amount",
        });
      }


      /* -----------------------------------------------------
         CHECK STOCK FOR EVERY PRODUCT
      ----------------------------------------------------- */

      for (const item of items) {
        if (!item.productId || !item.quantity) {
          return res.status(400).json({
            success: false,
            message: "Invalid product information",
          });
        }

        const product = await Product.findById(
          item.productId
        );

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${
              item.name || item.productId
            }`,
          });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.stock} ${product.name} available in stock.`,
          });
        }
      }


      /* -----------------------------------------------------
         REDUCE PRODUCT STOCK
      ----------------------------------------------------- */

      for (const item of items) {
        const product = await Product.findById(
          item.productId
        );

        if (product) {
          product.stock -= Number(item.quantity);

          await product.save();
        }
      }


      /* -----------------------------------------------------
         CREATE ORDER
      ----------------------------------------------------- */

      const order = await Order.create({
        userId,
        customer,
        items,
        totalAmount: Number(totalAmount),
        paymentMethod:
          paymentMethod || "Cash on Delivery",
      });


      /* -----------------------------------------------------
         SEND RESPONSE
      ----------------------------------------------------- */

      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
      });

    } catch (error) {
      console.error("Create order error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }
  }
);


/* =========================================================
   UPDATE ORDER STATUS
   ADMIN ONLY
   PUT /api/orders/:id
========================================================= */

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;


      /* -----------------------------------------------------
         ALLOWED ORDER STATUSES
      ----------------------------------------------------- */

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];


      /* -----------------------------------------------------
         VALIDATE STATUS
      ----------------------------------------------------- */

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status",
        });
      }


      /* -----------------------------------------------------
         UPDATE ORDER
      ----------------------------------------------------- */

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );


      /* -----------------------------------------------------
         CHECK ORDER EXISTS
      ----------------------------------------------------- */

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }


      /* -----------------------------------------------------
         SEND RESPONSE
      ----------------------------------------------------- */

      res.json({
        success: true,
        message: "Order status updated successfully",
        order,
      });

    } catch (error) {
      console.error("Update order error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update order",
      });
    }
  }
);


/* =========================================================
   EXPORT ROUTER
========================================================= */

module.exports = router;