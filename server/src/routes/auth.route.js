import express from 'express';
import { register, login, updateVendorProfile, getProfile, becomeVendor } from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register)
router.post("/login", login);
router.get("/profile", authenticate, getProfile);
router.post("/become-vendor", authenticate, becomeVendor);
router.put("/vendor/profile", authenticate, updateVendorProfile);

export default router;