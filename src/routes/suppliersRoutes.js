import express from 'express'
import { getSuppliers } from '../controllers/suppliersController.js'

const router = express.Router()

router.get('/suppliers', getSuppliers)

export default router