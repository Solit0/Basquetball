//ruta de archivo : Backend/src/Services/usuarioService.js
const { db } = require('../Config/db');
const schema = require('../models/schema');
const { eq, and, ne, desc } = require('drizzle-orm');
const bcrypt = require('bcrypt');

const obtenerTodos = async () => {
    const rows = await db.select({
        id_usuario: schema.usuarios.idUsuario,
        nombre: schema.usuarios.nombre,
        apellido: schema.usuarios.apellido,
        email: schema.usuarios.correo,
        rol: schema.roles.nombreRol,
        activo: schema.usuarios.activo,
        fecha_registro: schema.usuarios.fechaRegistro
    })
    .from(schema.usuarios)
    .innerJoin(schema.roles, eq(schema.usuarios.idRol, schema.roles.idRol))
    .orderBy(desc(schema.usuarios.fechaRegistro));

    return rows;
};

const crear = async (datosUsuario) => {
    const { nombre, email, password, rol } = datosUsuario;
    
    const partesNombre = nombre.trim().split(' ');
    const primerNombre = partesNombre[0];
    const apellidos = partesNombre.slice(1).join(' ') || '.'; 

    const rolEncontrado = await db.select({ id: schema.roles.idRol })
        .from(schema.roles)
        .where(eq(schema.roles.nombreRol, rol))
        .limit(1);

    if (rolEncontrado.length === 0) {
        throw new Error(`El rol '${rol}' no existe en la base de datos.`);
    }

    const id_rol = rolEncontrado[0].id;

    const saltRounds = 10;
    const passwordHashed = await bcrypt.hash(password, saltRounds);

    const rows = await db.insert(schema.usuarios)
        .values({
            nombre: primerNombre,
            apellido: apellidos,
            correo: email,
            contrasena: passwordHashed,
            idRol: id_rol
        })
        .returning({
            id_usuario: schema.usuarios.idUsuario,
            nombre: schema.usuarios.nombre,
            apellido: schema.usuarios.apellido,
            email: schema.usuarios.correo
        });

    return rows[0];
};

const login = async (correo, contrasena) => {
    const resultado = await db.select({
        id_usuario: schema.usuarios.idUsuario,
        nombre: schema.usuarios.nombre,
        apellido: schema.usuarios.apellido,
        correo: schema.usuarios.correo,
        contrasena: schema.usuarios.contrasena,
        nombre_rol: schema.roles.nombreRol
    })
    .from(schema.usuarios)
    .innerJoin(schema.roles, eq(schema.usuarios.idRol, schema.roles.idRol))
    .where(
        and(
            eq(schema.usuarios.correo, correo),
            eq(schema.usuarios.activo, true)
        )
    )
    .limit(1);

    if (resultado.length === 0) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }
    const usuario = resultado[0];
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
    
    return await db.transaction(async (tx) => {
        if (correo) {
            const emailCheck = await tx.select({ id: schema.usuarios.idUsuario })
                .from(schema.usuarios)
                .where(
                    and(
                        eq(schema.usuarios.correo, correo),
                        ne(schema.usuarios.idUsuario, id_usuario)
                    )
                );
            
            if (emailCheck.length > 0) {
                throw new Error('El correo ingresado ya está asociado a otra cuenta.');
            }
        }
        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (apellido !== undefined) updateData.apellido = apellido;
        if (correo !== undefined) updateData.correo = correo;

        // 3. Ejecutar actualización
        const rows = await tx.update(schema.usuarios)
            .set(updateData)
            .where(eq(schema.usuarios.idUsuario, id_usuario))
            .returning({
                id_usuario: schema.usuarios.idUsuario,
                nombre: schema.usuarios.nombre,
                apellido: schema.usuarios.apellido,
                correo: schema.usuarios.correo,
                id_rol: schema.usuarios.idRol,
                activo: schema.usuarios.activo
            });

        return rows[0]; 
    });
};

module.exports = { login, obtenerTodos, crear, actualizarPerfil };