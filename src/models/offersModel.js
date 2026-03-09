import db from '../config/db.js'

export const getAllOffers = async(page=1 ,limit=10 ) =>{
    const offset = (page - 1) * limit
    const [rows] = await db.query(
    "SELECT * FROM ofertas LIMIT ? OFFSET ?",
    [limit, offset]
  )

  const [[{ total }]] = await db.query(
    "SELECT COUNT(*) as total FROM ofertas"
  )

  return {
    data: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  }
}     

export const addNewOffer = async (product_id,offer_price,start_date,end_date) =>{
    const [result] = await db.query(
        `INSERT INTO ofertas (producto_id,precio_oferta, fecha_inicio, fecha_fin, activo) VALUES (?,?,?,?,1)`
        ,[product_id,offer_price,start_date,end_date]
    )
    return result.affectedRows
}
