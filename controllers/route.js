const express = require('express')
const router = express.Router()
const models = require('../models')
const authenticateToken = require('../middleware/authenticateToken')

const Route = models.route

// Endpoint para crear una ruta
router.post('/create_route', authenticateToken, async (req, res) => {
  try {
    let item = req.body

    const existingRoute = await Route.findOne({ where: { code: item.code } })
    if (existingRoute) {
      return res
        .status(409)
        .json({ message: 'El código de ruta ya está registrado.' })
    }

    // Crea la nueva ruta en la base de datos
    const newRoute = await Route.create(item)

    // Respuesta exitosa
    return res.status(201).json({
      message: 'Ruta creada exitosamente.',
      route: newRoute,
    })
  } catch (error) {
    console.error('Error al crear la ruta:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

module.exports = router
