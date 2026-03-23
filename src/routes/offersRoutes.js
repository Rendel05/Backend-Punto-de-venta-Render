import express from 'express'
import {
  getOffers,
  getActiveOffersController,
  updateOfferController,
  changeStatus,
  createOffer,
  getOffer
} from '../controllers/offersController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/offers',verifyToken, getOffers)
router.get("/offers/active", getActiveOffersController);

router.get('/offers/:id',verifyToken,getOffer)
router.post('/offers', verifyToken, createOffer)
router.put("/offers/:id", verifyToken,updateOfferController);
router.put('/offers/:id/status', verifyToken, changeStatus);


export default router
