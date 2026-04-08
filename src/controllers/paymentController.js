import { MercadoPagoConfig, Preference } from "mercadopago";
import db from "../config/db.js";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const createPreference = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { carrito } = req.body;

    if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
      return res.status(400).json({ error: "Carrito inválido" });
    }


    const ids = carrito.map(p => p.producto_id);

    const [productosDB] = await connection.query(
      "SELECT producto_id, nombre, precio_final, stock FROM vw_productos_con_ofertas WHERE producto_id IN (?)",
      [ids]
    );


    const items = carrito.map(p => {
      const producto = productosDB.find(prod => prod.producto_id === p.producto_id);

      if (!producto) {
        throw new Error(`Producto no existe: ${p.producto_id}`);
      }

      if (p.cantidad > producto.stock) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      return {
        title: producto.nombre,
        quantity: Number(p.cantidad),
        unit_price: Number(producto.precio_final)
      };
    });


    const total = items.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    );


    await connection.beginTransaction();

    const [ventaResult] = await connection.query(
      `INSERT INTO ventas_online (cliente_id, total, estado)
       VALUES (?, ?, ?)`,
      [req.user.id, total, "pendiente"]
    );

    const ventaId = ventaResult.insertId;


    for (const p of carrito) {
      const producto = productosDB.find(prod => prod.producto_id === p.producto_id);

      const subtotal = producto.precio_final * p.cantidad;

      await connection.query(
        `INSERT INTO detalle_ventas_online 
        (venta_id, producto_id, cantidad, precio_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?)`,
        [
          ventaId,
          producto.producto_id,
          p.cantidad,
          producto.precio_final,
          subtotal
        ]
      );
    }

    await connection.commit();


    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items,
        external_reference: String(ventaId),
        back_urls: {
          success: "https://tiendaoly.grupoahost.com/pages/success.html",
          failure: "https://tiendaoly.grupoahost.com/pages/failure.html",
          pending: "https://tiendaoly.grupoahost.com/pages/pending.html"
        },
        auto_return: "approved"
      }
    });

    await connection.query(
      `UPDATE ventas_online SET referencia_pago = ? WHERE venta_id = ?`,
      [response.id, ventaId]
    );

    res.json({ init_point: response.init_point });

  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.status(400).json({
      error: error.message || "Error al procesar la compra"
    });

  } finally {
    connection.release();
  }
};