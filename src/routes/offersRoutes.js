import express from 'express'
import {
  getOffers,
  getActiveOffersController,
  updateOfferController,
  changeStatus,
  createOffer,
  getOffer
} from '../controllers/offersController.js'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/offers',verifyToken,authorizeRoles('Admin'), getOffers)
router.get("/offers/active", getActiveOffersController);

router.get('/offers/:id',verifyToken,authorizeRoles('Admin'),getOffer)
router.post('/offers', verifyToken,authorizeRoles('Admin'), createOffer)
router.put("/offers/:id",verifyToken,authorizeRoles('Admin'),updateOfferController);
router.put('/offers/:id/status',verifyToken,authorizeRoles('Admin'), changeStatus);


export default router
