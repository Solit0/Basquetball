const pool = require('../Config/db');

const obtenerTodas = async () => {
    const query = `
        SELECT id_cancha AS id, nombre_cancha AS name, direccion AS address, capacidad AS capacity 
        FROM canchas 
        WHERE activo = true 
        ORDER BY nombre_cancha ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};

const crear = async (canchaData) => {
    const checkQuery = `SELECT id_cancha FROM canchas WHERE LOWER(direccion) = LOWER($1)`;
    const checkResult = await pool.query(checkQuery, [canchaData.direccion]);
    
    if (checkResult.rows.length > 0) {
        throw new Error("Ya existe una cancha registrada con esta misma dirección exacta.");
    }
    const insertQuery = `
        INSERT INTO canchas (nombre_cancha, direccion, capacidad)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    const { rows } = await pool.query(insertQuery, [
        canchaData.nombre_cancha,
        canchaData.direccion,
        canchaData.capacidad || null
    ]);
    
    return rows[0];
};
module.exports = {
    obtenerTodas,
    crear
};