import {api} from '../Enviroments/enviroment'
export const obtenerCanalesService = async () => {
    const response = await api.get('/canales')
    return response.data
}
export const crearCanalService = async (datosCanal) => {
    const response = await api.post('/canales', datosCanal)
    return response.data
}