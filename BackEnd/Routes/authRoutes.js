const express = require('express');
const router = express.Router();
const { register, login } = require('../Controllers/userControllers');

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

module.exports = router;
