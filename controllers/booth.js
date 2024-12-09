const express = require('express')
const router = express.Router()
const models = require('../models')
const authenticateToken = require('../middleware/authenticateToken')

const Booth = models.booth

// Endpoint para crear una caseta
router.post('/create_booth', authenticateToken, async (req, res) => {
  try {
    let item = req.body

    // Verificar si el código ya está registrado
    const existingBooth = await Booth.findOne({ where: { code: item.code } })
    if (existingBooth) {
      return res
        .status(409)
        .json({ message: 'El código de caseta ya está registrado.' })
    }

    // Crear la nueva caseta en la base de datos
    const newBooth = await Booth.create(item)

    // Respuesta exitosa
    return res.status(201).json({
      message: 'Caseta creada exitosamente.',
      booth: newBooth,
    })
  } catch (error) {
    console.error('Error al crear la caseta:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para actualizar una caseta
router.post('/update_booth', authenticateToken, async (req, res) => {
  try {
    let item = req.body

    // Verificar si se proporcionó el ID de la caseta
    if (!item.id) {
      return res
        .status(400)
        .json({ message: 'El ID de la caseta es obligatorio.' })
    }

    // Buscar la caseta que se desea actualizar
    const booth = await Booth.findOne({ where: { id: item.id } })
    if (!booth) {
      return res.status(404).json({ message: 'La caseta no existe.' })
    }

    // Verificar si el código ya está en uso por otra caseta
    if (item.code !== booth.code) {
      const existingBooth = await Booth.findOne({ where: { code: item.code } })
      if (existingBooth) {
        return res.status(409).json({
          message: 'El código de caseta ya está registrado por otra caseta.',
        })
      }
    }

    // Actualizar la caseta en la base de datos
    await booth.update({ code: item.code, name: item.name })

    // Respuesta exitosa
    return res.status(200).json({
      message: 'Caseta actualizada exitosamente.',
      booth,
    })
  } catch (error) {
    console.error('Error al actualizar la caseta:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para eliminar una caseta
router.delete('/delete_booth/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Buscar la caseta que se desea eliminar
    const booth = await Booth.findOne({ where: { id } })
    if (!booth) {
      return res.status(404).json({ message: 'Caseta no encontrada.' })
    }

    await booth.destroy()
    return res.status(200).json({ message: 'Caseta eliminada exitosamente.' })
  } catch (error) {
    console.error('Error al eliminar la caseta:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para obtener todas las casetas
router.get('/get_booths', authenticateToken, async (req, res) => {
  try {
    const booths = await Booth.findAll() // Obtener todas las casetas de la tabla
    return res.status(200).json(booths)
  } catch (error) {
    console.error('Error al obtener casetas:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

module.exports = router
