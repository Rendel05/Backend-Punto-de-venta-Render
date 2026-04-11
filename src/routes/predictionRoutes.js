import express from 'express';
import { getSummary, getPrediction } from '../controllers/predictionController.js';
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/prediction/resumen',verifyToken,authorizeRoles('Admin'), getSummary);
router.post('/prediction',verifyToken,authorizeRoles('Admin'), getPrediction);

export default router;