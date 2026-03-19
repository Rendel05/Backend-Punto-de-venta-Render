import express from 'express'
import {
  getUsers,
  createUser,
  getUser,
  changeStatus,
  editUser
} from '../controllers/userController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/users', verifyToken, getUsers)
router.get('/users/:id', verifyToken, getUser)
router.post('/users', verifyToken, createUser)
router.put('/users/:id', verifyToken, editUser)
router.put('/users/:id/status', verifyToken, changeStatus)

export default router
