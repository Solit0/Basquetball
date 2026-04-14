import { api } from '../Enviroments/enviroment' 

export const obtenerBoletosPorPartidoService = async (idPartido) => {
    try {
        const response = await api.get(`/ticketing/partido/${idPartido}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener boletos del partido:", error);
        throw error;
    }
};

export const iniciarReservaService = async (idUsuario, idBoleto, cantidad, montoTotal) => {
    try {
        const response = await api.post('/ticketing/reservar', {
            idUsuario,
            idBoleto,
            cantidad,
            montoTotal
        });
        return response.data; 
    } catch (error) {
        console.error("Error al iniciar la reserva:", error);
        throw error;
    }
};

export const confirmarPagoService = async (idTransaccion, email, nombre, detalles) => {
    console.log("\n=============================================");
    console.log(" [FRONTEND SERVICE] Preparando envío a Axios...");
    
    const payload = {
        idTransaccion: idTransaccion,
        email: email, 
        nombre: nombre,
        detalles: detalles
    };
    
    console.log(" [FRONTEND SERVICE] Payload que se enviará:", JSON.stringify(payload, null, 2));
    console.log("=============================================\n");

    const response = await api.post('/ticketing/confirmar-pago', payload);
    return response.data;
};
export const cancelarReservaService = async (idTransaccion) => {
    try {
        const response = await api.post('/ticketing/cancelar', {
            idTransaccion
        });
        return response.data;
    } catch (error) {
        console.error("Error al cancelar la reserva:", error);
        throw error;
    }
};
export const habilitarVentaService = async (idPartido, precios) => {
    try {
        const response = await api.post('/ticketing/habilitar-venta', {
            idPartido,
            precios 
        });
        return response.data;
    } catch (error) {
        console.error("Error al habilitar venta:", error);
        throw error;
    }
};
export const obtenerMisBoletosService = async (idUsuario) => {
    try {
        const response = await api.get(`/ticketing/mis-boletos/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener mis boletos:", error);
        throw error;
    }
};