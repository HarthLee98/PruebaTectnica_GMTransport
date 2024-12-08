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

router.post('/update_route', authenticateToken, async (req, res) => {
  try {
    let item = req.body

    // Verifica si se proporcionó el ID de la ruta
    if (!item.id) {
      return res
        .status(400)
        .json({ message: 'El ID de la ruta es obligatorio.' })
    }

    // Busca la ruta que se desea actualizar
    const route = await Route.findOne({ where: { id: item.id } })

    if (!route) {
      return res.status(404).json({ message: 'La ruta no existe.' })
    }

    // Verifica si el código ya está en uso por otra ruta
    if (item.code !== route.code) {
      const existingRoute = await Route.findOne({ where: { code: item.code } })
      if (existingRoute) {
        return res.status(409).json({
          message: 'El código de ruta ya está registrado por otra ruta.',
        })
      }
    }

    // Actualiza la ruta en la base de datos
    await route.update({ code: item.code, name: item.name })

    // Respuesta exitosa
    return res.status(200).json({
      message: 'Ruta actualizada exitosamente.',
      route,
    })
  } catch (error) {
    console.error('Error al actualizar la ruta:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para obtener todas las rutas
router.get('/get_routes', authenticateToken, async (req, res) => {
  try {
    const routes = await Route.findAll() // Obtener todas las rutas de la tabla
    return res.status(200).json(routes)
  } catch (error) {
    console.error('Error al obtener rutas:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

module.exports = router
