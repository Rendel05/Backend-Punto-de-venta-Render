import db from '../config/db.js'

export const getAllOffers = async(page=1 ,limit=10 ) =>{
    const offset = (page - 1) * limit
    const [rows] = await db.query(
    "SELECT o.*,p.nombre FROM ofertas o INNER JOIN productos p ON o.producto_id = p.producto_id LIMIT ? OFFSET ?",
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

export const updateOfferStatus = async (id, estado) => {
  const [result] = await db.query(
    `UPDATE ofertas SET activo = ? WHERE oferta_id = ?`,
    [estado, id]
  );

  return result.affectedRows;
};

export const addNewOffer = async (product_id,offer_price,start_date,end_date) =>{
    const [result] = await db.query(
        `INSERT INTO ofertas (producto_id,precio_oferta, fecha_inicio, fecha_fin, activo) VALUES (?,?,?,?,1)`
        ,[product_id,offer_price,start_date,end_date]
    )
    return result.affectedRows
}

export const getActiveOffers = async () => {

  const query = `
    SELECT 
        o.oferta_id,
        o.producto_id,
        o.precio_oferta,
        o.fecha_inicio,
        o.fecha_fin,
        p.nombre,
        p.precio_venta,
        p.imagen_url
    FROM ofertas o
    INNER JOIN productos p 
        ON o.producto_id = p.producto_id
    WHERE 
        o.activo = 1
        AND p.activo = 1
        AND CURDATE() BETWEEN o.fecha_inicio AND o.fecha_fin
    ORDER BY o.fecha_fin ASC
    LIMIT 20
  `;

  const [rows] = await db.query(query);

  return rows;

}

export const getOfferById = async (offer_id) => {
  const [rows] = await db.query(
    `SELECT * FROM ofertas WHERE oferta_id = ?`,[offer_id]
  );
  return rows[0];
}

export const updateOffer = async (
  offer_id,
  product_id,
  offer_price,
  start_date,
  end_date,
  active
) => {

  const [result] = await db.query(
    `UPDATE ofertas 
     SET producto_id = ?, 
         precio_oferta = ?, 
         fecha_inicio = ?, 
         fecha_fin = ?, 
         activo = ?
     WHERE oferta_id = ?`,
    [product_id, offer_price, start_date, end_date, active, offer_id]
  );

  return result.affectedRows;

}

