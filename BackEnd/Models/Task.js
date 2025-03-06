// models/Task.js
const mongoose = require('mongoose');

// Importar el modelo User correctamente
const User = require('./User'); // Asegúrate de que la ruta sea correcta
const Project = require ('./Project');

const taskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia a User
    description: { type: String },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
});

// Exportar el modelo
module.exports = mongoose.model('Task', taskSchema);

