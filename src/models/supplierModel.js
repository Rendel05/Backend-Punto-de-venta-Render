import db from '../config/db.js'

export const getAllSuppliers = async ()=>{
    const [rows]= await db.query('SELECT * FROM proveedores')
    return rows
}

