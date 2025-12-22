import jwt from "jsonwebtoken";
import config from "../config/env.js";

// Required authentication - user must be logged in
export function authenticate(req, res, next) {
  console.log("🔒 Auth middleware called for:", req.method, req.path);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No token provided for:", req.path);
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Optional authentication - attach user if token exists, but don't require it
export function optionalAuth(req, res, next) {
  console.log("🔓 Optional auth middleware called for:", req.method, req.path);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("ℹ️ No token provided, continuing without auth");
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = { id: decoded.id };
    console.log("✅ Token verified for user:", decoded.id);
  } catch (error) {
    console.log("⚠️ Invalid token, continuing without auth");
  }

  next();
}
