import express from 'express'
import {
  getSales,
  getWithdrawals
} from '../controllers/cashierController.js'

const router = express.Router()


router.get('/cashier/:id/sales', getSales)

router.get('/cashier/:id/withdrawals', getWithdrawals)


export default router