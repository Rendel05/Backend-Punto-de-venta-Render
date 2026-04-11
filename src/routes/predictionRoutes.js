import express from 'express';
import { getSummary, getPrediction } from '../controllers/predictionController.js';

const router = express.Router();

router.get('/prediction/resumen', getSummary);
router.post('/prediction', getPrediction);

export default router;