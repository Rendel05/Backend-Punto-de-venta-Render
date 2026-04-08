import express from 'express'
import {
  getUsers,
  createUser,
  getUser,
  changeStatus,
  editUser
} from '../controllers/userController.js'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/users',verifyToken,authorizeRoles('Admin'), getUsers)
router.get('/users/:id',verifyToken,authorizeRoles('Admin'), getUser)
router.post('/users',verifyToken,authorizeRoles('Admin'), createUser)
router.put('/users/:id',verifyToken,authorizeRoles('Admin'), editUser)
router.put('/users/:id/status',verifyToken,authorizeRoles('Admin'), changeStatus)

export default router
