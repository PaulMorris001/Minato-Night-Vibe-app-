import mongoose from "mongoose";
import config from "./env.js";

export default async function connectDB() {
  try {
    await mongoose.connect(config.database.uri, config.database.options);
    console.log("✅ Database Connected Successfully");
    console.log(`📊 Connected to: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ Error connecting to the database:");
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);
  }
}