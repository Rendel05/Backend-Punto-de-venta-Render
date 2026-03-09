import {
  getLatestSales,
  getLatestWithdrawals
} from '../models/cashierModel.js'


export const getSales = async (req, res) => {

  try {

    const { id } = req.params
    const { days } = req.query

    const sales = await getLatestSales(id, days || 2)

    res.json(sales)

  } catch (error) {

    res.status(500).json({ message: "Error obteniendo ventas" })

  }

}


export const getWithdrawals = async (req, res) => {

  try {

    const { id } = req.params
    const { days } = req.query

    const withdrawals = await getLatestWithdrawals(id, days || 2)

    res.json(withdrawals)

  } catch (error) {

    res.status(500).json({ message: "Error obteniendo retiros" })

  }

}