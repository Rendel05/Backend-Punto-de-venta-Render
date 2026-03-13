import express from 'express'
import {
  getProducts,
  getProductsByCategory,
  getPopularProductsC,
  getProduct,
  createProduct,
  editProduct,
  removeProduct,
  searchProduct
} from '../controllers/productsController.js'
import upload from '../middlewares/upload.js'
import { uploadToCloudinary } from '../middlewares/cloudinaryUpload.js'
import { verifyToken } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post(
  '/products',
  verifyToken,
  upload.single('image'),
  uploadToCloudinary,
  createProduct
)
router.get('/products', getProducts)
router.get('/products/search', searchProduct)
router.get('/products/popular', getPopularProductsC)
router.get('/products/category/:id', getProductsByCategory)
router.get('/products/:id', getProduct)

router.post('/products', verifyToken, createProduct)
router.put('/products/:id', verifyToken, editProduct)
router.delete('/products/:id', verifyToken, removeProduct)

export default router
