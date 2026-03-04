const { Client } = require('pg');
const bcrypt = require('bcrypt');

// Configuración de conexión (ajusta con tus credenciales)
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'basket_system',
  password: 'catolica10',
  port: 5432,
});

const seedDatabase = async () => {
  try {
    await client.connect();
    console.log("Conectado a la base de datos...");
    const saltRounds = 10;
    const usuarios = [
      {
        nombre: 'Admin',
        apellido: 'Sistema',
        correo: 'admin@ejemplo.com',
        contrasena: 'admin123',
        id_rol: 1 
      },
      {
        nombre: 'Juan',
        apellido: 'Entrenador',
        correo: 'coach@ejemplo.com',
        contrasena: 'coach123',
        id_rol: 2
      },
      {
        nombre: 'Carlos',
        apellido: 'Arbitro',
        correo: 'referee@ejemplo.com',
        contrasena: 'ref123',
        id_rol: 3 
      }
    ];

    console.log("Insertando usuarios...");

    for (const u of usuarios) {
      const hash = await bcrypt.hash(u.contrasena, saltRounds);
      const query = `
        INSERT INTO usuarios (nombre, apellido, correo, contrasena, id_rol)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (correo) DO NOTHING;
      `;
      
      const values = [u.nombre, u.apellido, u.correo, hash, u.id_rol];
      await client.query(query, values);
      console.log(`Usuario ${u.correo} insertado con éxito.`);
    }

    console.log("Seed finalizado correctamente.");
  } catch (err) {
    console.error("Error ejecutando el seed:", err);
  } finally {
    await client.end();
  }
};

seedDatabase();