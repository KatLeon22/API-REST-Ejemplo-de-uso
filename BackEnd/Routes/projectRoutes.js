const express = require('express');
const router = express.Router();
const { createProject, getProjects, deleteProject } = require('../Controllers/projectControllers');
const { authMiddleware, checkRole } = require('../middleware/auth');

// Rutas para proyectos
router.post('/projects', authMiddleware, checkRole(['admin']), createProject);
router.get('/projects', authMiddleware, checkRole(['user', 'admin']), getProjects);
router.delete('/projects/:id', authMiddleware, checkRole('admin'), deleteProject); // Ruta para eliminar proyectos


module.exports = router;
