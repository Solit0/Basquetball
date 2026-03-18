const { Client } = require('pg');
const bcrypt = require('bcrypt');

(async () => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'basket_system',
    password: 'catolica10',
    port: 5432,
  });

  try {
    await client.connect();
    const res = await client.query(
      'SELECT correo, contrasena, activo FROM usuarios WHERE correo = $1',
      ['admin@ejemplo.com']
    );
    console.log(res.rows);
    if (res.rows.length) {
      const user = res.rows[0];
      const match = await bcrypt.compare('admin123', user.contrasena);
      console.log('password matches:', match);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
})();
