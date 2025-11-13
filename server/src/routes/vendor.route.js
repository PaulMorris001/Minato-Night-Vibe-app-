import express from "express";
import { 
  getAllCities,
  getVendorTypesByCity,
  getVendorsByCityAndType,
} from "../controllers/vendor.controller.js";

const router = express.Router();

router.get("/cities", getAllCities);

router.get("/cities/:cityId/vendor-types", getVendorTypesByCity);

router.get("/cities/:cityId/vendors/:vendorTypeId", getVendorsByCityAndType);

export default router;