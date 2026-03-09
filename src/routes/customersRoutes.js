import express from 'express'

import {
  getCustomer,
  createCustomer,
  editCustomer,
  changeCustomerPassword,
  removeCustomer
} from '../controllers/customersController.js'

const router = express.Router()


router.get('/customers/:id', getCustomer)

router.post('/customers', createCustomer)

router.put('/customers/:id', editCustomer)

router.put('/customers/:id/password', changeCustomerPassword)

router.delete('/customers/:id', removeCustomer)


export default router