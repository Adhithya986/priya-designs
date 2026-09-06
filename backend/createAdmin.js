const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminEmail = "admin@priyadesigns.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists.");

      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    await User.create({
      name: "Priya Designs Admin",
      email: adminEmail,
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin account created");
    console.log("Email:", adminEmail);
    console.log("Password: Admin@123");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Failed to create admin");
    console.error(error.message);

    process.exit(1);
  }
}

createAdmin();