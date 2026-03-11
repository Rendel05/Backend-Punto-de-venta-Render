import express from 'express'
import {
  getOffers,
  getActiveOffersController,
  updateOfferController,
  createOffer
} from '../controllers/offersController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/offers', getOffers)
router.get("/active", getActiveOffersController);

router.post('/offers', verifyToken, createOffer)
router.put("/:id", verifyToken,updateOfferController);


export default router
