import express from 'express'
import {
  getUsers,
  createUser,
  getUser,
  removeUser,
  editUser
} from '../controllers/userController.js'

const router = express.Router()

router.get('/users', getUsers)
router.get('/users/:id', getUser)
router.post('/users', createUser)
router.put('/users/:id', editUser)
router.delete('/users/:id', removeUser)

export default router