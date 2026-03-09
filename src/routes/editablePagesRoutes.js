import express from 'express'

import {
  getPages,
  getPageContent,
  createContent,
  updateContent,
  removeContent
} from '../controllers/editablePagesController.js'

const router = express.Router()

router.get('/pages', getPages)

router.get('/pages/:id', getPageContent)

router.post('/pages/content', createContent)

router.put('/pages/content/:id', updateContent)

router.delete('/pages/content/:id', removeContent)

export default router