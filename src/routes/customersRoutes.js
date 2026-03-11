import express from 'express'

import {
  getCustomer,
  createCustomer,
  editCustomer,
  changeCustomerPassword,
  removeCustomer
} from '../controllers/customersController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/customers/:id', getCustomer)

router.post('/customers', verifyToken, createCustomer)

router.put('/customers/:id', verifyToken, editCustomer)

router.put('/customers/:id/password', verifyToken, changeCustomerPassword)

router.delete('/customers/:id', verifyToken, removeCustomer)

export default router
