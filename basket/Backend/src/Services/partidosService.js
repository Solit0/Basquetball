const pool = require('../Config/db');

const crearMultiples = async (partidos) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const resultados = [];
        
        if (partidos.length === 0) return [];

        const idTorneo = partidos[0].id_torneo;
        const torneoQuery = await client.query(`SELECT fecha_inicio, fecha_fin FROM torneos WHERE id_torneo = $1`, [idTorneo]);
        if (torneoQuery.rows.length === 0) throw new Error('El torneo no existe.');
        
        const { fecha_inicio, fecha_fin } = torneoQuery.rows[0];

        const formatYYYYMMDD = (d) => {
            const date = new Date(d);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const limiteInicio = formatYYYYMMDD(fecha_inicio);
        const limiteFin = formatYYYYMMDD(fecha_fin);

        for (const p of partidos) {
            if (!p.id_cancha) {
                throw new Error(`El equipo local "${p.local_nombre}" no tiene cancha. Asignale una.`);
            }
            if (!p.id_arbitro_principal) {
                throw new Error(`Falta asignar un árbitro para el partido de ${p.local_nombre} vs ${p.visitante_nombre}.`);
            }

            if (p.fecha < limiteInicio || p.fecha > limiteFin) {
                throw new Error(`REGLA_TORNEO: La fecha elegida (${p.fecha}) para ${p.local_nombre} vs ${p.visitante_nombre} está fuera del rango (${limiteInicio} al ${limiteFin}).`);
            }
            const query = `
                INSERT INTO partidos (id_torneo, id_equipo_local, id_equipo_visitante, id_cancha, fecha, hora, ronda_torneo, id_arbitro_principal)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
            `;
            const values = [p.id_torneo, p.id_equipo_local, p.id_equipo_visitante, p.id_cancha, p.fecha, p.hora, p.ronda_torneo, p.id_arbitro_principal];
            const { rows } = await client.query(query, values);
            resultados.push(rows[0]);
        }
        
        await client.query(`UPDATE torneos SET estado = 'En curso' WHERE id_torneo = $1`, [idTorneo]);

        await client.query('COMMIT');
        return resultados;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const obtenerPorTorneo = async (id_torneo) => {
    const query = `
        SELECT p.*,
               el.nombre_oficial as local_nombre, el.siglas as local_siglas,
               ev.nombre_oficial as visitante_nombre, ev.siglas as visitante_siglas,
               c.nombre_cancha
        FROM partidos p
        JOIN equipos el ON p.id_equipo_local = el.id_equipo
        JOIN equipos ev ON p.id_equipo_visitante = ev.id_equipo
        JOIN canchas c ON p.id_cancha = c.id_cancha
        WHERE p.id_torneo = $1
        ORDER BY p.fecha ASC, p.hora ASC;
    `;
    const { rows } = await pool.query(query, [id_torneo]);
    return rows;
};
const obtenerResumenPartido = async (id_partido) => {
    const queryPuntos = `
        SELECT ep.puntos_anotados, j.nombre, j.apellido, pe.id_equipo, pe.numero_camiseta
        FROM estadisticas_partido ep
        JOIN jugadores j ON ep.id_jugador = j.id_jugador
        JOIN plantilla_equipo pe ON j.id_jugador = pe.id_jugador
        WHERE ep.id_partido = $1
        ORDER BY ep.puntos_anotados DESC;
    `;
    const resPuntos = await pool.query(queryPuntos, [id_partido]);
    const querySanciones = `
        SELECT s.tipo_sancion, s.motivo, s.fecha_fin, j.nombre, j.apellido, pe.numero_camiseta, pe.id_equipo
        FROM sanciones s
        JOIN jugadores j ON s.id_jugador = j.id_jugador
        JOIN plantilla_equipo pe ON j.id_jugador = pe.id_jugador
        WHERE s.id_partido = $1;
    `;
    const resSanciones = await pool.query(querySanciones, [id_partido]);
    const queryInforme = `SELECT contenido FROM informes_partido WHERE id_partido = $1;`;
    const resInforme = await pool.query(queryInforme, [id_partido]);
    return {
        anotaciones: resPuntos.rows,
        sanciones: resSanciones.rows,
        informe: resInforme.rows.length > 0 ? resInforme.rows[0].contenido : 'No se redactó informe.'
    };
};
const finalizarPartido = async (id_partido, datosResultado) => {
    const { 
        marcador_local, marcador_visitante, id_arbitro, 
        informe_contenido, incidentes, sanciones, puntos_jugadores,
        id_torneo, id_equipo_local, id_equipo_visitante
    } = datosResultado;

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); 

        await client.query(`
            UPDATE partidos 
            SET marcador_local = $1, marcador_visitante = $2, 
                id_arbitro_principal = $3, estado = 'Finalizado'
            WHERE id_partido = $4
        `, [marcador_local, marcador_visitante, id_arbitro, id_partido]);

        const id_perdedor = marcador_local < marcador_visitante ? id_equipo_local : id_equipo_visitante;
        
        await client.query(`
            UPDATE inscripciones 
            SET estado_inscripcion = 'Eliminado' 
            WHERE id_torneo = $1 AND id_equipo = $2
        `, [id_torneo, id_perdedor]);

        // 3. Crear el Informe Arbitral
        const resInforme = await client.query(`
            INSERT INTO informes_partido (id_partido, id_arbitro, contenido, enviado)
            VALUES ($1, $2, $3, TRUE) RETURNING id_informe;
        `, [id_partido, id_arbitro, informe_contenido]);
        const id_informe = resInforme.rows[0].id_informe;

        // 4. Registrar Incidentes (Si hay)
        if (incidentes && incidentes.length > 0) {
            for (const inc of incidentes) {
                await client.query(`
                    INSERT INTO incidentes (id_informe, tipo_incidente, minuto_aprox, descripcion_breve)
                    VALUES ($1, $2, $3, $4)
                `, [id_informe, inc.tipo_incidente, inc.minuto_aprox, inc.descripcion_breve]);
            }
        }

        if (sanciones && sanciones.length > 0) {
            for (const san of sanciones) {
                await client.query(`
                    INSERT INTO sanciones (id_jugador, id_torneo, id_partido, motivo, fecha_inicio, fecha_fin, tipo_sancion)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [san.id_jugador, id_torneo, id_partido, san.motivo, san.fecha_inicio, san.fecha_fin, san.tipo_sancion]);
            }
        }

        if (puntos_jugadores && puntos_jugadores.length > 0) {
            for (const pj of puntos_jugadores) {
                if (pj.puntos > 0) {
                    await client.query(`
                        INSERT INTO estadisticas_partido (id_partido, id_jugador, puntos_anotados)
                        VALUES ($1, $2, $3)
                    `, [id_partido, pj.id_jugador, pj.puntos]);
                }
            }
        }

        await client.query('COMMIT'); 
        return { mensaje: 'Partido finalizado, informe guardado y perdedor eliminado.' };

    } catch (error) {
        await client.query('ROLLBACK'); 
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { crearMultiples, obtenerPorTorneo, finalizarPartido, obtenerResumenPartido };