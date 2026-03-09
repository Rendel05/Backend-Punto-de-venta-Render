import db from '../config/db.js'

export const getLatestSales = async (id, days = 2) => {
    const [rows] = await db.query(
        `SELECT * FROM ventas 
         WHERE usuario_id = ? 
         AND fecha_hora >= DATE_SUB(NOW(), INTERVAL ? DAY)
         ORDER BY fecha_hora DESC
         LIMIT 50`,
        [id, days]
    )
    return rows
}

export const getLatestWithdrawals = async (id, days = 2) => {
    const [rows] = await db.query(
        `SELECT * FROM retiros_caja 
         WHERE usuario_id = ? 
         AND fecha_hora >= DATE_SUB(NOW(), INTERVAL ? DAY)
         ORDER BY fecha_hora DESC
         LIMIT 50`,
        [id, days]
    )
    return rows
}

