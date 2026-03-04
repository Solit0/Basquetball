import { api } from '../Enviroments/enviroment' // Asegúrate de que la ruta de 'api' sea correcta

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