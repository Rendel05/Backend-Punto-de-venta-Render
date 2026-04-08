import express from 'express'
import { createCashCut,getTransactions } from "../controllers/cashOutController.js";
import { verifyToken,authorizeRoles } from "../middlewares/authMiddleware.js";


const router = express.Router()


router.post('/cashOut',verifyToken,authorizeRoles('Admin'),createCashCut)
router.get('/cashOut',verifyToken,authorizeRoles('Admin'),getTransactions)

export default router