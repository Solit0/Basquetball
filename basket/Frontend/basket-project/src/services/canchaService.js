import {api} from'../Enviroments/enviroment'
export const obtenerCanchasService = async () => {
    const response = await api.get('/canchas')
    return response.data
}

export const crearCanchaService = async (canchaData) => {
    const response = await api.post('/canchas', canchaData)
    return response.data
}