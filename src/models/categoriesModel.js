import db from '../config/db.js'

export const getAllCategoriesNames = async ()=>{
    const [rows]= await db.query('SELECT * FROM categorias')
    return rows
}
