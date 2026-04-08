import express from 'express'
import { getSuppliers } from '../controllers/suppliersController.js'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/suppliers',verifyToken,authorizeRoles('Admin'), getSuppliers)

export default router