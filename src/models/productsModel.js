import db from '../config/db.js'

export const getAllProducts = async (page, limit) => {
  const offset = (page - 1) * limit
  const [rows] = await db.query("SELECT * FROM productos LIMIT ? OFFSET ?", [limit, offset])
  const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM productos")

  return {
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}


export const getAllActiveProducts = async (page, limit) => {
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT * FROM vw_productos_con_oferta 
     WHERE activo = 1 
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM productos WHERE activo = 1")

  return {
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const getProductByCategory = async (page, limit, category) => {
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT * FROM vw_productos_con_oferta 
     WHERE categoria_id = ? AND activo = 1 
     LIMIT ? OFFSET ?`,
    [category, limit, offset]
  )

  const [[{ total }]] = await db.query(
    "SELECT COUNT(*) as total FROM productos WHERE categoria_id = ? AND activo = 1",
    [category]
  )

  return {
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}

export const getProductById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM vw_productos_con_oferta 
     WHERE producto_id = ? AND activo = 1`,
    [id]
  )
  return rows
}

export const searchProducts = async (search, page, limit) => {
  const searchTerm = `%${search}%`;
  const offset = (page - 1) * limit;

  const [rows] = await db.query(
    `SELECT * FROM vw_productos_con_oferta 
     WHERE (nombre LIKE ? OR descripcion LIKE ? OR categoria_nombre LIKE ?)
     AND activo = 1
     ORDER BY nombre ASC
     LIMIT ? OFFSET ?`,
    [searchTerm, searchTerm, searchTerm, limit, offset]
  );

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total FROM vw_productos_con_oferta 
     WHERE (nombre LIKE ? OR descripcion LIKE ? OR categoria_nombre LIKE ?)
     AND activo = 1`,
    [searchTerm, searchTerm, searchTerm]
  )

  return {
    data: rows,
    totalPages: Math.ceil(total / limit)
  }
}

export const getPopularProducts = async () => {
  const query = `
    SELECT 
        v.*, 
        COUNT(dv.producto_id) AS totalVentas
    FROM vw_productos_con_oferta v
    LEFT JOIN detalle_ventas dv ON dv.producto_id = v.producto_id
    WHERE v.activo = 1
    GROUP BY v.producto_id
    ORDER BY totalVentas DESC
    LIMIT 10`;

  const [rows] = await db.query(query);
  return rows;
}

export const addProduct = async (name,code,description,buy_price,sell_price,stock,cat_id,supp_id,status,image_id,public_image_id) => {
    const [result] = await db.query(
        `INSERT INTO productos
        (nombre, codigo, descripcion, precio_compra, precio_venta,
        stock, categoria_id, proveedor_id, fecha_creacion,
        activo, imagen_url, imagen_public_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
        [name, code, description, buy_price, sell_price, stock, cat_id, supp_id, status, image_id, public_image_id]
    )
    return result.affectedRows
}

export const updateProduct = async(id,name,code,description,buy_price,sell_price,stock,cat_id,supp_id,status,image_id,public_image_id) => {
    const [result] = await db.query(
        `UPDATE productos SET nombre = ?, codigo = ?, descripcion = ?, precio_compra = ?, precio_venta= ?,stock =?,categoria_id = ?,proveedor_id=?,activo=?,imagen_url=?,imagen_public_id=? WHERE producto_id = ?`,
        [name,code,description,buy_price,sell_price,stock,cat_id,supp_id,status,image_id,public_image_id,id]
    )
    return result.affectedRows
}

export const updateProductStatus = async (id, estado) => {
    const [result] = await db.query(`UPDATE productos SET activo = ? WHERE producto_id = ?`, [estado, id])
    return result.affectedRows;
}