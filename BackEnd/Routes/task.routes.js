const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById, updateTask, deleteTask, searchTasks } = require('../Controllers/taskControllers');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Rutas
// Obtener todas las tareas: accesible para usuarios con rol 'user' y 'admin'
router.get('/tasks', authMiddleware, checkRole(['user', 'admin']), getTasks);

// Crear tarea: accesible solo para usuarios con rol 'admin'
router.post('/tasks', authMiddleware, checkRole('admin'), createTask);

// Obtener tarea por ID: accesible para usuarios con rol 'user' y 'admin'
router.get('/tasks/:id', authMiddleware, checkRole(['user', 'admin']), getTaskById);

// Actualizar tarea: accesible para usuarios con rol 'user' y 'admin'
router.put('/tasks/:id', authMiddleware, checkRole(['user', 'admin']), updateTask);

// Borrar tarea: accesible solo para usuarios con rol 'admin'
router.delete('/tasks/:id', authMiddleware, checkRole('admin'), deleteTask);

// Nueva ruta para buscar tareas: accesible solo para usuarios con rol 'admin'
router.get('/tasks/search', authMiddleware, checkRole('admin'), searchTasks);

module.exports = router;
