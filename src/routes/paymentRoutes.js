import express from "express";
import { createPreference } from "../controllers/paymentController.js";
import { verifyToken,authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-preference",verifyToken,authorizeRoles('Cliente'), createPreference);

export default router;