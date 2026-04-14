// src/services/equiposService.js
import { api } from '../Enviroments/enviroment'

export const obtenerEquiposService = async () => {
    const response = await api.get('/equipos')
    return response.data
}

export const crearEquipoService = async (equipoData) => {
    const response = await api.post('/equipos', equipoData)
    return response.data
}
export const obtenerJugadoresPorEquipoService = async (idEquipo) => {
    const response = await api.get(`/equipos/${idEquipo}/jugadores`)
    return response.data
}
export const obtenerEquipoDeEntrenadorService = async (idEntrenador) => {
    const response = await api.get(`/equipos/entrenador/${idEntrenador}`)
    return response.data
}
export const actualizarEquipoService = async (idEquipo, datosEquipo) => {
    const response = await api.put(`/equipos/${idEquipo}`, datosEquipo)
    return response.data
}