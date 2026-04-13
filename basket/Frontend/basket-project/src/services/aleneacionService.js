//ruta del archivo: Frontend/basket-project/src/services/aleneacionService.js
import { api } from '../Enviroments/enviroment' 
export const asignarCapitanInterinoService = async (id_partido, id_equipo, id_jugador) => {
    try {
        const response = await api.post('/alineacion/capitan-interino', { id_partido, id_equipo, id_jugador });
        return response.data;
    } catch (error) {
        console.error("Error al asignar el capitán interino:", error);
        throw error;
    }
};