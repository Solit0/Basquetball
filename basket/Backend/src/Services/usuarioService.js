//ruta de archivo : Backend/src/Services/usuarioService.js
const pool = require('../Config/db');
const bcrypt = require('bcrypt');

const obtenerTodos = async () => {
    
    const query = `
        SELECT u.id_usuario, u.nombre, u.apellido, u.correo AS email, r.nombre_rol AS rol, u.activo, u.fecha_registro
        FROM usuarios u
        JOIN roles r ON u.id_rol = r.id_rol
        ORDER BY u.fecha_registro DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};

const crear = async (datosUsuario) => {
    const { nombre, email, password, rol } = datosUsuario;
    const partesNombre = nombre.trim().split(' ');
    const primerNombre = partesNombre[0];
    const apellidos = partesNombre.slice(1).join(' ') || '.'; 

    const mapaRoles = {
        'administrador': 1,
        'entrenador': 2,
        'arbitro': 3
    };
    const id_rol = mapaRoles[rol];
    const saltRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltRounds);

    const query = `
        INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_usuario, nombre, apellido, correo AS email;
    `;
    const values = [primerNombre, apellidos, email, passwordHashed, id_rol];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
};
const login = async (correo, contrasena) => {
    const resultado = await pool.query(
        `SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.contrasena, r.nombre_rol
            FROM usuarios u
            JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.correo = $1 AND u.activo = TRUE`,
        [correo]
    );
    if (resultado.rows.length === 0) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }
    const usuario = resultado.rows[0];
    const passwordEsValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordEsValida) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

    return {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.nombre_rol
    };
};
const actualizarPerfil = async (id_usuario, datosPerfil) => {
    const { nombre, apellido, correo } = datosPerfil;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        if (correo) {
            const emailCheck = await client.query(
                `SELECT id_usuario FROM usuarios WHERE correo = $1 AND id_usuario != $2`, 
                [correo, id_usuario]
            );
            if (emailCheck.rows.length > 0) {
                throw new Error('El correo ingresado ya está asociado a otra cuenta.');
            }
        }
        const updateQuery = `
            UPDATE usuarios 
            SET nombre = COALESCE($1, nombre),
                apellido = COALESCE($2, apellido),
                correo = COALESCE($3, correo)
            WHERE id_usuario = $4
            RETURNING id_usuario, nombre, apellido, correo, id_rol, activo;
        `;
        const { rows } = await client.query(updateQuery, [nombre, apellido, correo, id_usuario]);

        await client.query('COMMIT');
        return rows[0]; 
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { login, obtenerTodos, crear, actualizarPerfil };