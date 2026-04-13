import { api } from '../Enviroments/enviroment' 

export const obtenerRankingEquiposService = async (categoria, clasificacion, torneo) => {
    try {
        const params = {};
        if (categoria && categoria !== 'Todas') params.categoria = categoria;
        if (clasificacion && clasificacion !== 'Todas') params.clasificacion = clasificacion;
        if (torneo && torneo !== 'Todos') params.torneo = torneo;

        const response = await api.get('/estadisticas/ranking', { params });
        return response.data;
    }
    catch (error) {
        console.error("Error al obtener el ranking de equipos:", error);
        throw error;
    }
};
export const obtenerClasificacionesService = async () => {
    try {
        const response = await api.get('/estadisticas/clasificaciones');
        return response.data;
    }
    catch (error) {
        console.error("Error al obtener las clasificaciones:", error);
        throw error;
    }
};