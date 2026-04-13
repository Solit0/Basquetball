import { api } from '../Enviroments/enviroment';

export const obtenerSancionesPendientesService = async () => {
    try {
        const response = await api.get('/resoluciones/pendientes');
        return response.data;
    } catch (error) {
        console.error("Error al obtener sanciones pendientes:", error);
        throw error;
    }
};
export const dictarResolucionService = async (id_sancion, datos_resolucion) => {
    try {
        const response = await api.post(`/resoluciones/${id_sancion}/resolver`, datos_resolucion);
        return response.data;
    } catch (error) {
        console.error("Error al dictar la resolución:", error);
        throw error;
    }
};
export const obtenerHistorialResolucionesService = async () => {
    try {
        const response = await api.get('/resoluciones/historial');
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const pagarMultaService = async (id_resolucion) => {
    try {
        const response = await api.patch(`/resoluciones/historial/${id_resolucion}/pagar`);
        return response.data;
    } catch (error) {
        throw error;
    }
};