const pool = require('../config/db'); 

const obtenerTorneosAsignados = async (id_arbitro) => {
    const query = `
        SELECT t.id_torneo, t.nombre_torneo, t.categoria, ce.descripcion AS clasificacion,
                COUNT(p.id_partido) as partidos_pendientes
        FROM torneos t
        JOIN partidos p ON t.id_torneo = p.id_torneo
        LEFT JOIN clasificacion_equipo ce ON t.id_clasificacion = ce.id_clasificacion
        WHERE p.id_arbitro_principal = $1 
            AND p.estado != 'Finalizado' 
            AND t.estado NOT IN ('Cancelado', 'Archivado')
        GROUP BY t.id_torneo, ce.descripcion
        ORDER BY t.fecha_inicio DESC;
    `;
    const { rows } = await pool.query(query, [id_arbitro]);
    return rows;
};

const obtenerPartidosPorTorneo = async (id_arbitro, id_torneo) => {
    const query = `
        SELECT p.id_partido, p.fecha, p.hora, p.ronda_torneo, p.estado,
                el.nombre_oficial AS local_nombre, el.siglas AS local_siglas,
                ev.nombre_oficial AS visitante_nombre, ev.siglas AS visitante_siglas,
                c.nombre_cancha
        FROM partidos p
        JOIN equipos el ON p.id_equipo_local = el.id_equipo
        JOIN equipos ev ON p.id_equipo_visitante = ev.id_equipo
        JOIN canchas c ON p.id_cancha = c.id_cancha
        WHERE p.id_arbitro_principal = $1 
            AND p.id_torneo = $2
            AND p.estado != 'Finalizado'
        ORDER BY p.fecha ASC, p.hora ASC;
    `;
    const { rows } = await pool.query(query, [id_arbitro, id_torneo]);
    return rows;
};

const obtenerDetallePartido = async (id_arbitro, id_partido) => {
    const query = `
        SELECT p.id_partido, p.fecha, p.hora, p.ronda_torneo, p.estado,
                el.id_equipo AS id_local, el.nombre_oficial AS local_nombre, 
                u_el.nombre AS local_entrenador_nombre, u_el.apellido AS local_entrenador_apellido,
                ev.id_equipo AS id_visitante, ev.nombre_oficial AS visitante_nombre, 
                u_ev.nombre AS visitante_entrenador_nombre, u_ev.apellido AS visitante_entrenador_apellido,
                c.nombre_cancha, c.direccion AS cancha_direccion
        FROM partidos p
        JOIN equipos el ON p.id_equipo_local = el.id_equipo
        LEFT JOIN usuarios u_el ON el.id_entrenador = u_el.id_usuario
        JOIN equipos ev ON p.id_equipo_visitante = ev.id_equipo
        LEFT JOIN usuarios u_ev ON ev.id_entrenador = u_ev.id_usuario
        JOIN canchas c ON p.id_cancha = c.id_cancha
        WHERE p.id_partido = $1 AND p.id_arbitro_principal = $2;
    `;
    const { rows } = await pool.query(query, [id_partido, id_arbitro]);
    return rows[0]; 
};

module.exports = {
    obtenerTorneosAsignados,
    obtenerPartidosPorTorneo,
    obtenerDetallePartido
};