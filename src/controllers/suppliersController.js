import { getAllSuppliers } from '../models/supplierModel.js'

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await getAllSuppliers()
        res.status(200).json(suppliers)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error al obtener los proveedores'
        })
    }
}