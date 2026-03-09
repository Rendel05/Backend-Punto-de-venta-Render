import express from 'express'
import { getCategories } from '../controllers/categoriesController.js'

const router = express.Router()

router.get('/categories', getCategories)

export default router