import { api } from '../Enviroments/enviroment' 
export const obtenerTorneosAsignadosService = async (idArbitro) => {
    const response = await api.get(`/arbitros/${idArbitro}/torneos`);
    return response.data;
};

export const obtenerPartidosPorTorneoService = async (idArbitro, idTorneo) => {
    const response = await api.get(`/arbitros/${idArbitro}/torneos/${idTorneo}/partidos`);
    return response.data;
};

export const obtenerDetallePartidoService = async (idArbitro, idPartido) => {
    const response = await api.get(`/arbitros/${idArbitro}/partidos/${idPartido}`);
    return response.data;
};

export const obtenerPartidosAsignadosService = async (idArbitro) => {
    const response = await api.get(`/arbitros/${idArbitro}/partidos`);
    return response.data;
};

export const obtenerAlineacionPartidoService = async (idPartido, idEquipo) => {
    const response = await api.get(`/arbitros/partidos/${idPartido}/equipos/${idEquipo}/alineacion`);
    return response.data;
};

export const marcarAsistenciaJugadorService = async (idPartido, idJugador, estado) => {
    const response = await api.put(`/arbitros/partidos/${idPartido}/jugadores/${idJugador}/asistencia`, { estado });
    return response.data;
};
export const iniciarPartidoService = async (idPartido) => {
    const response = await api.put(`/arbitros/partidos/${idPartido}/iniciar`);
    return response.data;
};
export const obtenerTorneosHistorialService = async (idArbitro) => {
    const response = await api.get(`/arbitros/${idArbitro}/historial-torneos`);
    return response.data;
}

export const obtenerPartidosHistorialService = async (idArbitro, idTorneo) => {
    const response = await api.get(`/arbitros/${idArbitro}/historial-torneos/${idTorneo}`);
    return response.data;
}

export const obtenerResumenPartidoService = async (idPartido) => {
    const response = await api.get(`/arbitros/partido/${idPartido}/resumen`);
    return response.data;
}
export const obtenerEvaluacionesService = async (idArbitro) => {
    const response = await api.get(`/arbitros/${idArbitro}/evaluaciones`);
    return response.data;
}

export const responderEvaluacionService = async (idEvaluacion, respuesta) => {
    const response = await api.post(`/arbitros/evaluacion/${idEvaluacion}/responder`, { respuesta });
    return response.data;
}

export const obtenerPromedioArbitroService = async (idArbitro) => {
    const response = await api.get(`/arbitros/${idArbitro}/promedio`);
    return response.data;
}