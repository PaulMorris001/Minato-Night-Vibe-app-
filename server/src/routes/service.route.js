import express from "express";
import {
  getVendorServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getVendorStats,
  getServicesByVendorId
} from "../controllers/service.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.get("/vendors/:vendorId/services", getServicesByVendorId);

// Protected routes. Auth is applied per-route — NOT via `router.use(authenticate)`
// at the top of this file. The router-level form would 401 on every request
// passing through here (including ones bound for other routers mounted later
// at "/api/"), because Express runs router middleware before deciding whether
// any of this router's routes actually match.
router.get("/vendor/stats", authenticate, getVendorStats);
router.get("/vendor/services", authenticate, getVendorServices);
router.get("/vendor/services/:id", authenticate, getServiceById);
router.post("/vendor/services", authenticate, createService);
router.put("/vendor/services/:id", authenticate, updateService);
router.delete("/vendor/services/:id", authenticate, deleteService);

export default router;
