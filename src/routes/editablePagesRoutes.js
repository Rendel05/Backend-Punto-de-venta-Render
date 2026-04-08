import express from 'express'

import {
  getPages,
  getPageContent,
  createContent,
  updateContent,
  removeContent
} from '../controllers/editablePagesController.js'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/pages', getPages)

router.get('/pages/:id', getPageContent)

router.post('/pages/content',verifyToken,authorizeRoles('Admin'), createContent)

router.put('/pages/content/:id',verifyToken,authorizeRoles('Admin'), updateContent)

router.delete('/pages/content/:id',verifyToken,authorizeRoles('Admin'), removeContent)

export default router
