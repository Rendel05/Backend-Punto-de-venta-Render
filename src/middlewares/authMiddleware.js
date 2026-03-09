import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(403).json({ message: 'Token requerido' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(403).json({ message: 'Token inválido' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({ message: 'Token inválido' })
        }

        req.user = user

        next()
    })
}