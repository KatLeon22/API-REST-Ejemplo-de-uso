const mongoose = require('mongoose');

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true }, // Correo electrónico único
    password: { type: String, required: true }, // Contraseña
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // Campo para el rol
}, { timestamps: true }); // Añadir timestamps para crear y actualizar

// Exportar el modelo de usuario
module.exports = mongoose.model('User', userSchema);
