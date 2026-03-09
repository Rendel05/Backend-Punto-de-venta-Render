import {
  getAllUsers,
  addNewUser,
  getUserById,
  deleteUser,
  updateUser
} from '../models/userModel.js'


export const getUsers = async (req, res) => {
  try {

    const users = await getAllUsers()

    res.json(users)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener usuarios" })

  }
}


export const createUser = async (req, res) => {

  try {

    const { nickname, password, role, status } = req.body

    const result = await addNewUser(nickname, password, role, status)

    if (result > 0) {
      res.status(201).json({ message: "Usuario creado correctamente" })
    } else {
      res.status(400).json({ message: "No se pudo crear el usuario" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al crear usuario" })

  }
}


export const getUser = async (req, res) => {

  try {

    const { id } = req.params

    const user = await getUserById(id)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.json(user)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener usuario" })

  }
}


export const removeUser = async (req, res) => {

  try {

    const { id } = req.params

    const result = await deleteUser(id)

    if (result > 0) {
      res.json({ message: "Usuario desactivado correctamente" })
    } else {
      res.status(404).json({ message: "Usuario no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al eliminar usuario" })

  }
}


export const editUser = async (req, res) => {

  try {

    const { id } = req.params
    const { nickname, password, role, status } = req.body

    const result = await updateUser(nickname, password, role, status, id)

    if (result > 0) {
      res.json({ message: "Usuario actualizado correctamente" })
    } else {
      res.status(404).json({ message: "Usuario no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al actualizar usuario" })

  }
}