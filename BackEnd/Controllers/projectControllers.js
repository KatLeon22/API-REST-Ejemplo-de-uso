const Project = require('../Models/Project');

// Crear Proyecto
exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newProject = new Project({ name, description });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        console.error('Error al crear el proyecto:', err);
        res.status(500).json({ message: 'Error al crear el proyecto', error: err.message });
    }
};

// Obtener todos los Proyectos
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error al obtener los proyectos:', err);
        res.status(500).json({ message: 'Error al obtener los proyectos', error: err.message });
    }
};

// Eliminar Proyecto
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        res.status(204).json(); // No content
    } catch (err) {
        console.error('Error al borrar el proyecto:', err);
        res.status(500).json({ message: 'Error al borrar el proyecto', error: err.message });
    }
};