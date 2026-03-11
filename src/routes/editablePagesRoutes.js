import express from 'express'

import {
  getPages,
  getPageContent,
  createContent,
  updateContent,
  removeContent
} from '../controllers/editablePagesController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/pages', getPages)

router.get('/pages/:id', getPageContent)

router.post('/pages/content', verifyToken, createContent)

router.put('/pages/content/:id', verifyToken, updateContent)

router.delete('/pages/content/:id', verifyToken, removeContent)

export default router
