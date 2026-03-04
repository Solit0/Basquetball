import { api } from '../Enviroments/enviroment'

export const obtenerArbitrosService = async () => {
    const response = await api.get('/arbitros')
    return response.data
}

export const obtenerArbitroPorIdService = async (id) => {
    const response = await api.get(`/arbitros/${id}`)
    return response.data
}

export const crearArbitroService = async (datosArbitro) => {
    const response = await api.post('/arbitros', datosArbitro)
    return response.data
}

export const actualizarArbitroService = async (id, datosArbitro) => {
    const response = await api.put(`/arbitros/${id}`, datosArbitro)
    return response.data
}

export const eliminarArbitroService = async (id) => {
    const response = await api.delete(`/arbitros/${id}`)
    return response.data
}

export const obtenerPartidosAsignadosService = async (idArbitro) => {
    const response = await api.get(`/arbitros/${idArbitro}/partidos`)
    return response.data
}