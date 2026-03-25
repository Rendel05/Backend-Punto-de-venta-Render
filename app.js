import express from 'express'
import cors from "cors"

import suppliersRoutes from './src/routes/suppliersRoutes.js'
import reviewsRoutes from './src/routes/reviewsRoutes.js'
import categoriesRoutes from './src/routes/categoriesRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import productsRoutes from './src/routes/productsRoutes.js'
import offersRoutes from './src/routes/offersRoutes.js'
import pagesRoutes from './src/routes/editablePagesRoutes.js'
import cashierRoutes from './src/routes/cashierRoutes.js'
import cashOutRoutes from './src/routes/cashOutRoutes.js'
import customersRoutes from './src/routes/customersRoutes.js'

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api', suppliersRoutes)
app.use('/api', reviewsRoutes)
app.use('/api', categoriesRoutes)
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', productsRoutes)
app.use('/api', offersRoutes)
app.use('/api', pagesRoutes)
app.use('/api', cashierRoutes)
app.use('/api',cashOutRoutes)
app.use('/api',customersRoutes)

export default app