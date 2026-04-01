//ruta del archivo : Backend/src/seed.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const { db } = require('./Config/db'); 
const schema = require('./models/schema'); 
const { eq } = require('drizzle-orm');

const usuariosSeed = [
    { nombre: 'Admin', apellido: 'Sistema', correo: 'admin@ejemplo.com', contrasena: 'admin123', rol: 'administrador' },
    { nombre: 'Juan', apellido: 'Entrenador', correo: 'coach@ejemplo.com', contrasena: 'coach123', rol: 'entrenador' },
    { nombre: 'Carlos', apellido: 'Arbitro', correo: 'referee@ejemplo.com', contrasena: 'ref123', rol: 'arbitro' },
    { nombre: 'Felipe', apellido: 'Aficionado', correo: 'usuario@ejemplo.com', contrasena: 'user123', rol: 'usuario' }
];

const ejecutarSeed = async () => {
    console.log(" Iniciando inyección de datos...");

    try {

        const rolesDefinidos = ['administrador', 'arbitro', 'entrenador', 'usuario'];
        
        for (const nombreRol of rolesDefinidos) {
            const existe = await db.select().from(schema.roles).where(eq(schema.roles.nombreRol, nombreRol));
            if (existe.length === 0) {
                await db.insert(schema.roles).values({ nombreRol: nombreRol });
                console.log(` Rol creado: ${nombreRol}`);
            }
        }
        const rolesDB = await db.select().from(schema.roles);
        const mapaRoles = {};
        rolesDB.forEach(r => {
            mapaRoles[r.nombreRol] = r.idRol; 
        });
        for (const usuario of usuariosSeed) {
            const existeUsuario = await db.select().from(schema.usuarios).where(eq(schema.usuarios.correo, usuario.correo));
            
            if (existeUsuario.length > 0) {
                console.log(` El usuario ${usuario.correo} ya existe. Saltando...`);
                continue;
            }

            const passwordHashed = await bcrypt.hash(usuario.contrasena, 10);
            const id_rol_uuid = mapaRoles[usuario.rol];

            if (!id_rol_uuid) {
                throw new Error(`El rol '${usuario.rol}' no se encontró en la base de datos.`);
            }
            await db.insert(schema.usuarios).values({
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                contrasena: passwordHashed,
                idRol: id_rol_uuid,
                activo: true
            });

            console.log(` Usuario insertado: ${usuario.nombre} (${usuario.rol})`);
        }

        console.log(" ¡Inyección de datos completada con éxito!");
        process.exit(0);

    } catch (error) {
        console.error("Error durante la inyección:", error.message);
        process.exit(1);
    }
};

ejecutarSeed();