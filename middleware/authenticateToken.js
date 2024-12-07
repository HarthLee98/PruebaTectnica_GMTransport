const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar el usuario decodificado en req.user
    next(); // Pasar al siguiente middleware o controlador
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authenticateToken;
