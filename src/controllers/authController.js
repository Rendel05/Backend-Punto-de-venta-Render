import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getUserByNickname } from '../models/authModel.js'

export const login = async (req, res) => {

    try {

        const { nickname, password } = req.body

        const user = await getUserByNickname(nickname)

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        if (user.activo === 0) {
            return res.status(403).json({
                message: "Usuario desactivado"
            })
        }

        const validPassword = await bcrypt.compare(password, user.password_hash)

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        const token = jwt.sign(
            {
                id: user.usuario_id,
                nickname: user.alias,
                rol: user.rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )

        res.json({
            message: 'Login exitoso',
            token
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            message: 'Error en login'
        })

    }
}