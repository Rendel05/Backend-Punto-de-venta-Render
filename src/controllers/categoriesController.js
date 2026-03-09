import { getAllCategoriesNames } from '../models/categoriesModel.js'

export const getCategories = async (req, res) => {
    try {
        const categories = await getAllCategoriesNames()
        res.status(200).json(categories)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al obtener las categorías'
        })
    }
}