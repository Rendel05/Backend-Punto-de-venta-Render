import express from 'express'
import {
  getOffers,
  getActiveOffersController,
  updateOfferController,
  createOffer
} from '../controllers/offersController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/offers',verifyToken, getOffers)
router.get("/offers/active", getActiveOffersController);

router.post('/offers', verifyToken, createOffer)
router.put("/:id", verifyToken,updateOfferController);


export default router
