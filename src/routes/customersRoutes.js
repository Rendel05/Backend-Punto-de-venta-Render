import express from 'express'

import {
  getCustomer,
  createCustomer,
  editCustomer,
  changeCustomerPassword,
  removeCustomer
} from '../controllers/customersController.js'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/customers', createCustomer)

router.get('/customers/:id',verifyToken,authorizeRoles('Cliente'), getCustomer)
router.put('/customers/:id',verifyToken,authorizeRoles('Cliente'), editCustomer)
router.put('/customers/:id/password',verifyToken,authorizeRoles('Cliente'), changeCustomerPassword)
router.delete('/customers/:id',verifyToken,authorizeRoles('Cliente'), removeCustomer)

export default router
