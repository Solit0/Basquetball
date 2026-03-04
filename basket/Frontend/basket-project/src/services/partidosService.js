//ruta: /Frontend/basket-project/src/services/partidosService.js
import { api } from '../Enviroments/enviroment'

export const guardarPartidosMultiples = async (partidos) => {
    const response = await api.post('/partidos/bulk', { partidos })
    return response.data
}

export const obtenerPartidosPorTorneo = async (idTorneo) => {
    const response = await api.get(`/partidos/torneo/${idTorneo}`)
    return response.data
}
export const finalizarPartidoService = async (idPartido, datos) => {
    const response = await api.post(`/partidos/${idPartido}/finalizar`, datos)
    return response.data
}
export const obtenerResumenPartidoService = async (idPartido) => {
    const response = await api.get(`/partidos/${idPartido}/resumen`)
    return response.data
}