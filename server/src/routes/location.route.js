import express from "express";
import {
  getCountries,
  getStates,
  getCities,
} from "../controllers/location.controller.js";

const router = express.Router();

// Public — location data source for pickers (proxied + cached CSC API)
router.get("/locations/countries", getCountries);
router.get("/locations/countries/:ciso/states", getStates);
router.get("/locations/countries/:ciso/states/:siso/cities", getCities);

export default router;
