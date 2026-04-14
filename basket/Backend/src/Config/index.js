require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db'); 
const cron = require('node-cron');
const { db } = require('./db'); 
const { sql } = require('drizzle-orm');

const errorHandler = require('../Middleware/errorHandler');
const ticketingRoutes = require('../Routes/ticketingRoutes');
const torneosRoutes = require('../Routes/torneosRoutes');     
const usuarioRoutes = require('../Routes/usuarioRoutes');
const equipoRoutes = require('../Routes/equiposRoutes');      
const canchaRoutes = require('../Routes/canchaRoutes');       
const canalRoutes = require('../Routes/canalRoutes');         
const jugadoresRoutes = require('../Routes/jugadoresRoutes'); 
const arbitroRoutes = require('../Routes/arbitrosRoutes');     
const partidosRoutes = require('../Routes/partidosRoutes');
const inscripcionesRoutes = require('../Routes/inscripcionesRoutes');
const resolucionesRoutes = require('../Routes/resolucionesRoutes');
const alineacionRoutes = require('../Routes/alineacionRoutes');
const estadisticasRoutes = require('../Routes/estadisticasRoutes');

const app = express();

const dominiosPermitidos = [
    'http://localhost:5173', // Para tu desarrollo local
    process.env.FRONTEND_URL // Para cuando subas a Vercel/No-IP
].filter(Boolean); // Filtra valores nulos/undefined

app.use(cors({
    origin: function (origin, callback) {
        // Permite peticiones sin origin (como Postman o curl) o desde los dominios permitidos
        if (!origin || dominiosPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por CORS'));
        }
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/equipos', equipoRoutes);        
app.use('/api/canchas', canchaRoutes);        
app.use('/api/canales', canalRoutes);          
app.use('/api/jugadores', jugadoresRoutes);   
app.use('/api/arbitros', arbitroRoutes);      
app.use('/api/torneos', torneosRoutes);        
app.use('/api/partidos', partidosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/resoluciones', resolucionesRoutes);
app.use('/api/alineacion', alineacionRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/ticketing', ticketingRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor BasketPro funcionando correctamente en la nube 🚀' });
});

app.use(errorHandler);

const iniciarServidor = async () => {
    try {
        await connectDB();
        cron.schedule('* * * * *', async () => {
            try {
                await db.execute(sql`SELECT liberar_reservas_expiradas()`);
            } catch (error) {
                console.error('[CRON ERROR] Falló la limpieza de reservas:', error);
            }
        });

        //  Render inyectará su propio PORT aquí automáticamente
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(` Servidor corriendo en el puerto ${PORT}`);
            console.log(' Entorno activo para:', process.env.DB_HOST);
            console.log(' Cron Job de Taquilla Activado');
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor debido a un fallo en la DB:', error.message);
    }
};

iniciarServidor();