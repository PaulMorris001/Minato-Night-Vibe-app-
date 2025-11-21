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

    if (error.code === 'ECONNREFUSED') {
      console.error("\n🔧 Troubleshooting steps:");
      console.error("1. Check your internet connection");
      console.error("2. Verify MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)");
      console.error("3. Check if your MongoDB Atlas cluster is active (not paused)");
      console.error("4. Verify your connection string in .env file");
    }

    // Don't exit process, let the app run without DB
    console.error("\n⚠️  Server will continue running but database operations will fail");
  }
}