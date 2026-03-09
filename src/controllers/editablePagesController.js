import {
  getAllPages,
  getContentPages,
  editContent,
  createNewContent,
  deleteContent
} from '../models/editablePagesModel.js'


export const getPages = async (req, res) => {

  try {

    const pages = await getAllPages()

    res.json(pages)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener páginas" })

  }

}


export const getPageContent = async (req, res) => {

  try {

    const { id } = req.params

    const content = await getContentPages(id)

    res.json(content)

  } catch (error) {

    res.status(500).json({ message: "Error al obtener contenido de la página" })

  }

}


export const createContent = async (req, res) => {

  try {

    const {
      page_id,
      content,
      order
    } = req.body

    const result = await createNewContent(
      page_id,
      content,
      order
    )

    if (result > 0) {
      res.status(201).json({ message: "Contenido creado correctamente" })
    } else {
      res.status(400).json({ message: "No se pudo crear el contenido" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al crear contenido" })

  }

}


export const updateContent = async (req, res) => {

  try {

    const { id } = req.params
    const { content } = req.body

    const result = await editContent(content, id)

    if (result > 0) {
      res.json({ message: "Contenido actualizado correctamente" })
    } else {
      res.status(404).json({ message: "Contenido no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al actualizar contenido" })

  }

}


export const removeContent = async (req, res) => {

  try {

    const { id } = req.params

    const result = await deleteContent(id)

    if (result > 0) {
      res.json({ message: "Contenido eliminado correctamente" })
    } else {
      res.status(404).json({ message: "Contenido no encontrado" })
    }

  } catch (error) {

    res.status(500).json({ message: "Error al eliminar contenido" })

  }

}