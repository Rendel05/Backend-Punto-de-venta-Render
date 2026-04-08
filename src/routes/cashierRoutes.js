import express from 'express'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'

import {
  getSales,
  getWithdrawals
} from '../controllers/cashierController.js'

const router = express.Router()


router.get('/cashier/:id/sales',verifyToken,authorizeRoles('Cajero'), getSales)

router.get('/cashier/:id/withdrawals',verifyToken,authorizeRoles('Cajero'), getWithdrawals)


export default router