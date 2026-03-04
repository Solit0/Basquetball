require('dotenv').config({ path: '../../.env' });
const pool = require('./db');
const bcrypt = require('bcrypt');

const crearUsuario = async () => {

    // MODIFICA ESTOS DATOS A TU GUSTO
    const usuarios = [
        {
            nombre: 'Carlos',
            apellido: 'Méndez',
            correo: 'admin@deporte.com',
            contrasena: 'admin123',
            id_rol: 1 // administrador
        },
        {
            nombre: 'Jorge',
            apellido: 'López',
            correo: 'entrenador@deporte.com',
            contrasena: 'entrenador123',
            id_rol: 2 // entrenador
        },
        {
            nombre: 'Mario',
            apellido: 'Pérez',
            correo: 'arbitro@deporte.com',
            contrasena: 'arbitro123',
            id_rol: 3 // arbitro
        }
    ];

    try {
        for (const u of usuarios) {
            const hash = await bcrypt.hash(u.contrasena, 10);

            await pool.query(
                `INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (correo) DO NOTHING`,
                [u.nombre, u.apellido, u.correo, hash, u.id_rol]
            );

            console.log(`✅ Usuario creado: ${u.correo}`);
        }

    } catch (err) {
        console.error('❌ Error al crear usuario:', err.message);
    } finally {
        await pool.end();
    }
};

crearUsuario();