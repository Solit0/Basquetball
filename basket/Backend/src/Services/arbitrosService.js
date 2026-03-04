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

const obtenerTodosPartidosAsignados = async (id_arbitro) => {
    const query = `
        SELECT p.id_partido, p.fecha, p.hora, p.ronda_torneo, p.estado,
               t.nombre_torneo,
               el.nombre_oficial AS local_nombre, 
               ev.nombre_oficial AS visitante_nombre, 
               c.nombre_cancha
        FROM partidos p
        JOIN torneos t ON p.id_torneo = t.id_torneo
        JOIN equipos el ON p.id_equipo_local = el.id_equipo
        JOIN equipos ev ON p.id_equipo_visitante = ev.id_equipo
        JOIN canchas c ON p.id_cancha = c.id_cancha
        WHERE p.id_arbitro_principal = $1 
          AND p.estado != 'Finalizado'
        ORDER BY p.fecha ASC, p.hora ASC;
    `;
    const { rows } = await pool.query(query, [id_arbitro]);
    return rows;
};

// ==========================================
// NUEVAS FUNCIONES PARA LA ASISTENCIA
// ==========================================

// 1. Marcar a un jugador en específico
const marcarAsistenciaJugador = async (id_partido, id_jugador, estado) => {
    // Usamos ON CONFLICT para insertar si no existe, o actualizar si el árbitro cambia de opinión
    const query = `
        INSERT INTO asistencia_partidos (id_partido, id_jugador, estado)
        VALUES ($1, $2, $3)
        ON CONFLICT (id_partido, id_jugador) 
        DO UPDATE SET estado = EXCLUDED.estado
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_partido, id_jugador, estado]);
    return rows[0];
};

const obtenerAlineacionPartido = async (id_partido, id_equipo) => {
    const query = `
        SELECT j.id_jugador, j.nombre, j.apellido, 
               pe.numero_camiseta, pe.es_capitan,
               COALESCE(ap.estado, 'Pendiente') as estado_asistencia 
        FROM jugadores j
        JOIN plantilla_equipo pe ON j.id_jugador = pe.id_jugador
        LEFT JOIN asistencia_partidos ap ON j.id_jugador = ap.id_jugador AND ap.id_partido = $1
        WHERE pe.id_equipo = $2 AND pe.activo = true
        ORDER BY pe.numero_camiseta ASC;
    `;
    const { rows } = await pool.query(query, [id_partido, id_equipo]);
    return rows;
};
const actualizarEstadoPartido = async (id_partido, estado) => {
    const query = `
        UPDATE partidos 
        SET estado = $2 
        WHERE id_partido = $1 
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_partido, estado]);
    return rows[0];
};
module.exports = {
    obtenerTorneosAsignados,
    obtenerPartidosPorTorneo,
    obtenerDetallePartido,
    obtenerTodosPartidosAsignados,
    marcarAsistenciaJugador,
    obtenerAlineacionPartido,
    actualizarEstadoPartido
};