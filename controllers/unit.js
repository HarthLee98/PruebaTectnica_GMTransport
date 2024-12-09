const express = require('express')
const router = express.Router()
const models = require('../models')
const authenticateToken = require('../middleware/authenticateToken')

const Unit = models.unit

// Endpoint para crear una unidad
router.post('/create_unit', authenticateToken, async (req, res) => {
  try {
    let item = req.body

    // Verificar si el código ya está registrado
    const existingUnit = await Unit.findOne({ where: { code: item.code } })
    if (existingUnit) {
      return res
        .status(409)
        .json({ message: 'El código de unidad ya está registrado.' })
    }

    // Crear la nueva unidad en la base de datos
    const newUnit = await Unit.create(item)

    // Respuesta exitosa
    return res.status(201).json({
      message: 'Unidad creada exitosamente.',
      unit: newUnit,
    })
  } catch (error) {
    console.error('Error al crear la unidad:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para actualizar una unidad
router.post('/update_unit', authenticateToken, async (req, res) => {
  try {
    let item = req.body

    // Verificar si se proporcionó el ID de la unidad
    if (!item.id) {
      return res
        .status(400)
        .json({ message: 'El ID de la unidad es obligatorio.' })
    }

    // Buscar la unidad que se desea actualizar
    const unit = await Unit.findOne({ where: { id: item.id } })
    if (!unit) {
      return res.status(404).json({ message: 'La unidad no existe.' })
    }

    // Verificar si el código ya está en uso por otra unidad
    if (item.code !== unit.code) {
      const existingUnit = await Unit.findOne({ where: { code: item.code } })
      if (existingUnit) {
        return res.status(409).json({
          message: 'El código de unidad ya está registrado por otra unidad.',
        })
      }
    }

    // Actualizar la unidad en la base de datos
    await unit.update({ code: item.code, name: item.name })

    // Respuesta exitosa
    return res.status(200).json({
      message: 'Unidad actualizada exitosamente.',
      unit,
    })
  } catch (error) {
    console.error('Error al actualizar la unidad:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para eliminar una unidad
router.delete('/delete_unit/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Buscar la unidad que se desea eliminar
    const unit = await Unit.findOne({ where: { id } })
    if (!unit) {
      return res.status(404).json({ message: 'Unidad no encontrada.' })
    }

    await unit.destroy()
    return res.status(200).json({ message: 'Unidad eliminada exitosamente.' })
  } catch (error) {
    console.error('Error al eliminar la unidad:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para obtener todas las unidades
router.get('/get_units', authenticateToken, async (req, res) => {
  try {
    const units = await Unit.findAll() // Obtener todas las unidades de la tabla
    return res.status(200).json(units)
  } catch (error) {
    console.error('Error al obtener unidades:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

module.exports = router
