import express from "express";
import {
  getAllCities,
  getVendorTypesByCity,
  getVendorsByCityAndType,
  getAllVendorTypes,
} from "../controllers/vendors.controller.js";

const router = express.Router();

router.get("/cities", getAllCities);

router.get("/vendor-types", getAllVendorTypes);

router.get("/cities/:cityId/vendor-types", getVendorTypesByCity);

router.get("/cities/:cityId/vendors/:vendorTypeId", getVendorsByCityAndType);

export default router;