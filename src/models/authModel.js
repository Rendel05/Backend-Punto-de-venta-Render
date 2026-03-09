import db from '../config/db.js'

export const getUserByNickname = async (nickname) => {
    const [rows] = await db.query(
        'SELECT * FROM usuarios WHERE alias = ?',
        [nickname]
    )

    return rows[0]
}