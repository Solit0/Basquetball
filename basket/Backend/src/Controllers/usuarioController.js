//ruta de archivo : Backend/src/Controllers/usuarioController.js
const authService = require('../Services/usuarioService');

const login = async (req, res, next) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            const error = new Error('Correo y contraseña son requeridos');
            error.status = 400;
            throw error;
        }

        const usuario = await authService.login(correo, contrasena);

        res.status(200).json({
            mensaje: 'Login exitoso',
            usuario
        });

    } catch (err) {
        next(err);
    }
};
const obtenerUsuarios = async (req, res, next) => {
    try {
        // CORRECCIÓN: Usar authService
        const usuarios = await authService.obtenerTodos();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

const crearUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        if (!nombre || !email || !password || !rol) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
        
        const rolesValidos = ['administrador', 'entrenador', 'arbitro'];
        if (!rolesValidos.includes(rol)) {
            return res.status(400).json({ error: 'El rol seleccionado no es válido' });
        }
        const nuevoUsuario = await authService.crear(req.body);
        
        res.status(201).json({
            mensaje: 'Cuenta creada exitosamente',
            usuario: nuevoUsuario
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Este correo electrónico ya está en uso' });
        }
        next(error);
    }
};
const actualizarMiPerfil = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const datosBody = req.body;

        const usuarioActualizado = await authService.actualizarPerfil(id, datosBody);
        
        res.status(200).json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        // Atrapamos el error del correo duplicado
        if (error.message.includes('asociado a otra cuenta')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};
module.exports = { login, obtenerUsuarios, crearUsuario, actualizarMiPerfil };