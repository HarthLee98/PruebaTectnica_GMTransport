require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authenticateToken = require('./middleware/authenticateToken')
const userRoutes = require('./controllers/user') // Importa el controlador directamente como rutas
const routeRoutes = require('./controllers/route') // Importa el controlador
const boothRoutes = require('./controllers/booth')

const app = express()

// Configurar lista de orígenes permitidos
const appOrigins = (process.env.APP_URL || 'http://localhost:3000').split(',')

// Middleware de CORS con validación dinámica de origen
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || appOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('No autorizado por CORS'))
      }
    },
  })
)

// Middleware para JSON
app.use(express.json())

// Registrar rutas directamente
app.use('/user', userRoutes)
app.use('/route', routeRoutes)
app.use('/booth', boothRoutes)

app.use('/api', authenticateToken)

// Puerto desde las variables de entorno
const PORT = process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('API funcionando correctamente')
})

app.listen(PORT, () => {
  console.log(
    `Servidor corriendo en ${process.env.API_URL || `http://localhost:${PORT}`}`
  )
})
