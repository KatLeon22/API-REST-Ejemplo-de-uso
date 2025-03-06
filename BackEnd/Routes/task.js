const express = require('express');
const { body, validationResult } = require('express-validator'); // Importar express-validator para validaciones
const Task = require('../Models/Task'); // Asegúrate de que el modelo esté importado
const authMiddleware = require('../middlewares/authMiddleware'); // Importar el middleware de autenticación
const router = express.Router();

// Crear una nueva tarea (POST) con asignación de usuario
router.post('/', authMiddleware, [ // Aplicar el middleware aquí
    body('name').isString().notEmpty().withMessage('El título es obligatorio'),
    body('descripcion').isString().optional(),
    body('assignedTo').isMongoId().withMessage('ID de usuario no válido') // Validar que sea un ID de MongoDB
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        assignedTo: req.body.assignedTo,
        status: req.body.status || 'pending',
        dueDate: req.body.dueDate || new Date(),
    });

    try {
        const savedTask = await task.save();
        res.status(201).send(savedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Obtener todas las tareas (GET)
router.get('/', authMiddleware, async (req, res) => { // Aplicar el middleware aquí
    try {
        const tasks = await Task.find().populate('assignedTo', 'correo'); // Opcional: incluir información del usuario asignado
        res.status(200).send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Actualizar una tarea (PUT)
router.put('/:id', authMiddleware, [ // Aplicar el middleware aquí
    body('name').isString().optional(), // La actualización del título es opcional
    body('completed').isBoolean().optional(),
    body('assignedTo').isMongoId().optional().withMessage('ID de usuario no válido') // Validar que sea un ID de MongoDB
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            completed: req.body.completed,
            assignedTo: req.body.assignedTo // Permitir la actualización de la asignación
        }, { new: true }); // El parámetro "new: true" devuelve el documento actualizado

        if (!updatedTask) {
            return res.status(404).send('Tarea no encontrada');
        }

        res.status(200).send(updatedTask);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Eliminar una tarea (DELETE)
router.delete('/:id', authMiddleware, async (req, res) => { // Aplicar el middleware aquí
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).send('Tarea no encontrada');
        }

        res.status(200).send('Tarea eliminada correctamente');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
