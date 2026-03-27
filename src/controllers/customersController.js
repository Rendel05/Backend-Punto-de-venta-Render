import {
  getCustomerInfo,
  addNewCustomer,
  updateCustomerPassword,
  updateCustomerInfo,
  deleteCustomer,
  checkAliasExists,
  checkEmailExists
} from '../models/customerModel.js'
import db from '../config/db.js'


export const getCustomer = async (req, res) => {

  try {

    const { id } = req.params

    const customer = await getCustomerInfo(id)

    if (!customer) {
      return res.status(404).json({ message: 'Cliente no encontrado' })
    }

    res.json(customer)

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: 'Error obteniendo cliente' })

  }

}


export const createCustomer = async (req, res) => {
  const conn = await db.getConnection()

  try {
    const { nickname, password, name, last_name, e_mail, phone, address, birth_date } = req.body

    if (!nickname || !password || !name || !e_mail) {
      conn.release()
      return res.status(400).json({ message: 'Faltan campos obligatorios (nickname, password, name, e_mail)' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(e_mail)) {
      conn.release()
      return res.status(400).json({ message: 'Formato de email inválido' })
    }

    if (phone && !/^\d+$/.test(phone)) {
      conn.release()
      return res.status(400).json({ message: 'Teléfono inválido, solo números' })
    }

    const aliasUsed = await checkAliasExists(nickname)
    if (aliasUsed) {
      conn.release()
      return res.status(409).json({ message: 'El alias ya está en uso' })
    }

    const emailUsed = await checkEmailExists(e_mail)
    if (emailUsed) {
      conn.release()
      return res.status(409).json({ message: 'El email ya está registrado' })
    }

    await conn.beginTransaction()

    const user_id = await addNewCustomer(
      conn,
      nickname,
      password,
      name,
      last_name,
      e_mail,
      phone,
      address,
      birth_date
    )

    await conn.commit()

    res.status(201).json({
      message: 'Cliente registrado correctamente',
      user_id,
      rol: 'Cliente'
    })

  } catch (error) {
    await conn.rollback()
    console.error(error)
    res.status(500).json({ message: 'Error creando cliente' })
  } finally {
    conn.release()
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

    if (!nickname || !e_mail) {
      return res.status(400).json({ message: 'Faltan datos obligatorios (nickname, e_mail)' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(e_mail)) {
      return res.status(400).json({ message: 'Formato de email inválido' })
    }

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
      res.json({ message: 'Cliente actualizado correctamente' })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: 'Error actualizando cliente' })

  }

}


export const changeCustomerPassword = async (req, res) => {

  try {

    const { id } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'La nueva contraseña es obligatoria' })
    }

    const result = await updateCustomerPassword(id, password)

    if (result > 0) {
      res.json({ message: 'Contraseña actualizada correctamente' })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: 'Error actualizando contraseña' })

  }

}


export const removeCustomer = async (req, res) => {

  try {

    const { id } = req.params

    const result = await deleteCustomer(id)

    if (result > 0) {
      res.json({ message: 'Cliente eliminado correctamente' })
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' })
    }

  } catch (error) {

    console.error(error)
    res.status(500).json({ message: 'Error eliminando cliente' })

  }

}
