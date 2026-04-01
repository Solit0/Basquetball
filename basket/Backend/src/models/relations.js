// models/relations.js
const { relations } = require("drizzle-orm/relations");
const schema = require("./schema"); 

const usuariosRelations = relations(schema.usuarios, ({one, many}) => ({
    role: one(schema.roles, {
        fields: [schema.usuarios.idRol],
        references: [schema.roles.idRol]
    }),
    equipos: many(schema.equipos),
    partidos_idArbitroAsistente1: many(schema.partidos, { relationName: "partidos_idArbitroAsistente1_usuarios_idUsuario" }),
    partidos_idArbitroAsistente2: many(schema.partidos, { relationName: "partidos_idArbitroAsistente2_usuarios_idUsuario" }),
    partidos_idArbitroPrincipal: many(schema.partidos, { relationName: "partidos_idArbitroPrincipal_usuarios_idUsuario" }),
    favoritos: many(schema.favoritos),
    informesPartidos: many(schema.informesPartido),
    evaluacionesArbitros_idArbitro: many(schema.evaluacionesArbitro, { relationName: "evaluacionesArbitro_idArbitro_usuarios_idUsuario" }),
    evaluacionesArbitros_idEvaluador: many(schema.evaluacionesArbitro, { relationName: "evaluacionesArbitro_idEvaluador_usuarios_idUsuario" }),
}));

const rolesRelations = relations(schema.roles, ({many}) => ({
    usuarios: many(schema.usuarios),
}));

const canalesRelations = relations(schema.canales, ({one, many}) => ({
    tipoCanal: one(schema.tipoCanal, { fields: [schema.canales.idTipo], references: [schema.tipoCanal.idTipo] }),
    transmisiones: many(schema.transmisiones),
}));

const tipoCanalRelations = relations(schema.tipoCanal, ({many}) => ({
    canales: many(schema.canales),
}));

const torneosRelations = relations(schema.torneos, ({one, many}) => ({
    clasificacionEquipo: one(schema.clasificacionEquipo, { fields: [schema.torneos.idClasificacion], references: [schema.clasificacionEquipo.idClasificacion] }),
    inscripciones: many(schema.inscripciones),
    partidos: many(schema.partidos),
    sanciones: many(schema.sanciones),
}));

const clasificacionEquipoRelations = relations(schema.clasificacionEquipo, ({many}) => ({
    torneos: many(schema.torneos),
    equipos: many(schema.equipos),
}));

const equiposRelations = relations(schema.equipos, ({one, many}) => ({
    cancha: one(schema.canchas, { fields: [schema.equipos.idCancha], references: [schema.canchas.idCancha] }),
    clasificacionEquipo: one(schema.clasificacionEquipo, { fields: [schema.equipos.idClasificacion], references: [schema.clasificacionEquipo.idClasificacion] }),
    usuario: one(schema.usuarios, { fields: [schema.equipos.idEntrenador], references: [schema.usuarios.idUsuario] }),
    inscripciones: many(schema.inscripciones),
    partidos_idEquipoLocal: many(schema.partidos, { relationName: "partidos_idEquipoLocal_equipos_idEquipo" }),
    partidos_idEquipoVisitante: many(schema.partidos, { relationName: "partidos_idEquipoVisitante_equipos_idEquipo" }),
    plantillaEquipos: many(schema.plantillaEquipo),
    favoritos: many(schema.favoritos),
    alineaciones: many(schema.alineaciones),
}));

const canchasRelations = relations(schema.canchas, ({many}) => ({
    equipos: many(schema.equipos),
    partidos: many(schema.partidos),
}));

const inscripcionesRelations = relations(schema.inscripciones, ({one}) => ({
    equipo: one(schema.equipos, { fields: [schema.inscripciones.idEquipo], references: [schema.equipos.idEquipo] }),
    torneo: one(schema.torneos, { fields: [schema.inscripciones.idTorneo], references: [schema.torneos.idTorneo] }),
}));

const partidosRelations = relations(schema.partidos, ({one, many}) => ({
    usuario_idArbitroAsistente1: one(schema.usuarios, { fields: [schema.partidos.idArbitroAsistente1], references: [schema.usuarios.idUsuario], relationName: "partidos_idArbitroAsistente1_usuarios_idUsuario" }),
    usuario_idArbitroAsistente2: one(schema.usuarios, { fields: [schema.partidos.idArbitroAsistente2], references: [schema.usuarios.idUsuario], relationName: "partidos_idArbitroAsistente2_usuarios_idUsuario" }),
    usuario_idArbitroPrincipal: one(schema.usuarios, { fields: [schema.partidos.idArbitroPrincipal], references: [schema.usuarios.idUsuario], relationName: "partidos_idArbitroPrincipal_usuarios_idUsuario" }),
    cancha: one(schema.canchas, { fields: [schema.partidos.idCancha], references: [schema.canchas.idCancha] }),
    equipo_idEquipoLocal: one(schema.equipos, { fields: [schema.partidos.idEquipoLocal], references: [schema.equipos.idEquipo], relationName: "partidos_idEquipoLocal_equipos_idEquipo" }),
    equipo_idEquipoVisitante: one(schema.equipos, { fields: [schema.partidos.idEquipoVisitante], references: [schema.equipos.idEquipo], relationName: "partidos_idEquipoVisitante_equipos_idEquipo" }),
    torneo: one(schema.torneos, { fields: [schema.partidos.idTorneo], references: [schema.torneos.idTorneo] }),
    alineaciones: many(schema.alineaciones),
    estadisticasPartidos: many(schema.estadisticasPartido),
    informesPartidos: many(schema.informesPartido),
    sanciones: many(schema.sanciones),
    transmisiones: many(schema.transmisiones),
    asistenciaPartidos: many(schema.asistenciaPartidos),
}));

const plantillaEquipoRelations = relations(schema.plantillaEquipo, ({one}) => ({
    equipo: one(schema.equipos, { fields: [schema.plantillaEquipo.idEquipo], references: [schema.equipos.idEquipo] }),
    jugadore: one(schema.jugadores, { fields: [schema.plantillaEquipo.idJugador], references: [schema.jugadores.idJugador] }),
}));

const jugadoresRelations = relations(schema.jugadores, ({many}) => ({
    plantillaEquipos: many(schema.plantillaEquipo),
    favoritos: many(schema.favoritos),
    alineaciones: many(schema.alineaciones),
    estadisticasPartidos: many(schema.estadisticasPartido),
    sanciones: many(schema.sanciones),
    asistenciaPartidos: many(schema.asistenciaPartidos),
}));

const favoritosRelations = relations(schema.favoritos, ({one}) => ({
    equipo: one(schema.equipos, { fields: [schema.favoritos.idEquipo], references: [schema.equipos.idEquipo] }),
    jugadore: one(schema.jugadores, { fields: [schema.favoritos.idJugador], references: [schema.jugadores.idJugador] }),
    usuario: one(schema.usuarios, { fields: [schema.favoritos.idUsuario], references: [schema.usuarios.idUsuario] }),
}));

const alineacionesRelations = relations(schema.alineaciones, ({one}) => ({
    equipo: one(schema.equipos, { fields: [schema.alineaciones.idEquipo], references: [schema.equipos.idEquipo] }),
    jugadore: one(schema.jugadores, { fields: [schema.alineaciones.idJugador], references: [schema.jugadores.idJugador] }),
    partido: one(schema.partidos, { fields: [schema.alineaciones.idPartido], references: [schema.partidos.idPartido] }),
}));

const estadisticasPartidoRelations = relations(schema.estadisticasPartido, ({one}) => ({
    jugadore: one(schema.jugadores, { fields: [schema.estadisticasPartido.idJugador], references: [schema.jugadores.idJugador] }),
    partido: one(schema.partidos, { fields: [schema.estadisticasPartido.idPartido], references: [schema.partidos.idPartido] }),
}));

const informesPartidoRelations = relations(schema.informesPartido, ({one, many}) => ({
    usuario: one(schema.usuarios, { fields: [schema.informesPartido.idArbitro], references: [schema.usuarios.idUsuario] }),
    partido: one(schema.partidos, { fields: [schema.informesPartido.idPartido], references: [schema.partidos.idPartido] }),
    incidentes: many(schema.incidentes),
    evaluacionesArbitros: many(schema.evaluacionesArbitro),
}));

const sancionesRelations = relations(schema.sanciones, ({one}) => ({
    jugadore: one(schema.jugadores, { fields: [schema.sanciones.idJugador], references: [schema.jugadores.idJugador] }),
    partido: one(schema.partidos, { fields: [schema.sanciones.idPartido], references: [schema.partidos.idPartido] }),
    torneo: one(schema.torneos, { fields: [schema.sanciones.idTorneo], references: [schema.torneos.idTorneo] }),
}));

const transmisionesRelations = relations(schema.transmisiones, ({one}) => ({
    canale: one(schema.canales, { fields: [schema.transmisiones.idCanal], references: [schema.canales.idCanal] }),
    partido: one(schema.partidos, { fields: [schema.transmisiones.idPartido], references: [schema.partidos.idPartido] }),
}));

const incidentesRelations = relations(schema.incidentes, ({one}) => ({
    informesPartido: one(schema.informesPartido, { fields: [schema.incidentes.idInforme], references: [schema.informesPartido.idInforme] }),
}));

const evaluacionesArbitroRelations = relations(schema.evaluacionesArbitro, ({one}) => ({
    usuario_idArbitro: one(schema.usuarios, { fields: [schema.evaluacionesArbitro.idArbitro], references: [schema.usuarios.idUsuario], relationName: "evaluacionesArbitro_idArbitro_usuarios_idUsuario" }),
    usuario_idEvaluador: one(schema.usuarios, { fields: [schema.evaluacionesArbitro.idEvaluador], references: [schema.usuarios.idUsuario], relationName: "evaluacionesArbitro_idEvaluador_usuarios_idUsuario" }),
    informesPartido: one(schema.informesPartido, { fields: [schema.evaluacionesArbitro.idInforme], references: [schema.informesPartido.idInforme] }),
}));

const asistenciaPartidosRelations = relations(schema.asistenciaPartidos, ({one}) => ({
    jugadore: one(schema.jugadores, { fields: [schema.asistenciaPartidos.idJugador], references: [schema.jugadores.idJugador] }),
    partido: one(schema.partidos, { fields: [schema.asistenciaPartidos.idPartido], references: [schema.partidos.idPartido] }),
}));

module.exports = {
    usuariosRelations,
    rolesRelations,
    canalesRelations,
    tipoCanalRelations,
    torneosRelations,
    clasificacionEquipoRelations,
    equiposRelations,
    canchasRelations,
    inscripcionesRelations,
    partidosRelations,
    plantillaEquipoRelations,
    jugadoresRelations,
    favoritosRelations,
    alineacionesRelations,
    estadisticasPartidoRelations,
    informesPartidoRelations,
    sancionesRelations,
    transmisionesRelations,
    incidentesRelations,
    evaluacionesArbitroRelations,
    asistenciaPartidosRelations
};