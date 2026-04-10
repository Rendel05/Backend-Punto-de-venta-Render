import db from "../config/db.js";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const mpWebhook = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { type, data } = req.body;


    if (type !== "payment") {
      return res.sendStatus(200);
    }

    const paymentId = data.id;

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    const status = paymentInfo.status;
    const ventaId = paymentInfo.external_reference;

    if (!ventaId) {
      throw new Error("No hay referencia de venta");
    }

    await connection.beginTransaction();

    const [ventas] = await connection.query(
      "SELECT * FROM ventas_online WHERE venta_id = ?",
      [ventaId]
    );

    if (ventas.length === 0) {
      throw new Error("Venta no encontrada");
    }

    if (ventas[0].estado === "aprobado") {
      await connection.commit();
      return res.sendStatus(200);
    }

    if (status === "approved") {
      const [detalles] = await connection.query(
        "SELECT * FROM detalle_ventas_online WHERE venta_id = ?",
        [ventaId]
      );

      for (const item of detalles) {
        const [producto] = await connection.query(
          "SELECT stock FROM productos WHERE producto_id = ?",
          [item.producto_id]
        );

        if (producto[0].stock < item.cantidad) {
          throw new Error("Stock insuficiente al confirmar");
        }
      }

      for (const item of detalles) {
        await connection.query(
          "UPDATE productos SET stock = stock - ? WHERE producto_id = ?",
          [item.cantidad, item.producto_id]
        );
      }

      await connection.query(
        `UPDATE ventas_online 
         SET estado = ?, metodo_pago = ?, referencia_pago = ?
         WHERE venta_id = ?`,
        ["aprobado", "mercadopago", paymentId, ventaId]
      );

    } else if (status === "rejected") {
      await connection.query(
        "UPDATE ventas_online SET estado = ? WHERE venta_id = ?",
        ["rechazado", ventaId]
      );

    } else {
      await connection.query(
        "UPDATE ventas_online SET estado = ? WHERE venta_id = ?",
        ["pendiente", ventaId]
      );
    }

    await connection.commit();

    res.sendStatus(200);

  } catch (error) {
    await connection.rollback();
    console.error(error);

    res.sendStatus(500);
  } finally {
    connection.release();
  }
};