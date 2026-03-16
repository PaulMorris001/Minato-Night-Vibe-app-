import express from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favorites.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/favorites", authenticate, getFavorites);
router.post("/favorites/:eventId", authenticate, addFavorite);
router.delete("/favorites/:eventId", authenticate, removeFavorite);

export default router;
