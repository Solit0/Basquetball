const pool = require('../Config/db');

const crearTorneo = async (datosTorneo) => {
    const { nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, id_clasificacion, reglamento } = datosTorneo;
    if (numero_equipos > 32) throw new Error('El límite máximo de equipos permitidos por torneo es 32.');

    const query = `
        INSERT INTO torneos (nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, id_clasificacion, reglamento)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
    `;
    const { rows } = await pool.query(query, [nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, id_clasificacion, reglamento]);
    return rows[0];
};
const quitarEquipo = async (id_torneo, id_equipo) => {
    const client = await pool.connect();
    try {
        const torneoQuery = await client.query(`SELECT estado FROM torneos WHERE id_torneo = $1`, [id_torneo]);
        if (torneoQuery.rows.length === 0) throw new Error('El torneo no existe.');
        if (torneoQuery.rows[0].estado !== 'En inscripción') {
            throw new Error('No puedes quitar equipos de un torneo que ya está en curso o finalizado.');
        }
        const partidosQuery = await client.query(`SELECT COUNT(*) FROM partidos WHERE id_torneo = $1`, [id_torneo]);
        if (parseInt(partidosQuery.rows[0].count, 10) > 0) {
            await client.query(`UPDATE torneos SET estado = 'En curso' WHERE id_torneo = $1`, [id_torneo]);
            throw new Error('Bloqueo de seguridad: No puedes expulsar a un equipo porque el torneo ya tiene partidos generados.');
        }

        const query = `DELETE FROM inscripciones WHERE id_torneo = $1 AND id_equipo = $2 RETURNING *;`;
        const { rows } = await client.query(query, [id_torneo, id_equipo]);
        
        if (rows.length === 0) throw new Error('El equipo no estaba inscrito en este torneo.');
        return rows[0];
    } finally {
        client.release();
    }
};
const editarTorneo = async (id_torneo, datosTorneo) => {
    const client = await pool.connect();
    try {
        const estadoQuery = await client.query(`SELECT estado FROM torneos WHERE id_torneo = $1`, [id_torneo]);
        if (estadoQuery.rows[0].estado !== 'En inscripción') {
            throw new Error('Solo puedes editar un torneo antes de que inicie.');
        }
        const partidosQuery = await client.query(`SELECT COUNT(*) FROM partidos WHERE id_torneo = $1`, [id_torneo]);
        if (parseInt(partidosQuery.rows[0].count, 10) > 0) {
            // Si tiene partidos, auto-corregimos el estado a 'En curso' y bloqueamos
            await client.query(`UPDATE torneos SET estado = 'En curso' WHERE id_torneo = $1`, [id_torneo]);
            throw new Error('Bloqueo de seguridad: No puedes editar las bases de un torneo que ya tiene partidos programados.');
        }

        const { nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, reglamento } = datosTorneo;
        const query = `
            UPDATE torneos 
            SET nombre_torneo = COALESCE($1, nombre_torneo), descripcion = COALESCE($2, descripcion),
                categoria = COALESCE($3, categoria), fecha_inicio = COALESCE($4, fecha_inicio),
                fecha_fin = COALESCE($5, fecha_fin), numero_equipos = COALESCE($6, numero_equipos),
                reglamento = COALESCE($7, reglamento)
            WHERE id_torneo = $8 RETURNING *;
        `;
        const { rows } = await client.query(query, [nombre_torneo, descripcion, categoria, fecha_inicio, fecha_fin, numero_equipos, reglamento, id_torneo]);
        return rows[0];
    } finally {
        client.release();
    }
};

const iniciarTorneo = async (id_torneo) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const torneoInfo = await client.query(`SELECT numero_equipos FROM torneos WHERE id_torneo = $1`, [id_torneo]);
        const limiteEquipos = torneoInfo.rows[0].numero_equipos;
        const equiposInscritos = await client.query(`SELECT COUNT(*) FROM inscripciones WHERE id_torneo = $1`, [id_torneo]);
        const cantidad = parseInt(equiposInscritos.rows[0].count, 10);
        if (cantidad === 0) throw new Error('No puedes iniciar un torneo sin equipos.');
        if (cantidad !== limiteEquipos) {
            throw new Error(`REGLA_TORNEO: El torneo requiere exactamente ${limiteEquipos} equipos para iniciar, pero actualmente solo hay ${cantidad} inscritos.`);
        }

        if (cantidad % 2 !== 0) throw new Error('REGLA_TORNEO: El torneo debe tener una cantidad PAR de equipos para poder iniciar.');
        const { rows } = await client.query(`UPDATE torneos SET estado = 'En curso' WHERE id_torneo = $1 RETURNING *`, [id_torneo]);
        
        await client.query('COMMIT');
        return rows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
const eliminarTorneo = async (id_torneo) => {
    const client = await pool.connect();
    try {
        const partidosQuery = await client.query('SELECT estado, ronda_torneo FROM partidos WHERE id_torneo = $1', [id_torneo]);
        const partidos = partidosQuery.rows;
        
        const totalPartidos = partidos.length;
        const partidosFinalizados = partidos.filter(p => p.estado === 'Finalizado').length;
        
        const tieneFinalJugada = partidos.some(p => 
            (p.ronda_torneo === 'Final' || p.ronda_torneo === 'Gran Final') && p.estado === 'Finalizado'
        );

        let nuevoEstado = '';

        if (totalPartidos === 0 || (totalPartidos > 0 && partidosFinalizados === 0)) {
            nuevoEstado = 'Cancelado'; 
        } 
        else if (tieneFinalJugada) {
            nuevoEstado = 'Archivado'; 
        } 
        else {
            throw new Error('BLOQUEO DE SEGURIDAD: El torneo está a la mitad de su desarrollo. Solo puedes eliminar torneos vacíos, torneos sin arrancar o torneos finalizados por completo.');
        }
        await client.query('UPDATE torneos SET estado = $1 WHERE id_torneo = $2', [nuevoEstado, id_torneo]);
        
        return { 
            mensaje: `El torneo fue ${nuevoEstado.toLowerCase()} exitosamente y ha sido removido de la vista principal.` 
        };
    } finally {
        client.release();
    }
};
const obtenerTodosActivos = async () => {
    const query = `
        SELECT t.*, c.descripcion as clasificacion_genero,
               (SELECT COUNT(*) FROM inscripciones i WHERE i.id_torneo = t.id_torneo AND i.estado_inscripcion != 'Rechazada') as equipos_inscritos
        FROM torneos t
        LEFT JOIN clasificacion_equipo c ON t.id_clasificacion = c.id_clasificacion
        -- ¡AQUÍ ESTÁ LA MAGIA DEL SOFT DELETE! Ocultamos los cancelados y archivados
        WHERE t.estado NOT IN ('Cancelado', 'Archivado')
        ORDER BY t.fecha_inicio DESC;
    `;
    const { rows } = await pool.query(query);
    return rows;
};
const obtenerEquiposElegibles = async (id_torneo) => {
    const torneoQuery = await pool.query(`SELECT id_clasificacion, fecha_inicio, fecha_fin FROM torneos WHERE id_torneo = $1`, [id_torneo]);
    const { id_clasificacion, fecha_inicio, fecha_fin } = torneoQuery.rows[0];

    const query = `
        SELECT e.id_equipo, e.nombre_oficial, e.siglas, c.nombre_cancha
        FROM equipos e
        LEFT JOIN canchas c ON e.id_cancha = c.id_cancha
        WHERE e.activo = true 
        AND e.id_entrenador IS NOT NULL 
        AND e.id_clasificacion = $1
        AND e.id_equipo NOT IN (
            SELECT i.id_equipo FROM inscripciones i
            JOIN torneos t ON i.id_torneo = t.id_torneo
            WHERE t.estado NOT IN ('Cancelado', 'Finalizado')
            AND i.estado_inscripcion = 'Aprobada'
            -- AQUÍ CORTAMOS EL TRASLAPE
            AND (t.fecha_inicio <= $3 AND t.fecha_fin >= $2)
        )
        ORDER BY e.nombre_oficial ASC;
    `;
    const { rows } = await pool.query(query, [id_clasificacion, fecha_inicio, fecha_fin]);
    return rows;
};

const inscribirEquipo = async (id_torneo, id_equipo) => {
    try {
        const query = `INSERT INTO inscripciones (id_torneo, id_equipo, estado_inscripcion) VALUES ($1, $2, 'Aprobada') RETURNING *;`;
        const { rows } = await pool.query(query, [id_torneo, id_equipo]);
        return rows[0];
    } catch (error) {
        if (error.message.includes('REGLA_TORNEO')) throw new Error(error.message);
        if (error.code === '23505') throw new Error('El equipo ya está inscrito en este torneo.');
        throw error;
    }
};
const obtenerEquiposInscritos = async (id_torneo) => {
    const query = `
        SELECT e.id_equipo, e.nombre_oficial, e.siglas, c.id_cancha, c.nombre_cancha
        FROM inscripciones i
        JOIN equipos e ON i.id_equipo = e.id_equipo
        LEFT JOIN canchas c ON e.id_cancha = c.id_cancha
        WHERE i.id_torneo = $1 AND i.estado_inscripcion = 'Aprobada';
    `;
    const { rows } = await pool.query(query, [id_torneo]);
    return rows;
};
const obtenerTorneosDeEntrenador = async (id_entrenador) => {
    const query = `
        SELECT t.id_torneo, t.nombre_torneo, t.fecha_inicio, t.fecha_fin, t.estado, t.categoria,
               t.reglamento, e.id_equipo, i.estado_inscripcion
        FROM torneos t
        JOIN inscripciones i ON t.id_torneo = i.id_torneo
        JOIN equipos e ON i.id_equipo = e.id_equipo
        WHERE e.id_entrenador = $1 AND i.estado_inscripcion = 'Aprobada'
        ORDER BY t.fecha_inicio DESC;
    `;
    const { rows } = await pool.query(query, [id_entrenador]);
    return rows;
};

module.exports = { crearTorneo, editarTorneo, iniciarTorneo, eliminarTorneo, quitarEquipo, 
    obtenerTodosActivos, obtenerEquiposElegibles, inscribirEquipo, obtenerEquiposInscritos, obtenerTorneosDeEntrenador };