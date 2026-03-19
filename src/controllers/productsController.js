import {
  getAllProducts,
  getAllActiveProducts,
  getProductByCategory,
  getPopularProducts,
  getProductById,
  addProduct,
  updateProduct,
  updateProductStatus,
  searchProducts
} from '../models/productsModel.js'
import cloudinary from '../config/cloudinary.js'


export const getProducts = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const products = await getAllProducts(page, limit)

    res.json(products)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener productos" })

  }

}

export const getActiveProducts = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const products = await getAllActiveProducts(page, limit)

    res.json(products)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener productos" })

  }

}


export const getPopularProductsC = async (req, res) => {

  try {

    const products = await getPopularProducts()

    res.json(products)

  } catch (error) {

    res.status(500).json({ message: "Error obteniendo productos populares" })

  }

}

export const getProductsByCategory = async (req, res) => {

  try {

    const category = req.params.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const products = await getProductByCategory(page, limit, category)

    res.json(products)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener productos por categoría" })

  }

}


export const getProduct = async (req, res) => {

  try {

    const { id } = req.params

    const product = await getProductById(id)

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    res.json(product)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener producto" })

  }

}


export const createProduct = async (req, res) => {

  try {

    const {
      name,
      code,
      description,
      buy_price,
      sell_price,
      stock,
      cat_id,
      supp_id,
      status
    } = req.body

    const image_url = req.image_url || null
    const public_id = req.image_public_id || null

    const result = await addProduct(
      name,
      code,
      description,
      buy_price,
      sell_price,
      stock,
      cat_id,
      supp_id,
      status,
      image_url,
      public_id
    )

    if (result > 0) {
      res.status(201).json({ message: "Producto creado correctamente" })
    } else {
      res.status(400).json({ message: "No se pudo crear el producto" })
    }

  } catch (error) {
  console.error(error)
  
  if (req.image_public_id) {
    try {
      await cloudinary.uploader.destroy(req.image_public_id)
    } catch (e) {
      console.error("Error eliminando imagen:", e)
    }
  }

  res.status(500).json({ message: "Error al crear producto" })
}

}


export const editProduct = async (req, res) => {

  try {

    const { id } = req.params

    const {
      name,
      code,
      description,
      buy_price,
      sell_price,
      stock,
      cat_id,
      supp_id,
      status,
      image_id,
      public_image_id
    } = req.body

    let image_url = image_id
    let public_id = public_image_id

    if (req.image_url) {

      if (public_image_id) {
        await cloudinary.uploader.destroy(public_image_id)
      }

      image_url = req.image_url
      public_id = req.image_public_id
    }

    const result = await updateProduct(
      id,
      name,
      code,
      description,
      buy_price,
      sell_price,
      stock,
      cat_id,
      supp_id,
      status,
      image_url,
      public_id
    )

    if (result > 0) {
      res.json({ message: "Producto actualizado correctamente" })
    } else {
      res.status(404).json({ message: "Producto no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al actualizar producto" })

  }

}


export const changeProductStatus = async (req, res) => {

try {
        const { id } = req.params
        const { activo } = req.body

        if (activo !== 0 && activo !== 1) {
          return res.status(400).json({
              message: 'Estado inválido'
          });
      }

        const affectedRows = await updateProductStatus(id, activo);

        if (affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            })
        }

        res.json({
            message: 'Estado actualizado correctamente'
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error en el servidor'
        })
    }
}


export const searchProduct = async (req, res) => {

  try {

    const search = req.query.search || ""
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const products = await searchProducts(search, page, limit)

    res.json(products)

  } catch (error) {

    res.status(500).json({ message: "Error al buscar productos" })

  }

}