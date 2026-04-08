import express from 'express'
import {
  getProducts,
  getActiveProducts,
  getProductsByCategory,
  getPopularProductsC,
  getProduct,
  createProduct,
  editProduct,
  changeProductStatus,
  searchProduct
} from '../controllers/productsController.js'
import upload from '../middlewares/upload.js'
import { uploadToCloudinary } from '../middlewares/cloudinaryUpload.js'
import { verifyToken,authorizeRoles } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post(
  '/products',
  verifyToken,authorizeRoles('Admin'),
  upload.single('image'),
  uploadToCloudinary,
  createProduct
);

router.put(
  '/products/:id',
  verifyToken,authorizeRoles('Admin'),
  upload.single('image'),
  uploadToCloudinary,
  editProduct
);

router.get('/products',verifyToken,authorizeRoles('Admin'), getProducts)
router.get('/products/active', getActiveProducts)
router.get('/products/search', searchProduct)
router.get('/products/popular', getPopularProductsC)
router.get('/products/category/:id', getProductsByCategory)
router.get('/products/:id', getProduct)

router.post('/products',verifyToken,authorizeRoles('Admin'), createProduct)
router.put('/products/:id',verifyToken,authorizeRoles('Admin'), editProduct)
router.put('/products/:id/status',verifyToken,authorizeRoles('Admin'),changeProductStatus);

export default router
