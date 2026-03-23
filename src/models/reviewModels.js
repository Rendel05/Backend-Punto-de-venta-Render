import db from '../config/db.js'

export const getAllReviews = async(id) => {
    const [rows] = await db.query (`
        SELECT r.*, CONCAT(c.nombre, ' ', c.apellido)AS usuario FROM resenas r INNER JOIN clientes c ON r.cliente_id = c.usuario_id  WHERE producto_id = ?  ORDER BY r.fecha DESC
    `,[id])
    
    const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total FROM resenas WHERE producto_id = ?`,
    [id])

    const [[{ average }]] = await db.query(
    `SELECT ROUND(AVG(calificacion),1) as average FROM resenas WHERE producto_id = ?`,
    [id]
  )
    return{
        data:rows,
        total,
        average
    }
}

export const postReview = async (product_id, customer_id, comentary, rating) =>{
    const [result] = await db.query(
        `INSERT INTO resenas (producto_id,cliente_id, comentario, calificacion) VALUES (?,?,?,?)`                                                                                                                                                                                                                                                                                                                                                                               ,
        [product_id,customer_id,comentary,rating]
    )
    return result.affectedRows
}

export const deleteReview = async (review_id, customer_id) =>{
    const [result] = await db.query(
        `DELETE from resenas WHERE resena_id = ? AND cliente_id =?`,
        [review_id,customer_id]
    )
    return result.affectedRows
}