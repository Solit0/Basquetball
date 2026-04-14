<template>
    <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pb-12">
        
        <nav class="bg-white shadow-md mb-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-black text-indigo-600 tracking-tight">Basket<span class="text-amber-500">Pro</span></h1>
                        <span class="ml-4 text-sm font-bold text-gray-500 uppercase tracking-widest border-l-2 border-gray-200 pl-4">Taquilla</span>
                    </div>
                    <button @click="$router.push('/entrenador')" class="text-gray-600 hover:text-indigo-600 font-bold text-sm transition-colors">
                        Volver al Panel
                    </button>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
            
            <div class="mb-8 text-center md:text-left">
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">Gestión de Taquilla</h2>
                <p class="mt-2 text-gray-600 font-medium">Configura los precios de los boletos para tus próximos encuentros como equipo local.</p>
            </div>

            <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-gray-500 font-medium">Cargando encuentros...</p>
            </div>

            <div v-else class="animate-fade-in">
                <div v-if="partidosProximos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                    <p class="text-lg font-bold text-gray-600">No hay partidos programados</p>
                    <p class="text-sm text-gray-500 mt-1">Aún no tienes encuentros próximos para configurar.</p>
                </div>

                <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div v-for="p in partidosProximos" :key="p.id_partido" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                        
                        <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                            <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                {{ p.nombre_torneo }} | {{ p.ronda_torneo }}
                            </span>
                            <span class="text-xs font-bold text-gray-500">
                                {{ formatFecha(p.fecha) }} - {{ p.hora }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between mb-4 py-2">
                            <div class="w-2/5 text-right">
                                <p class="font-black text-gray-900 text-xl truncate" :title="p.local_nombre">{{ p.local_nombre }}</p>
                            </div>
                            <div class="w-1/5 text-center">
                                <span class="bg-gray-100 text-gray-400 font-black px-3 py-1.5 rounded-lg text-sm border border-gray-200">VS</span>
                            </div>
                            <div class="w-2/5 text-left">
                                <p class="font-black text-gray-900 text-xl truncate" :title="p.visitante_nombre">{{ p.visitante_nombre }}</p>
                            </div>
                        </div>

                        <button @click="abrirConfiguracionPrecios(p)" 
                                class="w-full mt-auto py-3 bg-emerald-500 text-white font-black text-sm rounded-xl hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                            Habilitar Venta / Asignar Precios
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <div v-if="modalAbierto && partidoSeleccionado" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 class="font-black text-lg">Definir Precios de Taquilla</h3>
                        <p class="text-xs text-gray-400">{{ partidoSeleccionado.local_nombre }} vs {{ partidoSeleccionado.visitante_nombre }}</p>
                    </div>
                    <button @click="cerrarModal" class="text-gray-400 hover:text-white transition-colors bg-slate-800 rounded-full p-1">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div v-if="cargandoZonas" class="text-center py-10">
                        <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p class="text-gray-500 font-medium text-sm">Obteniendo plano de la sede...</p>
                    </div>

                    <div v-else-if="zonasSede.length === 0" class="text-center py-10 text-red-600 font-bold bg-red-50 rounded-lg border border-red-200">
                        No tienes zonas configuradas en tu sede. Ve a "Configurar Zonas" primero.
                    </div>

                    <div v-else>
                        <p class="text-sm text-gray-600 mb-6 font-medium">Asigna el precio de venta para cada zona en este partido. El sistema generará los boletos automáticamente basados en la capacidad que definiste previamente.</p>
                        
                        <div class="space-y-4">
                            <div v-for="zona in zonasSede" :key="zona.id_zona" class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <h4 class="font-black text-gray-800 text-lg">{{ zona.nombre_zona }}</h4>
                                    <p class="text-xs font-bold text-gray-500">Aforo físico: {{ zona.capacidad }} asientos</p>
                                </div>
                                
                                <div class="relative w-full sm:w-40">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 font-black">$</span>
                                    </div>
                                    <input type="number" v-model.number="zona.precio_asignado" placeholder="0.00" min="0" step="0.50"
                                        @keydown="bloquearLetras"
                                        @paste="bloquearPaste($event, zona)"
                                        @input="validarPositivo(zona)"
                                        class="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-indigo-500 text-lg font-black text-gray-900 outline-none transition" />
                                </div>
                            </div>
                        </div>

                        <div v-if="mensajeError" class="mt-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-200">
                            {{ mensajeError }}
                        </div>
                        <div v-if="mensajeExito" class="mt-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold border border-emerald-200">
                            {{ mensajeExito }}
                        </div>

                    </div>
                </div>

                <div class="bg-white border-t border-gray-200 p-4 px-6 shrink-0">
                    <button @click="guardarPrecios" :disabled="procesando || cargandoZonas" 
                            class="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow flex justify-center items-center disabled:opacity-50">
                        <svg v-if="procesando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {{ procesando ? 'Generando Boletos...' : 'Confirmar y Abrir Taquilla' }}
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

// Tus servicios
import { obtenerPartidosPublicosService } from '../../services/partidosService'
import { obtenerSedeYZonasPorEquipoService  } from '../../services/canchaService'
import { habilitarVentaService } from '../../services/ticketingService'

const router = useRouter()
const cargando = ref(true)
const todosLosPartidos = ref([])

// Variables del Modal
const modalAbierto = ref(false)
const cargandoZonas = ref(false)
const procesando = ref(false)
const partidoSeleccionado = ref(null)
const zonasSede = ref([])
const mensajeError = ref('')
const mensajeExito = ref('')

onMounted(async () => {
    try {
        cargando.value = true;
        // Obtenemos los partidos. NOTA: Aquí podrías filtrar solo en los que este entrenador es LOCAL.
        const data = await obtenerPartidosPublicosService();
        todosLosPartidos.value = data;
    } catch (error) {
        console.error("Error al cargar partidos:", error);
    } finally {
        cargando.value = false;
    }
})

// Filtramos solo los próximos que no han terminado
const partidosProximos = computed(() => todosLosPartidos.value.filter(p => p.estado !== 'Finalizado'))

const abrirConfiguracionPrecios = async (partido) => {
    modalAbierto.value = true;
    partidoSeleccionado.value = partido;
    mensajeError.value = '';
    mensajeExito.value = '';
    
    try {
        cargandoZonas.value = true;
        
        // 🔴 LA MAGIA AQUÍ: Usamos el ID del equipo local del partido seleccionado
        // Dependiendo de cómo lo devuelva tu backend, puede ser id_local o id_equipo_local
        const idEquipoLocal = partido.id_equipo_local || partido.id_local; 
        
        // Llamamos al servicio con el ID del equipo, no del administrador
        const datosSede = await obtenerSedeYZonasPorEquipoService(idEquipoLocal);
        
        zonasSede.value = datosSede.zonas.map(z => ({
            id_zona: z.idZona || z.id_zona,
            nombre_zona: z.nombreZona || z.nombre_zona,
            capacidad: z.capacidad,
            precio_asignado: null 
        }));

    } catch (error) {
        mensajeError.value = error.response?.data?.error || "No pudimos cargar la configuración de la cancha para este equipo.";
        console.error(error);
    } finally {
        cargandoZonas.value = false;
    }
}

const cerrarModal = () => {
    modalAbierto.value = false;
    setTimeout(() => { 
        partidoSeleccionado.value = null;
        zonasSede.value = [];
        mensajeError.value = '';
        mensajeExito.value = '';
    }, 300);
}
const validarPositivo = (zona) => {
    if (zona.precio_asignado < 0 || isNaN(zona.precio_asignado)) {
        zona.precio_asignado = 0
        return
    }
    // Limitar a 2 decimales
    if (zona.precio_asignado !== null && zona.precio_asignado !== '') {
        const redondeado = Math.round(zona.precio_asignado * 100) / 100
        if (zona.precio_asignado !== redondeado) {
            zona.precio_asignado = redondeado
        }
    }
}

const bloquearPaste = (e, zona) => {
    const texto = e.clipboardData.getData('text')
    const numero = parseFloat(texto)
    e.preventDefault()
    if (!isNaN(numero) && numero >= 0) {
        zona.precio_asignado = Math.round(numero * 100) / 100
    }
}
const guardarPrecios = async () => {
    mensajeError.value = '';
    mensajeExito.value = '';

    // Validamos que todas las zonas tengan un precio mayor o igual a 0
    const preciosIncompletos = zonasSede.value.some(z => z.precio_asignado === null || z.precio_asignado === '' || z.precio_asignado < 0);
    
    if (preciosIncompletos) {
        mensajeError.value = "Por favor, asigna un precio válido a todas las zonas (puede ser 0 si es gratis).";
        return;
    }

    // Preparamos el array exacto que espera nuestro controlador backend
    const configuracionPrecios = zonasSede.value.map(z => ({
        idZona: z.id_zona,
        precio: parseFloat(z.precio_asignado)
    }));

    procesando.value = true;

    try {
        await habilitarVentaService(partidoSeleccionado.value.id_partido, configuracionPrecios);
        
        mensajeExito.value = "¡Taquilla abierta! Los boletos ya están disponibles para el público.";
        
        // Cerramos el modal tras 2 segundos de éxito
        setTimeout(() => {
            cerrarModal();
        }, 2000);

    } catch (error) {
        // Aquí atrapamos el error de validación de duplicados que armamos en el backend
        mensajeError.value = error.response?.data?.error || "Error al generar el inventario. Es posible que ya hayas habilitado la venta para este partido anteriormente.";
    } finally {
        procesando.value = false;
    }
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
/* Quitar flechas de los inputs de número para que se vea más limpio el precio */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
</style>