import { api } from '../Enviroments/enviroment'

export const crearTorneoService = async (datosTorneo) => {
    const response = await api.post('/torneos', datosTorneo)
    return response.data
}

export const obtenerTorneosActivosService = async () => {
    const response = await api.get('/torneos/activos')
    return response.data
}

export const editarTorneoService = async (id, datosTorneo) => {
    const response = await api.put(`/torneos/${id}`, datosTorneo)
    return response.data
}

export const iniciarTorneoService = async (id) => {
    const response = await api.put(`/torneos/${id}/iniciar`)
    return response.data
}

export const obtenerEquiposElegiblesService = async (id) => {
    const response = await api.get(`/torneos/${id}/equipos-elegibles`)
    return response.data
}

export const inscribirEquipoService = async (idTorneo, idEquipo) => {
    const response = await api.post(`/torneos/${idTorneo}/equipos`, { id_equipo: idEquipo })
    return response.data
}
export const eliminarTorneoService = async (id) => {
    const response = await api.delete(`/torneos/${id}`)
    return response.data
}
export const obtenerEquiposInscritosService = async (id) => {
    const response = await api.get(`/torneos/${id}/equipos-inscritos`)
    return response.data
}
export const quitarEquipoTorneoService = async (idTorneo, idEquipo) => {
    const response = await api.delete(`/torneos/${idTorneo}/equipos/${idEquipo}`)
    return response.data
}