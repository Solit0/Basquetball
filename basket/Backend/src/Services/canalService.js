const pool = require('../Config/db');

const obtenerTodos = async () => {
    const query = `
        SELECT c.id_canal, c.nombre_canal, c.url_sitio, c.numero_canal, c.horario, c.activo,
            t.id_tipo, t.descripcion AS tipo_canal
            FROM canales c
            INNER JOIN tipo_canal t ON c.id_tipo = t.id_tipo
            WHERE c.activo = true
            ORDER BY c.nombre_canal ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};

const crear = async (datosCanal) => {
    const { nombre_canal, id_tipo, url_sitio, numero_canal, horario } = datosCanal;
    const query = `
        INSERT INTO canales (nombre_canal, id_tipo, url_sitio, numero_canal, horario)
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
    `;
    const values = [nombre_canal, id_tipo, url_sitio || null, numero_canal || null, horario || null];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = {
    obtenerTodos,
    crear
};