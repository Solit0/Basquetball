// ruta del archivo : Frontend/basket-project/src/services/inscripcionesService.js
import {api} from '../Enviroments/enviroment';

export const solicitarInscripcionService = async (idTorneo, idEntrenador) => {
    const response = await api.post(`/inscripciones/${idTorneo}/solicitar`, { idEntrenador });
    return response.data;
};