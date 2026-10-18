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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
const path = require("path");
const fs = require("fs");

const distPath = path.join(__dirname, "../dist");
const hasFrontendBuild = fs.existsSync(distPath);

if (hasFrontendBuild) {
  app.use(express.static(distPath));
} else {
  // Test route when running backend independently without frontend build
  app.get("/", (req, res) => {
    res.json({
      message: "🚀 Priya Designs Backend is Running!",
    });
  });
}

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working successfully!",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// SPA fallback: send index.html for all non-API GET requests if frontend is built
if (hasFrontendBuild) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start Server and Connect to MongoDB
async function startServer() {
  // Start HTTP server first so Render port binding succeeds
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI environment variable is missing!");
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET environment variable is not set. Authentication will fail!");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    console.error("👉 Please verify your MONGO_URI in Render's Environment settings and ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.");
  }
}

startServer();