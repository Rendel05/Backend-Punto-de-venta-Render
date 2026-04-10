import db from '../config/db.js'

export const getOrders = async (user_id, order = 'DESC', limit = 10) => {

    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const [rows] = await db.query(
        `
        SELECT venta_id, total, fecha, estado
        FROM ventas_online v
        INNER JOIN clientes c ON v.cliente_id = c.cliente_id
        WHERE c.usuario_id = ?
        ORDER BY fecha ${safeOrder}
        LIMIT ?;
        `,
        [user_id, limit]
    )

    return rows;
}

export const getDetailOrders = async(user_id,order_id)=>{
    const [result] = await db.query(`
        SELECT 
        v.venta_id,
        v.total,
        v.fecha,
        v.referencia_pago,
        dv.cantidad,
        dv.subtotal,
        p.producto_id,
        p.nombre,
        p.imagen_url
        FROM ventas_online v
        INNER JOIN clientes c ON v.cliente_id = c.cliente_id
        INNER JOIN detalle_ventas_online dv ON dv.venta_id = v.venta_id
        INNER JOIN productos p ON p.producto_id = dv.producto_id
        WHERE c.usuario_id = ?
        AND v.venta_id = ? AND v.estado='aprobado';
        `,[user_id,order_id])

    const rows = result; 

    if (rows.length === 0) return null;

    const venta = {
    venta_id: rows[0].venta_id,
    fecha: rows[0].fecha,
    total: rows[0].total,
    referencia: rows[0].referencia_pago,
    productos: []
    };
    rows.forEach(row => {
    venta.productos.push({
        id:row.producto_id,
        nombre: row.nombre,
        cantidad: row.cantidad,
        precio: row.subtotal,
        imagen_url: row.imagen_url
    })
    })

return venta;
}