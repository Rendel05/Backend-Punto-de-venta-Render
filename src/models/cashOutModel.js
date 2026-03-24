import db from '../config/db.js'

export const existCashOut = async () => {
const [rows] = await db.query(`SELECT COUNT(*) AS total
    FROM corte_caja
    WHERE fecha = CURDATE()
  `)

return rows[0].total > 0
}


export const getBalance= async()=> {
    const [[{ sells }]] = await db.query(`
            SELECT fn_total_ventas_hoy() AS ventas;
        `)
    const [[{withdrawals}]] = await db.query(`
            SELECT fn_total_gastos_hoy() AS retiros;
        `)
    return {
        sells,
        withdrawals
    }
}

export const getAllTransactions = async () => {
    const [rows] = await db.query(`
        SELECT 
        'venta' AS tipo,
        total AS monto,
        fecha_hora,
        CONCAT('Venta #', venta_id) AS descripcion
        FROM ventas
        WHERE DATE(fecha_hora) = CURDATE()

        UNION ALL

        SELECT 
        'retiro' AS tipo,
        monto,
        fecha_hora,
        descripcion
        FROM retiros_caja
        WHERE DATE(fecha_hora) = CURDATE()

        ORDER BY fecha_hora DESC;
        `)

    return rows
}

export const createCashOut = async (id, init_balance, comments) => {
const [rows] = await db.query(`INSERT INTO corte_caja (
      fecha,
      usuario_id,
      hora_cierre,
      saldo_inicial,
      total_ventas,
      total_retiros,
      saldo_final,
      observaciones
    )
    VALUES (
      CURDATE(),
      ?,
      NOW(),
      ?,
      fn_total_ventas_hoy(),
      fn_total_gastos_hoy(),
      (? + fn_total_ventas_hoy() - fn_total_gastos_hoy()),
      ?
    )
  `, [id, init_balance, init_balance, comments])

return rows.affectedRows;
}
