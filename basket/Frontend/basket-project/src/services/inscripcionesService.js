// ruta del archivo : Frontend/basket-project/src/services/inscripcionesService.js
import { api } from '../Enviroments/enviroment';
export const solicitarInscripcionService = async (idTorneo, idEntrenador, roster) => {
    const response = await api.post(`/inscripciones/${idTorneo}/solicitar`, { 
        idEntrenador, 
        roster 
    });
    return response.data;
};

export const obtenerMisSolicitudesService = async (idEntrenador) => {
    const response = await api.get(`/inscripciones/mis-solicitudes/${idEntrenador}`);
    return response.data;
};
export const obtenerMiRosterService = async (idTorneo, idEntrenador) => {
    const response = await api.get(`/inscripciones/${idTorneo}/roster`, {
        params: { idEntrenador }
    });
    return response.data;
};
export const editarRosterService = async (idTorneo, idEntrenador, roster) => {
    const response = await api.put(`/inscripciones/${idTorneo}/roster`, { 
        idEntrenador,
        roster
    });
    return response.data;
};
export const obtenerRosterPublicoService = async (idTorneo, idEquipo) => {
    const response = await api.get(`/inscripciones/${idTorneo}/roster-publico/${idEquipo}`);
    return response.data;
};