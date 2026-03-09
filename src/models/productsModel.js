import db from '../config/db.js'

export const getAllProducts = async (page, limit) => {
  const offset = (page - 1) * limit

  const [rows] = await db.query(
    "SELECT * FROM productos LIMIT ? OFFSET ?",
    [limit, offset]
  )

  const [[{ total }]] = await db.query(
    "SELECT COUNT(*) as total FROM productos"
  )

  return {
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const getProductByCategory  = async(page, limit, category) => {
    const offset = (page - 1) * limit
    const [rows] = await db.query(
    "SELECT * FROM productos WHERE categoria_id = ? LIMIT ? OFFSET ?",
    [category, limit, offset]
  )

  const [[{ total }]] = await db.query(
    "SELECT COUNT(*) as total FROM productos WHERE categoria_id = ?",[category]
  )

  return {
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const getProductById = async(id) => {
    const [rows] = await db.query(
        "SELECT * FROM productos WHERE producto_id = ?",[id]
    )
    return rows[0]
}

export const addProduct = async (name,code,description,buy_price,sell_price,stock,cat_id,supp_id,status,image_id,public_image_id) => {

    const [result] = await db.query(
        `INSERT INTO productos
        (nombre, codigo, descripcion, precio_compra, precio_venta,
        stock, categoria_id, proveedor_id, fecha_creacion,
        activo, imagen_url, imagen_public_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
        [
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
        ]
    )
    return result.affectedRows
}

export const updateProduct = async(id,name,code,description,buy_price,sell_price,stock,cat_id,supp_id,status,image_id,public_image_id) => {
    const [result] = await db.query(
        `UPDATE productos SET nombre = ?, codigo = ?, descripcion = ?, precio_compra = ?, precio_venta= ?,stock =?,categoria_id = ?,proveedor_id=?,activo=?,imagen_url=?,imagen_public_id=? WHERE producto_id = ?`
        ,[name,code,description,buy_price,sell_price,stock,cat_id,supp_id,status,image_id,public_image_id,id]
    )
    return result.affectedRows
}

export const deleteProduct = async(id) => {
    const [result] = await db.query(
        `UPDATE productos SET activo = 0 WHERE producto_id = ?`,
        [id]
    )
    return result.affectedRows
}

export const searchProducts = async(search, page, limit) =>{
    const searchTerm = `%${search}%`
    const offset = (page - 1) * limit

    const [rows] = await db.query(
    `SELECT p.*, c.nombre AS categoria
    FROM productos p
    INNER JOIN categorias c 
        ON p.categoria_id = c.categoria_id
    WHERE (
        p.nombre LIKE ?
        OR p.descripcion LIKE ?
        OR c.nombre LIKE ?
    )
    ORDER BY p.nombre ASC
    LIMIT ? OFFSET ?`,
    [searchTerm, searchTerm, searchTerm, limit, offset]
    )
    return rows
}