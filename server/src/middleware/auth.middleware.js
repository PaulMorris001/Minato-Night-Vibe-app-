import jwt from "jsonwebtoken";
import config from "../config/env.js";

// Required authentication - user must be logged in
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = { id: decoded.id };
  } catch {
    // invalid token — continue without auth
  }

  next();
}
