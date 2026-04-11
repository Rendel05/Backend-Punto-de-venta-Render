import db from '../config/db.js'

export const predictionModel = {
  async getResumenHistorico() {
    const [rows] = await db.query(`
      SELECT DATE_FORMAT(fecha_registro, '%Y-%m') AS mes,
             COUNT(*) AS nuevos
      FROM clientes
      GROUP BY mes
      ORDER BY mes ASC
    `);
    return rows;
  },

  async getTotalClientes() {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM clientes');
    return total;
  }
};