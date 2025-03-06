const mongoose = require('mongoose');
const Task = require('../Models/Task');
const Project = require('../Models/Project'); // Importa el modelo Project

// Crear tarea
exports.createTask = async (req, res) => {
    console.log('Solicitud de creación de tarea:', req.body);

    const { name, description, status, dueDate, completed } = req.body; // Incluye el campo 'project'
    const user = req.user; // Obtiene el usuario autenticado desde el middleware

    // Verificar que req.user está definido
    if (!user) {
        return res.status(403).json({ message: 'Usuario no autenticado' });
    }

    try {
        // Validar que el nombre esté presente
        if (!name) {
            return res.status(400).json({ message: 'El título es obligatorio.' });
        }

        // Validar que completed sea un booleano (opcional)
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'El estado completado debe ser un valor booleano.' });
        }

        // Asegurarse de que assignedTo sea un ObjectId
        const assignedToId = mongoose.Types.ObjectId(user.id); // Convertir a ObjectId explícitamente
        
        // Crear la nueva tarea
        const newTask = new Task({ name, description, status, dueDate,  completed: completed || false, assignedTo: user.id, assignedToId });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error('Error al crear la tarea:', err);
        res.status(500).json({ message: 'Error al crear la tarea', error: err.message });
    }
};

// Obtener todas las tareas
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo project'); // Populate para obtener información del usuario asignado y del proyecto
        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error al obtener las tareas:', err);
        res.status(500).json({ message: 'Error al obtener las tareas', error: err.message });
    }
};

// Nueva función para buscar tareas
exports.searchTasks = async (req, res) => {
    const { query } = req.query;
    
    try {
        const tasks = await Task.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { status: { $regex: query, $options: 'i' } }
            ]
        }).populate('assignedTo project'); // Populate para obtener información del usuario asignado y del proyecto

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error al buscar tareas:', err);
        res.status(500).json({ message: 'Error al buscar tareas', error: err.message });
    }
};

// Obtener tarea por ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findById(id).populate('assignedTo project'); // Populate para obtener información del usuario asignado y del proyecto
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(200).json(task);
    } catch (err) {
        console.error('Error al obtener la tarea:', err);
        res.status(500).json({ message: 'Error al obtener la tarea', error: err.message });
    }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, completed, status } = req.body; // Incluye 'status' y 'project' en la desestructuración

    try {
        // Validar que al menos uno de los campos esté presente
        if (name === undefined && completed === undefined && status === undefined ) {
            return res.status(400).json({ message: 'Proporcione al menos un campo para actualizar.' });
        }

        // Validar que completed sea un booleano si se proporciona
        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'El estado completado debe ser un valor booleano.' });
        }

        // Validar que 'status' sea uno de los valores permitidos si se proporciona
        const allowedStatuses = ['pending', 'in-progress', 'completed'];
        if (status !== undefined && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'El estado proporcionado no es válido.' });
        }

        // Actualizar la tarea
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { name, completed, status },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Error al actualizar la tarea:', err);
        res.status(500).json({ message: 'Error al actualizar la tarea', error: err.message });
    }
};

// Borrar tarea
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.status(204).json(); // No content
    } catch (err) {
        console.error('Error al borrar la tarea:', err);
        res.status(500).json({ message: 'Error al borrar la tarea', error: err.message });
    }
};

