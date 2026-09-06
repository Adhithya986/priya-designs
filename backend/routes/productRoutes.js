const express = require("express");
const Product = require("../models/Product");



const router = express.Router();
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/authMiddleware");

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
});

// ADD product
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      image,
      badge,
      stock,
      description,
    } = req.body;

    if (!name || !category || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, category, price and image are required",
      });
    }

    const product = await Product.create({
      name,
      category,
      price,
      image,
      badge,
      stock,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
});

// UPDATE product
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});

// DELETE product
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});

module.exports = router;