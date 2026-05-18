import express from "express";
import {
  createBooking,
  getClientBookings,
  getVendorBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Auth is applied per-route — NOT via `router.use(authenticate)` at the top.
// Router-level auth would 401 every request passing through this router,
// including ones destined for other routers mounted later at "/api/".
router.post("/bookings", authenticate, createBooking);
router.get("/bookings/client", authenticate, getClientBookings);
router.patch("/bookings/:id/cancel", authenticate, cancelBooking);

router.get("/bookings/vendor", authenticate, getVendorBookings);
router.patch("/bookings/:id/status", authenticate, updateBookingStatus);

export default router;
