const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.sendStatus(401); // Si no hay token, devolver error 401
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token inválido:', err); // Para depuración
            return res.sendStatus(403); // Si el token es inválido, devolver error 403
        }
        req.user = user; // Guardar información del usuario en la solicitud
        next(); // Pasar al siguiente middleware o ruta
    });
};

// Middleware para verificar el rol
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.sendStatus(401); // Si no hay usuario, devolver error 401
        }
        if (Array.isArray(roles)) {
            // Si roles es un array, verificar si el rol del usuario está incluido
            if (!roles.includes(req.user.role)) {
                return res.sendStatus(403); // Acceso prohibido si no tiene el rol adecuado
            }
        } else {
            // Si roles es un string, verificar que coincida
            if (req.user.role !== roles) {
                return res.sendStatus(403); // Acceso prohibido si no tiene el rol adecuado
            }
        }
        next(); // Pasar al siguiente middleware o ruta
    };
};

module.exports = { authMiddleware, checkRole };
