import express from "express";
import { getReviews, createReview, removeReview } from "../controllers/reviewsController.js";
import { verifyToken,authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/reviews/:id", getReviews);


router.post("/reviews",verifyToken,authorizeRoles('Cliente'), createReview);


router.delete("/reviews/:id",verifyToken,authorizeRoles('Cliente'), removeReview);

export default router;