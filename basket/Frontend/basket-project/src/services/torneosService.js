import { api } from '../Enviroments/enviroment'

export const crearTorneoService = async (datosTorneo) => {
    const response = await api.post('/torneos', datosTorneo)
    return response.data
}

export const obtenerTorneosActivosService = async () => {
    const response = await api.get('/torneos/activos')
    return response.data
}

export const editarTorneoService = async (id, datosTorneo) => {
    const response = await api.put(`/torneos/${id}`, datosTorneo)
    return response.data
}

export const iniciarTorneoService = async (id) => {
    const response = await api.put(`/torneos/${id}/iniciar`)
    return response.data
}

export const obtenerEquiposElegiblesService = async (id) => {
    const response = await api.get(`/torneos/${id}/equipos-elegibles`)
    return response.data
}

export const inscribirEquipoService = async (idTorneo, idEquipo) => {
    const response = await api.post(`/torneos/${idTorneo}/equipos`, { id_equipo: idEquipo })
    return response.data
}
export const eliminarTorneoService = async (id) => {
    const response = await api.delete(`/torneos/${id}`)
    return response.data
}
export const obtenerEquiposInscritosService = async (id) => {
    const response = await api.get(`/torneos/${id}/equipos-inscritos`)
    return response.data
}
export const quitarEquipoTorneoService = async (idTorneo, idEquipo) => {
    const response = await api.delete(`/torneos/${idTorneo}/equipos/${idEquipo}`)
    return response.data
}
export const obtenerTorneosDeEquipoService = async (idEntrenador) => {
    const response = await api.get(`/torneos/entrenadores/${idEntrenador}/torneos`);
    return response.data;
};
export const obtenerInscripcionesPorTorneoService = async (idTorneo) => {
    const response = await api.get(`/torneos/${idTorneo}/inscripciones`);
    return response.data;
}
export const responderInscripcionService = async (idTorneo, idEquipo, estado) => {
    const response = await api.patch(`/torneos/${idTorneo}/equipos/${idEquipo}/inscripcion`, { estado_nuevo: estado });
    return response.data;
}
export const finalizarTorneoService = async (idTorneo) => {
    const response = await api.patch(`/torneos/${idTorneo}/finalizar`);
    return response.data;
}
export const obtenerDatosReporteTorneoService = async (idTorneo) => {
    const response = await api.get(`/torneos/${idTorneo}/reporte`);
    return response.data;
}