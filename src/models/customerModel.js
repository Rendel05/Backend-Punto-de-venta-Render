import db from '../config/db.js'
import bcrypt from 'bcrypt'

export const getCustomerInfo =async (user_id) =>{
     const [rows] = await db.query(
    `SELECT u.alias, c.nombre, c.apellido, c.email,
            c.telefono, c.direccion, c.fecha_nacimiento, c.fecha_registro
     FROM usuarios u
     INNER JOIN clientes c ON u.usuario_id = c.usuario_id
     WHERE u.usuario_id = ?`,
    [user_id]
  )
  return rows[0] 
}

export const addNewCustomer= async (nickname,password,name,last_name,e_mail,phone,address,birth_date) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
        `INSERT INTO usuarios`
    )
}

export const updateCustomerPassword = async (user_id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await db.query(
        `UPDATE usuarios SET password_hash = ? WHERE usuario_id = ?`,
        [hashedPassword, user_id]
    )

    return result.affectedRows
}

export const updateCustomerInfo = async (nickname,name, last_name, phone, e_mail, address,birth_date,user_id) => {
    const [result1] = await db.query (
        `UPDATE usuarios SET alias=?`
    )
    const [result2]= await db.query(
        `UPDATE clientes SET nombre=?, apellido= ?, telefono=?, email=?, direccion=?, fecha_nacimiento=? WHERE usuario_id = ?`
        ,[name,last_name,phone,e_mail,address,birth_date,user_id]
    )
    return result1.affectedRows
}

export const deleteCustomer = async (user_id) =>{
    const [result] = await db.query(
        `UPDATE usuarios SET activo=0 WHERE usuario_id = ?`,[user_id] 
    )
    return result.affectedRows
}




