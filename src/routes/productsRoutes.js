import express from 'express'
import {
  getProducts,
  getProductsByCategory,
  getProduct,
  createProduct,
  editProduct,
  removeProduct,
  searchProduct
} from '../controllers/productsController.js'
import upload from '../middlewares/upload.js'
import { uploadToCloudinary } from '../middlewares/cloudinaryUpload.js'


const router = express.Router()


router.post(
  '/products',
  upload.single('image'),
  uploadToCloudinary,
  createProduct
)
router.get('/products', getProducts)
router.get('/products/search', searchProduct)
router.get('/products/category/:id', getProductsByCategory)
router.get('/products/:id', getProduct)

router.post('/products', createProduct)
router.put('/products/:id', editProduct)
router.delete('/products/:id', removeProduct)

export default router