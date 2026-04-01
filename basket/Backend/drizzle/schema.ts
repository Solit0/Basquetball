import { pgTable, unique, uuid, varchar, foreignKey, timestamp, boolean, text, date, integer, check, time, numeric, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const roles = pgTable("roles", {
	idRol: uuid("id_rol").defaultRandom().primaryKey().notNull(),
	nombreRol: varchar("nombre_rol", { length: 50 }).notNull(),
}, (table) => [
	unique("roles_nombre_rol_key").on(table.nombreRol),
]);

export const usuarios = pgTable("usuarios", {
	idUsuario: uuid("id_usuario").defaultRandom().primaryKey().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	apellido: varchar({ length: 100 }).notNull(),
	correo: varchar({ length: 150 }).notNull(),
	contrasena: varchar({ length: 255 }).notNull(),
	idRol: uuid("id_rol").notNull(),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idRol],
			foreignColumns: [roles.idRol],
			name: "usuarios_id_rol_fkey"
		}),
	unique("usuarios_correo_key").on(table.correo),
]);

export const tipoCanal = pgTable("tipo_canal", {
	idTipo: uuid("id_tipo").defaultRandom().primaryKey().notNull(),
	descripcion: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("tipo_canal_descripcion_key").on(table.descripcion),
]);

export const canales = pgTable("canales", {
	idCanal: uuid("id_canal").defaultRandom().primaryKey().notNull(),
	nombreCanal: varchar("nombre_canal", { length: 150 }).notNull(),
	idTipo: uuid("id_tipo").notNull(),
	urlSitio: varchar("url_sitio", { length: 255 }),
	numeroCanal: varchar("numero_canal", { length: 20 }),
	horario: text(),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idTipo],
			foreignColumns: [tipoCanal.idTipo],
			name: "canales_id_tipo_fkey"
		}),
]);

export const clasificacionEquipo = pgTable("clasificacion_equipo", {
	idClasificacion: uuid("id_clasificacion").defaultRandom().primaryKey().notNull(),
	descripcion: varchar({ length: 50 }).notNull(),
}, (table) => [
	unique("clasificacion_equipo_descripcion_key").on(table.descripcion),
]);

export const torneos = pgTable("torneos", {
	idTorneo: uuid("id_torneo").defaultRandom().primaryKey().notNull(),
	nombreTorneo: varchar("nombre_torneo", { length: 200 }).notNull(),
	descripcion: text(),
	categoria: varchar({ length: 50 }),
	fechaInicio: date("fecha_inicio").notNull(),
	fechaFin: date("fecha_fin").notNull(),
	numeroEquipos: integer("numero_equipos"),
	estado: varchar({ length: 20 }).default('En inscripción'),
	idClasificacion: uuid("id_clasificacion"),
	reglamento: text(),
}, (table) => [
	foreignKey({
			columns: [table.idClasificacion],
			foreignColumns: [clasificacionEquipo.idClasificacion],
			name: "torneos_id_clasificacion_fkey"
		}),
]);

export const equipos = pgTable("equipos", {
	idEquipo: uuid("id_equipo").defaultRandom().primaryKey().notNull(),
	nombreOficial: varchar("nombre_oficial", { length: 150 }).notNull(),
	siglas: varchar({ length: 10 }).notNull(),
	idClasificacion: uuid("id_clasificacion"),
	direccionCancha: varchar("direccion_cancha", { length: 255 }),
	idEntrenador: uuid("id_entrenador"),
	idCancha: uuid("id_cancha"),
	fechaCreacion: timestamp("fecha_creacion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	activo: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idCancha],
			foreignColumns: [canchas.idCancha],
			name: "equipos_id_cancha_fkey"
		}),
	foreignKey({
			columns: [table.idClasificacion],
			foreignColumns: [clasificacionEquipo.idClasificacion],
			name: "equipos_id_clasificacion_fkey"
		}),
	foreignKey({
			columns: [table.idEntrenador],
			foreignColumns: [usuarios.idUsuario],
			name: "equipos_id_entrenador_fkey"
		}),
	unique("equipos_nombre_oficial_key").on(table.nombreOficial),
]);

export const canchas = pgTable("canchas", {
	idCancha: uuid("id_cancha").defaultRandom().primaryKey().notNull(),
	nombreCancha: varchar("nombre_cancha", { length: 150 }).notNull(),
	capacidad: integer(),
	direccion: varchar({ length: 255 }).notNull(),
	activo: boolean().default(true),
}, (table) => [
	unique("canchas_direccion_key").on(table.direccion),
]);

export const inscripciones = pgTable("inscripciones", {
	idInscripcion: uuid("id_inscripcion").defaultRandom().primaryKey().notNull(),
	idEquipo: uuid("id_equipo").notNull(),
	idTorneo: uuid("id_torneo").notNull(),
	fechaInscripcion: timestamp("fecha_inscripcion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	estadoInscripcion: varchar("estado_inscripcion", { length: 20 }).default('Pendiente'),
}, (table) => [
	foreignKey({
			columns: [table.idEquipo],
			foreignColumns: [equipos.idEquipo],
			name: "inscripciones_id_equipo_fkey"
		}),
	foreignKey({
			columns: [table.idTorneo],
			foreignColumns: [torneos.idTorneo],
			name: "inscripciones_id_torneo_fkey"
		}),
	unique("unique_equipo_torneo").on(table.idEquipo, table.idTorneo),
]);

export const partidos = pgTable("partidos", {
	idPartido: uuid("id_partido").defaultRandom().primaryKey().notNull(),
	idTorneo: uuid("id_torneo").notNull(),
	idEquipoLocal: uuid("id_equipo_local").notNull(),
	idEquipoVisitante: uuid("id_equipo_visitante").notNull(),
	idCancha: uuid("id_cancha").notNull(),
	idArbitroPrincipal: uuid("id_arbitro_principal"),
	idArbitroAsistente1: uuid("id_arbitro_asistente1"),
	idArbitroAsistente2: uuid("id_arbitro_asistente2"),
	fecha: date().notNull(),
	hora: time().notNull(),
	rondaTorneo: varchar("ronda_torneo", { length: 50 }),
	estado: varchar({ length: 20 }).default('Programado'),
	marcadorLocal: integer("marcador_local"),
	marcadorVisitante: integer("marcador_visitante"),
}, (table) => [
	foreignKey({
			columns: [table.idArbitroAsistente1],
			foreignColumns: [usuarios.idUsuario],
			name: "partidos_id_arbitro_asistente1_fkey"
		}),
	foreignKey({
			columns: [table.idArbitroAsistente2],
			foreignColumns: [usuarios.idUsuario],
			name: "partidos_id_arbitro_asistente2_fkey"
		}),
	foreignKey({
			columns: [table.idArbitroPrincipal],
			foreignColumns: [usuarios.idUsuario],
			name: "partidos_id_arbitro_principal_fkey"
		}),
	foreignKey({
			columns: [table.idCancha],
			foreignColumns: [canchas.idCancha],
			name: "partidos_id_cancha_fkey"
		}),
	foreignKey({
			columns: [table.idEquipoLocal],
			foreignColumns: [equipos.idEquipo],
			name: "partidos_id_equipo_local_fkey"
		}),
	foreignKey({
			columns: [table.idEquipoVisitante],
			foreignColumns: [equipos.idEquipo],
			name: "partidos_id_equipo_visitante_fkey"
		}),
	foreignKey({
			columns: [table.idTorneo],
			foreignColumns: [torneos.idTorneo],
			name: "partidos_id_torneo_fkey"
		}),
	check("equipos_diferentes", sql`id_equipo_local <> id_equipo_visitante`),
]);

export const plantillaEquipo = pgTable("plantilla_equipo", {
	idPlantilla: uuid("id_plantilla").defaultRandom().primaryKey().notNull(),
	idEquipo: uuid("id_equipo").notNull(),
	idJugador: uuid("id_jugador").notNull(),
	numeroCamiseta: integer("numero_camiseta").notNull(),
	esCapitan: boolean("es_capitan").default(false),
	fechaIngreso: date("fecha_ingreso").default(sql`CURRENT_DATE`),
	fechaSalida: date("fecha_salida"),
	activo: boolean().default(true),
	rolEquipo: varchar("rol_equipo", { length: 20 }).default('Suplente'),
}, (table) => [
	foreignKey({
			columns: [table.idEquipo],
			foreignColumns: [equipos.idEquipo],
			name: "plantilla_equipo_id_equipo_fkey"
		}),
	foreignKey({
			columns: [table.idJugador],
			foreignColumns: [jugadores.idJugador],
			name: "plantilla_equipo_id_jugador_fkey"
		}),
	unique("unique_jugador_equipo").on(table.idEquipo, table.idJugador),
	check("plantilla_equipo_rol_equipo_check", sql`(rol_equipo)::text = ANY ((ARRAY['Titular'::character varying, 'Suplente'::character varying, 'No Convocado'::character varying])::text[])`),
]);

export const jugadores = pgTable("jugadores", {
	idJugador: uuid("id_jugador").defaultRandom().primaryKey().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	apellido: varchar({ length: 100 }).notNull(),
	fechaNacimiento: date("fecha_nacimiento"),
	posicion: varchar({ length: 50 }),
	estatura: numeric({ precision: 4, scale:  2 }),
	activo: boolean().default(true),
});

export const favoritos = pgTable("favoritos", {
	idFavorito: uuid("id_favorito").defaultRandom().primaryKey().notNull(),
	idUsuario: uuid("id_usuario").notNull(),
	idEquipo: uuid("id_equipo"),
	idJugador: uuid("id_jugador"),
}, (table) => [
	foreignKey({
			columns: [table.idEquipo],
			foreignColumns: [equipos.idEquipo],
			name: "favoritos_id_equipo_fkey"
		}),
	foreignKey({
			columns: [table.idJugador],
			foreignColumns: [jugadores.idJugador],
			name: "favoritos_id_jugador_fkey"
		}),
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuarios.idUsuario],
			name: "favoritos_id_usuario_fkey"
		}),
	check("check_fav_tipo", sql`((id_equipo IS NOT NULL) AND (id_jugador IS NULL)) OR ((id_equipo IS NULL) AND (id_jugador IS NOT NULL))`),
]);

export const alineaciones = pgTable("alineaciones", {
	idAlineacion: uuid("id_alineacion").defaultRandom().primaryKey().notNull(),
	idPartido: uuid("id_partido").notNull(),
	idJugador: uuid("id_jugador").notNull(),
	idEquipo: uuid("id_equipo").notNull(),
	presente: boolean().default(false),
	minutosJugados: integer("minutos_jugados"),
	puntosAnotados: integer("puntos_anotados").default(0),
	faltasCometidas: integer("faltas_cometidas").default(0),
	rolPartido: varchar("rol_partido", { length: 20 }).default('Suplente'),
}, (table) => [
	foreignKey({
			columns: [table.idEquipo],
			foreignColumns: [equipos.idEquipo],
			name: "alineaciones_id_equipo_fkey"
		}),
	foreignKey({
			columns: [table.idJugador],
			foreignColumns: [jugadores.idJugador],
			name: "alineaciones_id_jugador_fkey"
		}),
	foreignKey({
			columns: [table.idPartido],
			foreignColumns: [partidos.idPartido],
			name: "alineaciones_id_partido_fkey"
		}),
	check("alineaciones_rol_partido_check", sql`(rol_partido)::text = ANY ((ARRAY['Titular'::character varying, 'Suplente'::character varying, 'No Convocado'::character varying])::text[])`),
]);

export const estadisticasPartido = pgTable("estadisticas_partido", {
	idEstadistica: uuid("id_estadistica").defaultRandom().primaryKey().notNull(),
	idPartido: uuid("id_partido").notNull(),
	idJugador: uuid("id_jugador").notNull(),
	puntosAnotados: integer("puntos_anotados").default(0),
}, (table) => [
	foreignKey({
			columns: [table.idJugador],
			foreignColumns: [jugadores.idJugador],
			name: "estadisticas_partido_id_jugador_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idPartido],
			foreignColumns: [partidos.idPartido],
			name: "estadisticas_partido_id_partido_fkey"
		}).onDelete("cascade"),
]);

export const informesPartido = pgTable("informes_partido", {
	idInforme: uuid("id_informe").defaultRandom().primaryKey().notNull(),
	idPartido: uuid("id_partido").notNull(),
	idArbitro: uuid("id_arbitro").notNull(),
	contenido: text().notNull(),
	fechaCreacion: timestamp("fecha_creacion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	fechaModificacion: timestamp("fecha_modificacion", { mode: 'string' }),
	enviado: boolean().default(false),
}, (table) => [
	foreignKey({
			columns: [table.idArbitro],
			foreignColumns: [usuarios.idUsuario],
			name: "informes_partido_id_arbitro_fkey"
		}),
	foreignKey({
			columns: [table.idPartido],
			foreignColumns: [partidos.idPartido],
			name: "informes_partido_id_partido_fkey"
		}),
	unique("informes_partido_id_partido_key").on(table.idPartido),
]);

export const sanciones = pgTable("sanciones", {
	idSancion: uuid("id_sancion").defaultRandom().primaryKey().notNull(),
	idJugador: uuid("id_jugador").notNull(),
	idTorneo: uuid("id_torneo"),
	idPartido: uuid("id_partido"),
	motivo: text(),
	fechaInicio: date("fecha_inicio"),
	fechaFin: date("fecha_fin"),
	tipoSancion: varchar("tipo_sancion", { length: 50 }),
	activa: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.idJugador],
			foreignColumns: [jugadores.idJugador],
			name: "sanciones_id_jugador_fkey"
		}),
	foreignKey({
			columns: [table.idPartido],
			foreignColumns: [partidos.idPartido],
			name: "sanciones_id_partido_fkey"
		}),
	foreignKey({
			columns: [table.idTorneo],
			foreignColumns: [torneos.idTorneo],
			name: "sanciones_id_torneo_fkey"
		}),
]);

export const transmisiones = pgTable("transmisiones", {
	idTransmision: uuid("id_transmision").defaultRandom().primaryKey().notNull(),
	idCanal: uuid("id_canal").notNull(),
	idPartido: uuid("id_partido").notNull(),
	horaTransmision: time("hora_transmision").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idCanal],
			foreignColumns: [canales.idCanal],
			name: "transmisiones_id_canal_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idPartido],
			foreignColumns: [partidos.idPartido],
			name: "transmisiones_id_partido_fkey"
		}).onDelete("cascade"),
]);

export const incidentes = pgTable("incidentes", {
	idIncidente: uuid("id_incidente").defaultRandom().primaryKey().notNull(),
	idInforme: uuid("id_informe").notNull(),
	tipoIncidente: varchar("tipo_incidente", { length: 100 }).notNull(),
	minutoAprox: integer("minuto_aprox"),
	descripcionBreve: text("descripcion_breve"),
}, (table) => [
	foreignKey({
			columns: [table.idInforme],
			foreignColumns: [informesPartido.idInforme],
			name: "incidentes_id_informe_fkey"
		}).onDelete("cascade"),
]);

export const evaluacionesArbitro = pgTable("evaluaciones_arbitro", {
	idEvaluacion: uuid("id_evaluacion").defaultRandom().primaryKey().notNull(),
	idInforme: uuid("id_informe").notNull(),
	idArbitro: uuid("id_arbitro").notNull(),
	idEvaluador: uuid("id_evaluador"),
	puntuacion: integer(),
	comentarios: text(),
	fechaEvaluacion: timestamp("fecha_evaluacion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	respuestaArbitro: text("respuesta_arbitro"),
	fechaRespuesta: timestamp("fecha_respuesta", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.idArbitro],
			foreignColumns: [usuarios.idUsuario],
			name: "evaluaciones_arbitro_id_arbitro_fkey"
		}),
	foreignKey({
			columns: [table.idEvaluador],
			foreignColumns: [usuarios.idUsuario],
			name: "evaluaciones_arbitro_id_evaluador_fkey"
		}),
	foreignKey({
			columns: [table.idInforme],
			foreignColumns: [informesPartido.idInforme],
			name: "evaluaciones_arbitro_id_informe_fkey"
		}),
	check("evaluaciones_arbitro_puntuacion_check", sql`(puntuacion >= 1) AND (puntuacion <= 10)`),
]);

export const asistenciaPartidos = pgTable("asistencia_partidos", {
	idPartido: uuid("id_partido").notNull(),
	idJugador: uuid("id_jugador").notNull(),
	estado: varchar({ length: 20 }).default('Ausente'),
}, (table) => [
	foreignKey({
			columns: [table.idJugador],
			foreignColumns: [jugadores.idJugador],
			name: "asistencia_partidos_id_jugador_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.idPartido],
			foreignColumns: [partidos.idPartido],
			name: "asistencia_partidos_id_partido_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.idPartido, table.idJugador], name: "asistencia_partidos_pkey"}),
]);
