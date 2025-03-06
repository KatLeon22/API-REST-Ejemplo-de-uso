const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Asegúrate de que la ruta al modelo de usuario sea correcta

// Función para generar un token
function generateToken(usuario) {
    const user = { id: usuario._id, role: usuario.role }; // Objeto del usuario
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '5h' }); // Genera el token
    return token;
}

// Controlador de registro de usuario
const register = async (req, res) => {
    const { correo, password, role } = req.body; // Asegúrate de incluir el campo 'role'

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({ 
            correo, 
            password: hashedPassword,
            role: role || 'user' // Asignar rol, por defecto será 'user' si no se proporciona
        });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al registrar usuario', error: err });
    }
};

// Controlador de inicio de sesión
const login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // Buscar el usuario por correo
        const user = await User.findOne({ correo });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Crear el token JWT
        const token = generateToken(user); // Usar la función de generación de token

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: err });
    }
};

// Middleware para verificar el rol
function checkRole(roles) {
    return function(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: '*- Lo Siento Acceso Denegado.-* No Token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: '-- Acceso Denegado. --' });
            }
            
            req.decodedUser = decoded; // Guarda el usuario decodificado en `req`
            next();
        } catch (error) {
            res.status(400).json({ message: '...Esta Peticion Es Invalida...' });
        }
    };
}

// Exportar las funciones y el middleware
module.exports = { register, login, checkRole };
