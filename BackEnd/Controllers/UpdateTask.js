const Task = require('../Models/Task');

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, completed, status } = req.body; // Asegúrate de incluir 'status' en la desestructuración

    try {
        // Validar que al menos uno de los campos esté presente
        if (name === undefined && completed === undefined && status === undefined) {
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

