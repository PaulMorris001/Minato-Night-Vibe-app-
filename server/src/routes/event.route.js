import express from "express";
import {
  createEvent,
  getUserEvents,
  getEventById,
  getEventByShareToken,
  updateEvent,
  deleteEvent,
  inviteUserByUsername,
  joinEventByShareLink
} from "../controllers/event.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new event
router.post("/events", authenticate, createEvent);

// Get all events for the authenticated user
router.get("/events", authenticate, getUserEvents);

// Get a specific event by ID
router.get("/events/:eventId", authenticate, getEventById);

// Get event by share token (public access for sharing)
router.get("/events/share/:shareToken", getEventByShareToken);

// Update an event
router.put("/events/:eventId", authenticate, updateEvent);

// Delete an event
router.delete("/events/:eventId", authenticate, deleteEvent);

// Invite user by username
router.post("/events/:eventId/invite", authenticate, inviteUserByUsername);

// Join event via share link
router.post("/events/share/:shareToken/join", authenticate, joinEventByShareLink);

export default router;
