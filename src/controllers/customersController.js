import {
  getCustomerInfo,
  addNewCustomer,
  updateCustomerPassword,
  updateCustomerInfo,
  deleteCustomer
} from '../models/customerModel.js'


export const getCustomer = async (req, res) => {

  try {

    const { id } = req.params

    const customer = await getCustomerInfo(id)

    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" })
    }

    res.json(customer)

  } catch (error) {

    res.status(500).json({ message: "Error obteniendo cliente" })

  }

}


export const createCustomer = async (req, res) => {

  try {

    const {
      nickname,
      password,
      name,
      last_name,
      e_mail,
      phone,
      address,
      birth_date
    } = req.body

    const user_id = await addNewCustomer(
      nickname,
      password,
      name,
      last_name,
      e_mail,
      phone,
      address,
      birth_date
    )

    res.status(201).json({
      message: "Cliente creado correctamente",
      user_id
    })

  } catch (error) {

    res.status(500).json({ message: "Error creando cliente" })

  }

}


export const editCustomer = async (req, res) => {

  try {

    const { id } = req.params

    const {
      nickname,
      name,
      last_name,
      phone,
      e_mail,
      address,
      birth_date
    } = req.body

    const result = await updateCustomerInfo(
      nickname,
      name,
      last_name,
      phone,
      e_mail,
      address,
      birth_date,
      id
    )

    if (result > 0) {
      res.json({ message: "Cliente actualizado correctamente" })
    } else {
      res.status(404).json({ message: "Cliente no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error actualizando cliente" })

  }

}


export const changeCustomerPassword = async (req, res) => {

  try {

    const { id } = req.params
    const { password } = req.body

    const result = await updateCustomerPassword(id, password)

    if (result > 0) {
      res.json({ message: "Contraseña actualizada correctamente" })
    } else {
      res.status(404).json({ message: "Cliente no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error actualizando contraseña" })

  }

}


export const removeCustomer = async (req, res) => {

  try {

    const { id } = req.params

    const result = await deleteCustomer(id)

    if (result > 0) {
      res.json({ message: "Cliente eliminado correctamente" })
    } else {
      res.status(404).json({ message: "Cliente no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error eliminando cliente" })

  }

}