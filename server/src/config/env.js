/**
 * Environment Configuration
 * Centralized environment variable management
 * All environment variables should be accessed through this module
 */

import dotenv from "dotenv";

dotenv.config();

/**
 * Validates required environment variables
 * @throws {Error} if required variables are missing
 */
function validateEnv() {
  const required = ["MONGO_URI", "JWT_SECRET", "PORT"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Validate on module load
validateEnv();

/**
 * Environment configuration object
 */
export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "0.0.0.0",
    env: process.env.NODE_ENV || "development",
  },

  // Database Configuration
  database: {
    uri: process.env.MONGO_URI,
    options: {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },

  // Socket.IO Configuration
  socket: {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  },
};

export default config;
