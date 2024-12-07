const express = require('express')
const router = express.Router()
const models = require('../models')

const User = models.user

// Endpoint para crear un usuario
router.post('/create_login_user', async (req, res) => {
  try {
    let item = req.body // Obtenemos el objeto "item" del cuerpo de la solicitud

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email: item.email } })
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado.' }) // Cambiado a 409 Conflict
    }

    // Crear el usuario en la base de datos
    const newUser = await User.create({
      name: item.name,
      email: item.email,
      password: item.password, // Asegúrate de que Sequelize maneje el hash
    })

    return res.status(200).json({
      message: 'Usuario creado exitosamente.',
      user: newUser,
    })
  } catch (error) {
    console.error('Error al crear usuario:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

module.exports = router
