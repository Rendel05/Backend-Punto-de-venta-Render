import express from 'express'
import { createCashCut,getTransactions } from "../controllers/cashOutController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";


const router = express.Router()


router.post('/cashOut',verifyToken,createCashCut)
router.get('/cashOut',verifyToken,getTransactions)

export default router