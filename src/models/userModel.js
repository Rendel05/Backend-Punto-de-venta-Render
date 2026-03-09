import db from '../config/db.js'
import bcrypt from 'bcrypt'

export const getAllUsers = async ()=>{
    const [rows]= await db.query( "SELECT usuario_id, alias, rol, activo FROM usuarios WHERE rol = ? OR rol = ?",
    ['Admin', 'Cajero'])
    return rows
}

export const addNewUser = async (nickname, password,role, status)=>{
    const hashedPassword = await bcrypt.hash(password,10)  
    const [result]= await db.query( "INSERT INTO usuarios(alias,password_hash, rol, activo) VALUES(?,?,?,?)",
    [nickname,hashedPassword ,role, status])
    return result.affectedRows
}

export const getUserById = async (id) => {
    const [rows] = await db.query("Select usuario_id,alias, rol, activo FROM usuarios WHERE usuario_id = ?" ,[id])
    return rows[0]
}

export const deleteUser = async (id) => {
  const [result] = await db.query(
    "UPDATE usuarios SET activo = 0 WHERE usuario_id = ?",
    [id]
  )
  return result.affectedRows
}

export const updateUser = async (nickname, password, role, status, id) => {

  let query = "UPDATE usuarios SET alias = ?, rol = ?, activo = ?"
  let values = [nickname, role, status]

  if (password && password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(password, 10)
    query += ", password_hash = ?"
    values.push(hashedPassword)
  }

  query += " WHERE usuario_id = ?"
  values.push(id)

  const [result] = await db.query(query, values)

  return result.affectedRows
}

