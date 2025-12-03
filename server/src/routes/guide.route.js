import express from "express";
import {
  createGuide,
  getGuides,
  getUserGuides,
  getGuideById,
  updateGuide,
  deleteGuide,
  purchaseGuide,
  getPurchasedGuides,
  getTopics
} from "../controllers/guide.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes - MUST come before :id routes
router.get("/guides/topics", getTopics);
router.get("/guides", getGuides);

// Protected routes - require authentication
router.get("/guides/my-guides", authenticate, getUserGuides);
router.get("/guides/purchased", authenticate, getPurchasedGuides);
router.post("/guides", authenticate, createGuide);
router.get("/guides/:id", authenticate, getGuideById);
router.put("/guides/:id", authenticate, updateGuide);
router.delete("/guides/:id", authenticate, deleteGuide);
router.post("/guides/:id/purchase", authenticate, purchaseGuide);

export default router;
