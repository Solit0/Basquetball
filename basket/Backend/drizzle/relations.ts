import { relations } from "drizzle-orm/relations";
import { roles, usuarios, tipoCanal, canales, clasificacionEquipo, torneos, canchas, equipos, inscripciones, partidos, plantillaEquipo, jugadores, favoritos, alineaciones, estadisticasPartido, informesPartido, sanciones, transmisiones, incidentes, evaluacionesArbitro, asistenciaPartidos } from "./schema";

export const usuariosRelations = relations(usuarios, ({one, many}) => ({
	role: one(roles, {
		fields: [usuarios.idRol],
		references: [roles.idRol]
	}),
	equipos: many(equipos),
	partidos_idArbitroAsistente1: many(partidos, {
		relationName: "partidos_idArbitroAsistente1_usuarios_idUsuario"
	}),
	partidos_idArbitroAsistente2: many(partidos, {
		relationName: "partidos_idArbitroAsistente2_usuarios_idUsuario"
	}),
	partidos_idArbitroPrincipal: many(partidos, {
		relationName: "partidos_idArbitroPrincipal_usuarios_idUsuario"
	}),
	favoritos: many(favoritos),
	informesPartidos: many(informesPartido),
	evaluacionesArbitros_idArbitro: many(evaluacionesArbitro, {
		relationName: "evaluacionesArbitro_idArbitro_usuarios_idUsuario"
	}),
	evaluacionesArbitros_idEvaluador: many(evaluacionesArbitro, {
		relationName: "evaluacionesArbitro_idEvaluador_usuarios_idUsuario"
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	usuarios: many(usuarios),
}));

export const canalesRelations = relations(canales, ({one, many}) => ({
	tipoCanal: one(tipoCanal, {
		fields: [canales.idTipo],
		references: [tipoCanal.idTipo]
	}),
	transmisiones: many(transmisiones),
}));

export const tipoCanalRelations = relations(tipoCanal, ({many}) => ({
	canales: many(canales),
}));

export const torneosRelations = relations(torneos, ({one, many}) => ({
	clasificacionEquipo: one(clasificacionEquipo, {
		fields: [torneos.idClasificacion],
		references: [clasificacionEquipo.idClasificacion]
	}),
	inscripciones: many(inscripciones),
	partidos: many(partidos),
	sanciones: many(sanciones),
}));

export const clasificacionEquipoRelations = relations(clasificacionEquipo, ({many}) => ({
	torneos: many(torneos),
	equipos: many(equipos),
}));

export const equiposRelations = relations(equipos, ({one, many}) => ({
	cancha: one(canchas, {
		fields: [equipos.idCancha],
		references: [canchas.idCancha]
	}),
	clasificacionEquipo: one(clasificacionEquipo, {
		fields: [equipos.idClasificacion],
		references: [clasificacionEquipo.idClasificacion]
	}),
	usuario: one(usuarios, {
		fields: [equipos.idEntrenador],
		references: [usuarios.idUsuario]
	}),
	inscripciones: many(inscripciones),
	partidos_idEquipoLocal: many(partidos, {
		relationName: "partidos_idEquipoLocal_equipos_idEquipo"
	}),
	partidos_idEquipoVisitante: many(partidos, {
		relationName: "partidos_idEquipoVisitante_equipos_idEquipo"
	}),
	plantillaEquipos: many(plantillaEquipo),
	favoritos: many(favoritos),
	alineaciones: many(alineaciones),
}));

export const canchasRelations = relations(canchas, ({many}) => ({
	equipos: many(equipos),
	partidos: many(partidos),
}));

export const inscripcionesRelations = relations(inscripciones, ({one}) => ({
	equipo: one(equipos, {
		fields: [inscripciones.idEquipo],
		references: [equipos.idEquipo]
	}),
	torneo: one(torneos, {
		fields: [inscripciones.idTorneo],
		references: [torneos.idTorneo]
	}),
}));

export const partidosRelations = relations(partidos, ({one, many}) => ({
	usuario_idArbitroAsistente1: one(usuarios, {
		fields: [partidos.idArbitroAsistente1],
		references: [usuarios.idUsuario],
		relationName: "partidos_idArbitroAsistente1_usuarios_idUsuario"
	}),
	usuario_idArbitroAsistente2: one(usuarios, {
		fields: [partidos.idArbitroAsistente2],
		references: [usuarios.idUsuario],
		relationName: "partidos_idArbitroAsistente2_usuarios_idUsuario"
	}),
	usuario_idArbitroPrincipal: one(usuarios, {
		fields: [partidos.idArbitroPrincipal],
		references: [usuarios.idUsuario],
		relationName: "partidos_idArbitroPrincipal_usuarios_idUsuario"
	}),
	cancha: one(canchas, {
		fields: [partidos.idCancha],
		references: [canchas.idCancha]
	}),
	equipo_idEquipoLocal: one(equipos, {
		fields: [partidos.idEquipoLocal],
		references: [equipos.idEquipo],
		relationName: "partidos_idEquipoLocal_equipos_idEquipo"
	}),
	equipo_idEquipoVisitante: one(equipos, {
		fields: [partidos.idEquipoVisitante],
		references: [equipos.idEquipo],
		relationName: "partidos_idEquipoVisitante_equipos_idEquipo"
	}),
	torneo: one(torneos, {
		fields: [partidos.idTorneo],
		references: [torneos.idTorneo]
	}),
	alineaciones: many(alineaciones),
	estadisticasPartidos: many(estadisticasPartido),
	informesPartidos: many(informesPartido),
	sanciones: many(sanciones),
	transmisiones: many(transmisiones),
	asistenciaPartidos: many(asistenciaPartidos),
}));

export const plantillaEquipoRelations = relations(plantillaEquipo, ({one}) => ({
	equipo: one(equipos, {
		fields: [plantillaEquipo.idEquipo],
		references: [equipos.idEquipo]
	}),
	jugadore: one(jugadores, {
		fields: [plantillaEquipo.idJugador],
		references: [jugadores.idJugador]
	}),
}));

export const jugadoresRelations = relations(jugadores, ({many}) => ({
	plantillaEquipos: many(plantillaEquipo),
	favoritos: many(favoritos),
	alineaciones: many(alineaciones),
	estadisticasPartidos: many(estadisticasPartido),
	sanciones: many(sanciones),
	asistenciaPartidos: many(asistenciaPartidos),
}));

export const favoritosRelations = relations(favoritos, ({one}) => ({
	equipo: one(equipos, {
		fields: [favoritos.idEquipo],
		references: [equipos.idEquipo]
	}),
	jugadore: one(jugadores, {
		fields: [favoritos.idJugador],
		references: [jugadores.idJugador]
	}),
	usuario: one(usuarios, {
		fields: [favoritos.idUsuario],
		references: [usuarios.idUsuario]
	}),
}));

export const alineacionesRelations = relations(alineaciones, ({one}) => ({
	equipo: one(equipos, {
		fields: [alineaciones.idEquipo],
		references: [equipos.idEquipo]
	}),
	jugadore: one(jugadores, {
		fields: [alineaciones.idJugador],
		references: [jugadores.idJugador]
	}),
	partido: one(partidos, {
		fields: [alineaciones.idPartido],
		references: [partidos.idPartido]
	}),
}));

export const estadisticasPartidoRelations = relations(estadisticasPartido, ({one}) => ({
	jugadore: one(jugadores, {
		fields: [estadisticasPartido.idJugador],
		references: [jugadores.idJugador]
	}),
	partido: one(partidos, {
		fields: [estadisticasPartido.idPartido],
		references: [partidos.idPartido]
	}),
}));

export const informesPartidoRelations = relations(informesPartido, ({one, many}) => ({
	usuario: one(usuarios, {
		fields: [informesPartido.idArbitro],
		references: [usuarios.idUsuario]
	}),
	partido: one(partidos, {
		fields: [informesPartido.idPartido],
		references: [partidos.idPartido]
	}),
	incidentes: many(incidentes),
	evaluacionesArbitros: many(evaluacionesArbitro),
}));

export const sancionesRelations = relations(sanciones, ({one}) => ({
	jugadore: one(jugadores, {
		fields: [sanciones.idJugador],
		references: [jugadores.idJugador]
	}),
	partido: one(partidos, {
		fields: [sanciones.idPartido],
		references: [partidos.idPartido]
	}),
	torneo: one(torneos, {
		fields: [sanciones.idTorneo],
		references: [torneos.idTorneo]
	}),
}));

export const transmisionesRelations = relations(transmisiones, ({one}) => ({
	canale: one(canales, {
		fields: [transmisiones.idCanal],
		references: [canales.idCanal]
	}),
	partido: one(partidos, {
		fields: [transmisiones.idPartido],
		references: [partidos.idPartido]
	}),
}));

export const incidentesRelations = relations(incidentes, ({one}) => ({
	informesPartido: one(informesPartido, {
		fields: [incidentes.idInforme],
		references: [informesPartido.idInforme]
	}),
}));

export const evaluacionesArbitroRelations = relations(evaluacionesArbitro, ({one}) => ({
	usuario_idArbitro: one(usuarios, {
		fields: [evaluacionesArbitro.idArbitro],
		references: [usuarios.idUsuario],
		relationName: "evaluacionesArbitro_idArbitro_usuarios_idUsuario"
	}),
	usuario_idEvaluador: one(usuarios, {
		fields: [evaluacionesArbitro.idEvaluador],
		references: [usuarios.idUsuario],
		relationName: "evaluacionesArbitro_idEvaluador_usuarios_idUsuario"
	}),
	informesPartido: one(informesPartido, {
		fields: [evaluacionesArbitro.idInforme],
		references: [informesPartido.idInforme]
	}),
}));

export const asistenciaPartidosRelations = relations(asistenciaPartidos, ({one}) => ({
	jugadore: one(jugadores, {
		fields: [asistenciaPartidos.idJugador],
		references: [jugadores.idJugador]
	}),
	partido: one(partidos, {
		fields: [asistenciaPartidos.idPartido],
		references: [partidos.idPartido]
	}),
}));