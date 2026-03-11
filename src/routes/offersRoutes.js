import express from 'express'
import {
  getOffers,
  createOffer
} from '../controllers/offersController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/offers', getOffers)

router.post('/offers', verifyToken, createOffer)

export default router
