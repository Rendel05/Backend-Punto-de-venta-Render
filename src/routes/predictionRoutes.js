import express from 'express';
import { getPrediction } from '../controllers/predictionController.js';
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/prediction',verifyToken, authorizeRoles('Admin'),getPrediction);

export default router;