import {api} from '../Enviroments/enviroment'
export const obtenerCanalesService = async () => {

    const timestamp = new Date().getTime();
    const response = await api.get(`/canales?t=${timestamp}`);
    return response.data;
}
export const crearCanalService = async (datosCanal) => {
    const response = await api.post('/canales', datosCanal)
    return response.data
}
export const asignarTransmisionService = async (idCanal, payload) => {
    
    const response = await api.post(`/canales/${idCanal}/transmisiones`, payload);
    return response.data;
}

export const obtenerTransmisionesPorCanalService = async (idCanal) => {
    const response = await api.get(`/canales/${idCanal}/transmisiones`);
    return response.data;
}

// Eliminar una transmisión de la cartelera
export const eliminarTransmisionService = async (idTransmision) => {
    const response = await api.delete(`/canales/transmisiones/${idTransmision}`);
    return response.data;
}