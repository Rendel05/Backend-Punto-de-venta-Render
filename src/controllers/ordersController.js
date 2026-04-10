import { getOrders, getOrderById } from '../models/ordersModel.js';

export const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { order = 'DESC', limit = 10 } = req.query;

    const orders = await getOrders(user_id, order, limit);

    if (!orders.length) {
      return res.status(200).json({
        message: 'No hay compras registradas',
        data: []
      });
    }

    res.json({
      data: orders
    });

  } catch (error) {
    console.error('Error en getUserOrders:', error);
    res.status(500).json({
      message: 'Error al obtener pedidos'
    });
  }
};



export const getUserOrderById = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const order = await getOrderById(user_id, id);

    if (!order) {
      return res.status(404).json({
        message: 'Pedido no encontrado'
      });
    }

    res.json(order);

  } catch (error) {
    console.error('Error en getUserOrderById:', error);
    res.status(500).json({
      message: 'Error al obtener el detalle del pedido'
    });
  }
};