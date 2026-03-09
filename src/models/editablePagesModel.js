    import db from '../config/db.js'

    export const getAllPages = async () =>{
        const [rows] = await db.query(
            `SELECT * FROM paginas_estaticas`
        )
        return rows
    }

    export const getContentPages = async (page_id) =>{
        const [rows] = await db.query (
            `SELECT * from pagina_contenidos WHERE pagina_id = ? ORDER BY orden DESC`,[page_id]
        )
        return rows
    }

    export const editContent = async (content,id) => {
        const [result] = await db.query(
            `UPDATE pagina_contenidos SET contenido = ? WHERE id=?`,[content,id]
        )
        return result.affectedRows
    }

    export const createNewContent = async (page_id,content,order) =>{
        const [result] = await db.query(
            `INSERT INTO pagina_contenidos(pagina_id, contenido, orden) VALUES (?,?,?)`,
             [page_id,content,order]
        )
    }

    export const deleteContent = async (id) => {
        const [result] = await db.query(
            `DELETE FROM pagina_contenidos WHERE id = ?`, [id]
        )
        return result.affectedRows
    }