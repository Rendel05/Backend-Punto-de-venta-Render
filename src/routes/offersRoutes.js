import express from 'express'
import {
  getOffers,
  createOffer
} from '../controllers/offersController.js'

const router = express.Router()

router.get('/offers', getOffers)

router.post('/offers', createOffer)

export default router