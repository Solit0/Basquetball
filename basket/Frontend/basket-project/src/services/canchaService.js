import {api} from'../Enviroments/enviroment'
export const obtenerCanchasService = async () => {
    const response = await api.get('/canchas')
    return response.data
}

export const crearCanchaService = async (canchaData) => {
    const response = await api.post('/canchas', canchaData)
    return response.data
}
export const crearCanchaConZonasService = async (canchaData) => {
    const response = await api.post('/canchas/con-zonas', canchaData)
    return response.data
}
export const obtenerSedeYZonasService = async (idEntrenador) => {
    const response = await api.get(`/canchas/sede-entrenador/${idEntrenador}`);
    return response.data;
};
export const obtenerSedeYZonasPorEquipoService  = async (idEquipo) => {
    const response = await api.get(`/canchas/sede-equipo/${idEquipo}`);
    return response.data;
}
export const actualizarZonasService = async (idCancha, zonas) => {
    const response = await api.put(`/canchas/${idCancha}/zonas`, { zonas });
    return response.data;
}