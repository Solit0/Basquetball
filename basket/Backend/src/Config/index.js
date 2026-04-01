require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db'); 
const errorHandler = require('../Middleware/errorHandler');

// Importación de rutas
const torneosRoutes = require('../Routes/torneosRoutes');     
const usuarioRoutes = require('../Routes/usuarioRoutes');
const equipoRoutes = require('../Routes/equiposRoutes');      
const canchaRoutes = require('../Routes/canchaRoutes');       
const canalRoutes = require('../Routes/canalRoutes');         
const jugadoresRoutes = require('../Routes/jugadoresRoutes'); 
const arbitroRoutes = require('../Routes/arbitrosRoutes');     
const partidosRoutes = require('../Routes/partidosRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173' 
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

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente con Supabase y Drizzle' });
});

// El errorHandler siempre debe ir después de las rutas
app.use(errorHandler);

// Función para arrancar la base de datos y luego el servidor
const iniciarServidor = async () => {
    try {
        // Probamos la conexión a Supabase
        await connectDB();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(` Servidor corriendo en http://localhost:${PORT}`);
            console.log('🔧 Entorno activo para:', process.env.DB_HOST);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor debido a un fallo en la DB:', error.message);
    }
};

iniciarServidor();