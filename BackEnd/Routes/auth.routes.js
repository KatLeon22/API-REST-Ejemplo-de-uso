// Routes/auth.routes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../Controllers/authController'); // Importar controladores
const router = express.Router();

// Ruta para registrar un usuario
router.post('/register', [
    body('correo').isEmail().withMessage('Correo electrónico inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    // Validar la entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Delegar la lógica de registro al controlador
        await register(req, res);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        // Delegar la lógica de inicio de sesión al controlador
        await login(req, res);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

module.exports = router;
