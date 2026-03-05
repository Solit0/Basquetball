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
// ==========================================
// MÓDULO DE TRANSMISIONES (PARRILLA)
// ==========================================

// 1. Asignar un partido a un canal
const asignarTransmision = async (id_canal, id_partido, hora_transmision) => {
    const query = `
        INSERT INTO transmisiones (id_canal, id_partido, hora_transmision)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_canal, id_partido, hora_transmision]);
    return rows[0];
};

// 2. Obtener la cartelera de un canal específico
const obtenerTransmisionesPorCanal = async (id_canal) => {
    const query = `
        SELECT 
            tr.id_transmision,
            tr.id_canal,
            tr.id_partido,
            tr.hora_transmision,
            p.fecha,
            p.hora AS hora_partido,
            t.nombre_torneo AS torneo_nombre,
            el.nombre_oficial AS local_nombre,
            ev.nombre_oficial AS visitante_nombre,
            CONCAT(el.nombre_oficial, ' vs ', ev.nombre_oficial) AS encuentro
        FROM transmisiones tr
        JOIN partidos p ON tr.id_partido = p.id_partido
        JOIN torneos t ON p.id_torneo = t.id_torneo
        JOIN equipos el ON p.id_equipo_local = el.id_equipo
        JOIN equipos ev ON p.id_equipo_visitante = ev.id_equipo
        WHERE tr.id_canal = $1
        ORDER BY p.fecha ASC, tr.hora_transmision ASC;
    `;
    const { rows } = await pool.query(query, [id_canal]);
    return rows;
};

// 3. Quitar un partido de la transmisión
const eliminarTransmision = async (id_transmision) => {
    const query = `DELETE FROM transmisiones WHERE id_transmision = $1 RETURNING *`;
    const { rows } = await pool.query(query, [id_transmision]);
    if (rows.length === 0) throw new Error("Transmisión no encontrada");
    return rows[0];
};

// Asegúrate de exportar estas 3 funciones al final de tu archivo
// module.exports = { ..., asignarTransmision, obtenerTransmisionesPorCanal, eliminarTransmision };
module.exports = {
    obtenerTodos,
    crear,
    asignarTransmision,
    obtenerTransmisionesPorCanal,
    eliminarTransmision
};