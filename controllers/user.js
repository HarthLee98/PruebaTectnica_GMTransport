const express = require('express')
const router = express.Router()
const models = require('../models')
const jwt = require('jsonwebtoken') // Importa jsonwebtoken
const bcrypt = require('bcrypt')

const User = models.user

// Cargar las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'

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

    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      user: newUser,
    })
  } catch (error) {
    console.error('Error al crear usuario:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor.' })
  }
})

// Endpoint para iniciar sesión
router.post('/get_user_login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Usuario y/o Contraseña inválida' })
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: 'Usuario y/o Contraseña inválida' })
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      JWT_SECRET, // Clave secreta
      { expiresIn: JWT_EXPIRES_IN } // Configuración de expiración
    )

    // Guardar el token en la base de datos
    await User.update({ token }, { where: { id: user.id } })

    // Enviar respuesta con el token
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
})

module.exports = router
