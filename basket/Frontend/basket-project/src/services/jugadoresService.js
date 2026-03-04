import { api } from '../Enviroments/enviroment'

export const obtenerJugadoresService = async () => {
    const response = await api.get('/jugadores')
    return response.data
}

export const obtenerJugadorPorIdService = async (id) => {
    const response = await api.get(`/jugadores/${id}`)
    return response.data
}

export const obtenerEstadisticasJugadorService = async (idJugador) => {
    const response = await api.get(`/jugadores/${idJugador}/estadisticas`)
    return response.data
}

export const verificarSancionService = async (idJugador) => {
    const response = await api.get(`/jugadores/${idJugador}/sancion`)
    return response.data
}


export const obtenerJugadoresPorEquipoService = async (idEquipo) => {
    const response = await api.get(`/jugadores/equipo/${idEquipo}`)
    return response.data
}

export const crearJugadorService = async (jugadorData) => {
    const response = await api.post('/jugadores', jugadorData)
    return response.data
}

export const actualizarJugadorService = async (id, jugadorData) => {
    const response = await api.put(`/jugadores/${id}`, jugadorData)
    return response.data
}

export const eliminarJugadorService = async (id, idEquipo) => {
    const response = await api.delete(`/jugadores/${id}/equipo/${idEquipo}`)
    return response.data
}
export const obtenerJugadoresLibresService = async () => {
    const response = await api.get('/jugadores/libres/disponibles')
    return response.data
}

export const vincularJugadorService = async (idJugador, datosPlantilla) => {
    const response = await api.post(`/jugadores/${idJugador}/vincular`, datosPlantilla)
    return response.data
}