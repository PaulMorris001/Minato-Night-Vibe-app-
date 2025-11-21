import express from "express";
import {
  getVendorServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getVendorStats
} from "../controllers/service.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Dashboard statistics
router.get("/vendor/stats", getVendorStats);

// Service CRUD operations
router.get("/vendor/services", getVendorServices);
router.get("/vendor/services/:id", getServiceById);
router.post("/vendor/services", createService);
router.put("/vendor/services/:id", updateService);
router.delete("/vendor/services/:id", deleteService);

export default router;
