import express from 'express'
import { getUserOrders,getUserOrderById } from '../controllers/ordersController';
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware';

const router = express.Router()

router.get('/orders', verifyToken,authorizeRoles('Cliente'), getUserOrders);
router.get('/orders/:id', verifyToken,authorizeRoles('Cliente'), getUserOrderById);

export default router