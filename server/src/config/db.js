import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDB() {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("✅ Database Connected Successfully");
    console.log(`📊 Connected to: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Error connecting to the database:");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
  }
}