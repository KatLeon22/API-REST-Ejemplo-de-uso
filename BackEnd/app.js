// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config(); // Cargar variables de entorno

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Habilitar CORS - conexion
app.use(morgan('dev')); // Logger de solicitudes
app.use(express.json()); // Middleware para parsear JSON

// Conectar a MongoDB
const url = process.env.MONGODB_URL; // Obtener la URI de conexión
if (!url) {
    console.error('Error: MONGODB_URL no está definida en el archivo .env');
    process.exit(1); // Salir si la URI no está definida
}

// Conectar a MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Importar rutas
const taskRoutes = require('./Routes/task.routes'); // Asegúrate de que el nombre del archivo sea correcto
const authRoutes = require('./Routes/auth.routes'); // Importar las rutas de autenticación
const projectRoutes = require('./Routes/projectRoutes'); // Importar las rutas de proyectos

// Usar rutas
app.use('/api', taskRoutes); // Rutas de tareas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api', projectRoutes); // Rutas de proyectos

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
