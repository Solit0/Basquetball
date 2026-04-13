const { pgTable, unique, uuid, varchar, foreignKey, timestamp, boolean, text, date, integer, check, time, numeric, primaryKey } = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");

// 1. ROLES
const roles = pgTable("roles", {
    idRol: uuid("id_rol").defaultRandom().primaryKey().notNull(),
    nombreRol: varchar("nombre_rol", { length: 50 }).notNull(),
}, (table) => [
    unique("roles_nombre_rol_key").on(table.nombreRol),
]);

// 2. USUARIOS
const usuarios = pgTable("usuarios", {
    idUsuario: uuid("id_usuario").defaultRandom().primaryKey().notNull(),
    nombre: varchar("nombre", { length: 100 }).notNull(),
    apellido: varchar("apellido", { length: 100 }).notNull(),
    correo: varchar("correo", { length: 150 }).notNull(),
    contrasena: varchar("contrasena", { length: 255 }).notNull(),
    idRol: uuid("id_rol").notNull(),
    fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    activo: boolean("activo").default(true),
}, (table) => [
    foreignKey({
        columns: [table.idRol],
        foreignColumns: [roles.idRol],
        name: "usuarios_id_rol_fkey"
    }),
    unique("usuarios_correo_key").on(table.correo),
]);

// 3. TIPO CANAL
const tipoCanal = pgTable("tipo_canal", {
    idTipo: uuid("id_tipo").defaultRandom().primaryKey().notNull(),
    descripcion: varchar("descripcion", { length: 50 }).notNull(),
}, (table) => [
    unique("tipo_canal_descripcion_key").on(table.descripcion),
]);

// 4. CANALES
const canales = pgTable("canales", {
    idCanal: uuid("id_canal").defaultRandom().primaryKey().notNull(),
    nombreCanal: varchar("nombre_canal", { length: 150 }).notNull(),
    idTipo: uuid("id_tipo").notNull(),
    urlSitio: varchar("url_sitio", { length: 255 }),
    numeroCanal: varchar("numero_canal", { length: 20 }),
    horario: text("horario"),
    activo: boolean("activo").default(true),
}, (table) => [
    foreignKey({
        columns: [table.idTipo],
        foreignColumns: [tipoCanal.idTipo],
        name: "canales_id_tipo_fkey"
    }),
]);

// 5. CLASIFICACION EQUIPO
const clasificacionEquipo = pgTable("clasificacion_equipo", {
    idClasificacion: uuid("id_clasificacion").defaultRandom().primaryKey().notNull(),
    descripcion: varchar("descripcion", { length: 50 }).notNull(),
}, (table) => [
    unique("clasificacion_equipo_descripcion_key").on(table.descripcion),
]);

// 6. CANCHAS
const canchas = pgTable("canchas", {
    idCancha: uuid("id_cancha").defaultRandom().primaryKey().notNull(),
    nombreCancha: varchar("nombre_cancha", { length: 150 }).notNull(),
    capacidad: integer("capacidad"),
    direccion: varchar("direccion", { length: 255 }).notNull(),
    activo: boolean("activo").default(true),
}, (table) => [
    unique("canchas_direccion_key").on(table.direccion),
]);

// 7. JUGADORES
const jugadores = pgTable("jugadores", {
    idJugador: uuid("id_jugador").defaultRandom().primaryKey().notNull(),
    nombre: varchar("nombre", { length: 100 }).notNull(),
    apellido: varchar("apellido", { length: 100 }).notNull(),
    fechaNacimiento: date("fecha_nacimiento"),
    posicion: varchar("posicion", { length: 50 }),
    estatura: numeric("estatura", { precision: 4, scale: 2 }),
    activo: boolean("activo").default(true),
});

// 8. EQUIPOS
const equipos = pgTable("equipos", {
    idEquipo: uuid("id_equipo").defaultRandom().primaryKey().notNull(),
    nombreOficial: varchar("nombre_oficial", { length: 150 }).notNull(),
    siglas: varchar("siglas", { length: 10 }).notNull(),
    idClasificacion: uuid("id_clasificacion"),
    direccionCancha: varchar("direccion_cancha", { length: 255 }),
    idEntrenador: uuid("id_entrenador"),
    idCancha: uuid("id_cancha"),
    fechaCreacion: timestamp("fecha_creacion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    activo: boolean("activo").default(true),
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

// 9. TORNEOS
const torneos = pgTable("torneos", {
    idTorneo: uuid("id_torneo").defaultRandom().primaryKey().notNull(),
    nombreTorneo: varchar("nombre_torneo", { length: 200 }).notNull(),
    descripcion: text("descripcion"),
    categoria: varchar("categoria", { length: 50 }),
    fechaInicio: date("fecha_inicio").notNull(),
    fechaFin: date("fecha_fin").notNull(),
    numeroEquipos: integer("numero_equipos"),
    estado: varchar("estado", { length: 20 }).default('En inscripción'),
    idClasificacion: uuid("id_clasificacion"),
    reglamento: text("reglamento"),
}, (table) => [
    foreignKey({
        columns: [table.idClasificacion],
        foreignColumns: [clasificacionEquipo.idClasificacion],
        name: "torneos_id_clasificacion_fkey"
    }),
]);

// 10. INSCRIPCIONES
const inscripciones = pgTable("inscripciones", {
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

// 11. PARTIDOS
const partidos = pgTable("partidos", {
    idPartido: uuid("id_partido").defaultRandom().primaryKey().notNull(),
    idTorneo: uuid("id_torneo").notNull(),
    idEquipoLocal: uuid("id_equipo_local").notNull(),
    idEquipoVisitante: uuid("id_equipo_visitante").notNull(),
    idCancha: uuid("id_cancha").notNull(),
    idArbitroPrincipal: uuid("id_arbitro_principal"),
    idArbitroAsistente1: uuid("id_arbitro_asistente1"),
    idArbitroAsistente2: uuid("id_arbitro_asistente2"),
    fecha: date("fecha").notNull(),
    hora: time("hora").notNull(),
    rondaTorneo: varchar("ronda_torneo", { length: 50 }),
    estado: varchar("estado", { length: 20 }).default('Programado'),
    marcadorLocal: integer("marcador_local"),
    marcadorVisitante: integer("marcador_visitante"),
}, (table) => [
    foreignKey({ columns: [table.idArbitroAsistente1], foreignColumns: [usuarios.idUsuario], name: "partidos_id_arbitro_asistente1_fkey" }),
    foreignKey({ columns: [table.idArbitroAsistente2], foreignColumns: [usuarios.idUsuario], name: "partidos_id_arbitro_asistente2_fkey" }),
    foreignKey({ columns: [table.idArbitroPrincipal], foreignColumns: [usuarios.idUsuario], name: "partidos_id_arbitro_principal_fkey" }),
    foreignKey({ columns: [table.idCancha], foreignColumns: [canchas.idCancha], name: "partidos_id_cancha_fkey" }),
    foreignKey({ columns: [table.idEquipoLocal], foreignColumns: [equipos.idEquipo], name: "partidos_id_equipo_local_fkey" }),
    foreignKey({ columns: [table.idEquipoVisitante], foreignColumns: [equipos.idEquipo], name: "partidos_id_equipo_visitante_fkey" }),
    foreignKey({ columns: [table.idTorneo], foreignColumns: [torneos.idTorneo], name: "partidos_id_torneo_fkey" }),
    check("equipos_diferentes", sql`id_equipo_local <> id_equipo_visitante`),
]);

// 12. PLANTILLA EQUIPO
const plantillaEquipo = pgTable("plantilla_equipo", {
    idPlantilla: uuid("id_plantilla").defaultRandom().primaryKey().notNull(),
    idEquipo: uuid("id_equipo").notNull(),
    idJugador: uuid("id_jugador").notNull(),
    fechaIngreso: timestamp("fecha_ingreso", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    fechaSalida: timestamp("fecha_salida", { mode: 'string' }),
    activo: boolean("activo").default(true)
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
    })
]);
 
// 13. FAVORITOS
const favoritos = pgTable("favoritos", {
    idFavorito: uuid("id_favorito").defaultRandom().primaryKey().notNull(),
    idUsuario: uuid("id_usuario").notNull(),
    idEquipo: uuid("id_equipo"),
    idJugador: uuid("id_jugador"),
}, (table) => [
    foreignKey({ columns: [table.idEquipo], foreignColumns: [equipos.idEquipo], name: "favoritos_id_equipo_fkey" }),
    foreignKey({ columns: [table.idJugador], foreignColumns: [jugadores.idJugador], name: "favoritos_id_jugador_fkey" }),
    foreignKey({ columns: [table.idUsuario], foreignColumns: [usuarios.idUsuario], name: "favoritos_id_usuario_fkey" }),
    check("check_fav_tipo", sql`((id_equipo IS NOT NULL) AND (id_jugador IS NULL)) OR ((id_equipo IS NULL) AND (id_jugador IS NOT NULL))`),
]);

const alineaciones = pgTable("alineaciones", {
    idAlineacion: uuid("id_alineacion").defaultRandom().primaryKey().notNull(),
    idPartido: uuid("id_partido").notNull(),
    idJugador: uuid("id_jugador").notNull(),
    idEquipo: uuid("id_equipo").notNull(),
    presente: boolean("presente").default(false),
    minutosJugados: integer("minutos_jugados"),
    puntosAnotados: integer("puntos_anotados").default(0),
    faltasCometidas: integer("faltas_cometidas").default(0),
    rolPartido: varchar("rol_partido", { length: 20 }).default('Suplente'),
    esCapitanInterino: boolean("es_capitan_interino").default(false),
}, (table) => [
    foreignKey({ columns: [table.idEquipo], foreignColumns: [equipos.idEquipo], name: "alineaciones_id_equipo_fkey" }),
    foreignKey({ columns: [table.idJugador], foreignColumns: [jugadores.idJugador], name: "alineaciones_id_jugador_fkey" }),
    foreignKey({ columns: [table.idPartido], foreignColumns: [partidos.idPartido], name: "alineaciones_id_partido_fkey" }),
    check("alineaciones_rol_partido_check", sql`(rol_partido)::text = ANY ((ARRAY['Titular'::character varying, 'Suplente'::character varying, 'No Convocado'::character varying])::text[])`),
]);

const estadisticasPartido = pgTable("estadisticas_partido", {
    idEstadistica: uuid("id_estadistica").defaultRandom().primaryKey().notNull(),
    idPartido: uuid("id_partido").notNull(),
    idRoster: uuid("id_roster").notNull(), 
    puntosAnotados: integer("puntos_anotados").default(0),
}, (table) => [
    foreignKey({ columns: [table.idRoster], foreignColumns: [rosterTorneo.idRoster], name: "estadisticas_partido_id_roster_fkey" }).onDelete("cascade"),
    foreignKey({ columns: [table.idPartido], foreignColumns: [partidos.idPartido], name: "estadisticas_partido_id_partido_fkey" }).onDelete("cascade"),
]);
const informesPartido = pgTable("informes_partido", {
    idInforme: uuid("id_informe").defaultRandom().primaryKey().notNull(),
    idPartido: uuid("id_partido").notNull(),
    idArbitro: uuid("id_arbitro").notNull(),
    contenido: text("contenido").notNull(),
    fechaCreacion: timestamp("fecha_creacion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    fechaModificacion: timestamp("fecha_modificacion", { mode: 'string' }),
    enviado: boolean("enviado").default(false),
}, (table) => [
    foreignKey({ columns: [table.idArbitro], foreignColumns: [usuarios.idUsuario], name: "informes_partido_id_arbitro_fkey" }),
    foreignKey({ columns: [table.idPartido], foreignColumns: [partidos.idPartido], name: "informes_partido_id_partido_fkey" }),
    unique("informes_partido_id_partido_key").on(table.idPartido),
]);

const sanciones = pgTable("sanciones", {
    idSancion: uuid("id_sancion").defaultRandom().primaryKey().notNull(),
    idJugador: uuid("id_jugador").notNull(),
    idTorneo: uuid("id_torneo"),
    idPartido: uuid("id_partido"),
    motivo: text("motivo"),
    tipoSancion: varchar("tipo_sancion"),
    estadoResolucion: varchar("estado_resolucion").default('Pendiente'),
}, (table) => [
    foreignKey({
        columns: [table.idJugador],
        foreignColumns: [jugadores.idJugador],
        name: "sanciones_id_jugador_fkey"
    }),
    foreignKey({
        columns: [table.idTorneo],
        foreignColumns: [torneos.idTorneo],
        name: "sanciones_id_torneo_fkey"
    }),
    foreignKey({
        columns: [table.idPartido],
        foreignColumns: [partidos.idPartido],
        name: "sanciones_id_partido_fkey"
    })
]);

const transmisiones = pgTable("transmisiones", {
    idTransmision: uuid("id_transmision").defaultRandom().primaryKey().notNull(),
    idCanal: uuid("id_canal").notNull(),
    idPartido: uuid("id_partido").notNull(),
    horaTransmision: time("hora_transmision").notNull(),
}, (table) => [
    foreignKey({ columns: [table.idCanal], foreignColumns: [canales.idCanal], name: "transmisiones_id_canal_fkey" }).onDelete("cascade"),
    foreignKey({ columns: [table.idPartido], foreignColumns: [partidos.idPartido], name: "transmisiones_id_partido_fkey" }).onDelete("cascade"),
]);

const incidentes = pgTable("incidentes", {
    idIncidente: uuid("id_incidente").defaultRandom().primaryKey().notNull(),
    idInforme: uuid("id_informe").notNull(),
    tipoIncidente: varchar("tipo_incidente", { length: 100 }).notNull(),
    minutoAprox: integer("minuto_aprox"),
    descripcionBreve: text("descripcion_breve"),
}, (table) => [
    foreignKey({ columns: [table.idInforme], foreignColumns: [informesPartido.idInforme], name: "incidentes_id_informe_fkey" }).onDelete("cascade"),
]);

const evaluacionesArbitro = pgTable("evaluaciones_arbitro", {
    idEvaluacion: uuid("id_evaluacion").defaultRandom().primaryKey().notNull(),
    idInforme: uuid("id_informe").notNull(),
    idArbitro: uuid("id_arbitro").notNull(),
    idEvaluador: uuid("id_evaluador"),
    puntuacion: integer("puntuacion"),
    comentarios: text("comentarios"),
    fechaEvaluacion: timestamp("fecha_evaluacion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    respuestaArbitro: text("respuesta_arbitro"),
    fechaRespuesta: timestamp("fecha_respuesta", { mode: 'string' }),
}, (table) => [
    foreignKey({ columns: [table.idArbitro], foreignColumns: [usuarios.idUsuario], name: "evaluaciones_arbitro_id_arbitro_fkey" }),
    foreignKey({ columns: [table.idEvaluador], foreignColumns: [usuarios.idUsuario], name: "evaluaciones_arbitro_id_evaluador_fkey" }),
    foreignKey({ columns: [table.idInforme], foreignColumns: [informesPartido.idInforme], name: "evaluaciones_arbitro_id_informe_fkey" }),
    check("evaluaciones_arbitro_puntuacion_check", sql`(puntuacion >= 1) AND (puntuacion <= 10)`),
]);

const asistenciaPartidos = pgTable("asistencia_partidos", {
    idPartido: uuid("id_partido").notNull(),
    idRoster: uuid("id_roster").notNull(), 
    estado: varchar("estado", { length: 20 }).default('Ausente'),
    esCapitanInterino: boolean("es_capitan_interino").default(false),
}, (table) => [
    foreignKey({ columns: [table.idRoster], foreignColumns: [rosterTorneo.idRoster], name: "asistencia_partidos_id_roster_fkey" }).onDelete("cascade"),
    foreignKey({ columns: [table.idPartido], foreignColumns: [partidos.idPartido], name: "asistencia_partidos_id_partido_fkey" }).onDelete("cascade"),
    primaryKey({ columns: [table.idPartido, table.idRoster], name: "asistencia_partidos_pkey" }),
]);
const rosterTorneo = pgTable('roster_torneo', {
    idRoster: uuid('id_roster').defaultRandom().primaryKey(),
    idInscripcion: uuid('id_inscripcion').notNull().references(() => inscripciones.idInscripcion, { onDelete: 'cascade' }),
    idJugador: uuid('id_jugador').notNull().references(() => jugadores.idJugador),
    numeroCamiseta: integer('numero_camiseta').notNull(),
    rolRoster: varchar('rol_roster').default('Suplente'),
    esCapitan: boolean('es_capitan').default(false),
}, (table) => [
    unique("unique_jugador_roster")
        .on(table.idInscripcion, table.idJugador),

    unique("unique_numero_roster")
        .on(table.idInscripcion, table.numeroCamiseta),

    check(
        "roster_torneo_rol_roster_check",
        sql`(rol_roster)::text = ANY ((ARRAY['Titular', 'Suplente'])::text[])`
    ),
]);
const resolucionesDisciplinarias = pgTable("resoluciones_disciplinarias", {
    idResolucion: uuid("id_resolucion").defaultRandom().primaryKey().notNull(),
    idSancion: uuid("id_sancion").notNull().unique(),
    partidosSuspension: integer("partidos_suspension").default(0),
    partidosCumplidos: integer("partidos_cumplidos").default(0),
    montoMulta: numeric("monto_multa", { precision: 10, scale: 2 }).default('0.00'),
    estado: varchar("estado").default('Activa'),
    observacionesAdmin: text("observaciones_admin"),
    fechaResolucion: timestamp("fecha_resolucion", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
    multaPagada: boolean("multa_pagada").default(false),
}, (table) => [
    foreignKey({
        columns: [table.idSancion],
        foreignColumns: [sanciones.idSancion],
        name: "resoluciones_disciplinarias_id_sancion_fkey"
    }).onDelete("cascade")
]);
const zonasCancha = pgTable("zonas_cancha", {
    idZona: uuid("id_zona").defaultRandom().primaryKey().notNull(),
    idCancha: uuid("id_cancha").notNull().references(() => canchas.idCancha),
    nombreZona: varchar("nombre_zona", { length: 100 }).notNull(), 
    capacidad: integer("capacidad").notNull(),
    activo: boolean("activo").default(true),
});
const boletosPartido = pgTable("boletos_partido", {
    idBoleto: uuid("id_boleto").defaultRandom().primaryKey().notNull(),
    idPartido: uuid("id_partido").notNull().references(() => partidos.idPartido),
    idZona: uuid("id_zona").notNull().references(() => zonasCancha.idZona),
    precio: numeric("precio", { precision: 10, scale: 2 }).notNull(), 
    disponibles: integer("disponibles").notNull(), 
});
const transaccionesTicketing = pgTable("transacciones_ticketing", {
    idTransaccion: uuid("id_transaccion").defaultRandom().primaryKey().notNull(),
    idUsuario: uuid("id_usuario").notNull().references(() => usuarios.idUsuario), 
    idBoleto: uuid("id_boleto").notNull().references(() => boletosPartido.idBoleto),
    cantidad: integer("cantidad").notNull().default(1),
    montoTotal: numeric("monto_total", { precision: 10, scale: 2 }).notNull(),
    metodoPago: varchar("metodo_pago", { length: 50 }).notNull(), 
    estadoPago: varchar("estado_pago", { length: 20 }).default('Pendiente'), 
    fechaCompra: timestamp("fecha_compra").defaultNow(),
    referenciaPasarela: varchar("referencia_pasarela", { length: 255 }), 
});
module.exports = {
    roles,
    usuarios,
    tipoCanal,
    canales,
    clasificacionEquipo,
    canchas,
    jugadores,
    equipos,
    torneos,
    inscripciones,
    partidos,
    plantillaEquipo,
    favoritos,
    alineaciones,
    estadisticasPartido,
    informesPartido,
    sanciones,
    transmisiones,
    incidentes,
    evaluacionesArbitro,
    asistenciaPartidos,
    rosterTorneo,
    resolucionesDisciplinarias,
    zonasCancha,
    boletosPartido,
    transaccionesTicketing
};