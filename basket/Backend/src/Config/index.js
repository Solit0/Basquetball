require('dotenv').config();
const express = require('express');
const pool = require('./db');
const errorHandler = require('../Middleware/errorHandler');
const app = express();
const cors = require('cors');
const torneosRoutes = require('../Routes/torneosRoutes');     
const usuarioRoutes = require('../Routes/usuarioRoutes');
const equipoRoutes = require('../Routes/equiposRoutes');      
const canchaRoutes = require('../Routes/canchaRoutes');       
const canalRoutes = require('../Routes/canalRoutes');         
const jugadoresRoutes = require('../Routes/jugadoresRoutes'); 
const arbitroRoutes = require('../Routes/arbitroRoutes');     
const partidosRoutes = require('../Routes/partidosRoutes');
// Middleware
app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/equipos', equipoRoutes);        
app.use('/api/canchas', canchaRoutes);        
app.use('/api/canales', canalRoutes);          
app.use('/api/jugadores', jugadoresRoutes);   
app.use('/api/arbitros', arbitroRoutes);       
app.use('/api/torneos', torneosRoutes);        
app.use('/api/partidos', partidosRoutes);
// Probar conexión a BD
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✅ Conexión a PostgreSQL exitosa');
        console.log('📅 Hora del servidor DB:', res.rows[0].now);
    }
});

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor funcionando correctamente' });
});

console.log('🔧 Variables de entorno:');
console.log('- DB_USER:', process.env.DB_USER);
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_NAME:', process.env.DB_NAME);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});