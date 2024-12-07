const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/authenticateToken')

// Ruta protegida
// router.get('/protected_route', authenticateToken, (req, res) => {
//   res.status(200).json({ message: 'Acceso autorizado', user: req.user })
// })

module.exports = router
