import express from 'express'
import {
  getUsers,
  createUser,
  getUser,
  removeUser,
  editUser
} from '../controllers/userController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.post('/users', verifyToken, createUser)
router.put('/users/:id', verifyToken, editUser)
router.delete('/users/:id', verifyToken, removeUser)

export default router
