import express from "express";
import { getReviews, createReview, removeReview } from "../controllers/reviewsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.get("/reviews/:id", getReviews);


router.post("/reviews", verifyToken, createReview);


router.delete("/reviews/:id", verifyToken, removeReview);

export default router;