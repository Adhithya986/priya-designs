const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Priya Designs Backend is Running!",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working successfully!",
  });
});

// MongoDB Connection
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
  }
}

startServer();