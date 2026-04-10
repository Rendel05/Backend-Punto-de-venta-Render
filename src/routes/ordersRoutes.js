import express from 'express'
import { getUserOrders,getUserOrderById } from '../controllers/ordersController.js';
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.get('/orders', verifyToken,authorizeRoles('Cliente'), getUserOrders);
router.get('/orders/:id', verifyToken,authorizeRoles('Cliente'), getUserOrderById);

export default router