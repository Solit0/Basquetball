<template>
    <div class="h-full flex flex-col space-y-6">
        
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 shrink-0">
            <div>
                <div class="flex items-center space-x-2 text-sm font-bold text-amber-600 mb-1">
                    <span @click="volverATorneos" class="cursor-pointer hover:underline">Historial General</span>
                    <span v-if="viewMode === 'partidos' || viewMode === 'detalle'" class="text-gray-500">/ {{ torneoSeleccionado?.nombre_torneo }}</span>
                    <span v-if="viewMode === 'detalle'" class="text-gray-500">/ Partido #{{ partidoSeleccionado?.id_partido }}</span>
                </div>
                <h2 class="text-3xl font-black text-gray-900 flex items-center">
                    <button v-if="viewMode !== 'torneos'" @click="volverAtras" class="mr-3 text-amber-500 hover:text-amber-700 transition-colors" title="Regresar">
                        &larr;
                    </button>
                    {{ tituloVista }}
                </h2>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-10">
            
            <div v-if="viewMode === 'torneos'" class="animate-fade-in">
                <div v-if="torneos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-lg font-bold text-gray-700">Sin historial de partidos</p>
                    <p class="text-sm mt-1">Aún no has dirigido ningún partido que haya finalizado oficialmente.</p>
                </div>

                <div v-else class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                    <div v-for="t in torneos" :key="t.id_torneo" @click="seleccionarTorneo(t)"
                         class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 relative overflow-hidden group">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-800"></div>
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-xl font-bold text-gray-900 leading-tight pr-4 group-hover:text-amber-600 transition-colors">{{ t.nombre_torneo }}</h3>
                        </div>
                        <p class="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                            {{ t.categoria }} | {{ t.clasificacion }}
                        </p>
                        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span class="text-sm font-medium text-gray-600">Partidos dirigidos:</span>
                            <span class="px-3 py-1 bg-slate-100 text-slate-800 font-black rounded-full shadow-sm text-sm">
                                {{ t.partidos_dirigidos }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="viewMode === 'partidos'" class="animate-fade-in">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div v-for="p in partidos" :key="p.id_partido" @click="seleccionarPartido(p)"
                         class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-amber-400 cursor-pointer transition-all">
                        
                        <div class="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                            <span class="text-xs font-black text-slate-800 uppercase tracking-wider">{{ p.ronda_torneo }}</span>
                            <span class="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded uppercase">Finalizado</span>
                        </div>
                        
                        <div class="flex items-center justify-between py-4">
                            <div class="w-2/5 text-right">
                                <p class="font-black text-gray-800 text-lg truncate" :title="p.local_nombre">{{ p.local_siglas || p.local_nombre }}</p>
                            </div>
                            
                            <div class="w-1/5 text-center">
                                <div class="bg-slate-900 text-white font-black px-3 py-1.5 rounded shadow-inner text-xl tracking-widest">
                                    {{ p.marcador_local }} - {{ p.marcador_visitante }}
                                </div>
                            </div>
                            
                            <div class="w-2/5 text-left">
                                <p class="font-black text-gray-800 text-lg truncate" :title="p.visitante_nombre">{{ p.visitante_siglas || p.visitante_nombre }}</p>
                            </div>
                        </div>

                        <div class="text-center text-xs text-gray-500 mt-2 bg-gray-50 py-2 rounded flex justify-center items-center font-medium">
                            <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Jugado el: {{ formatFecha(p.fecha) }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="viewMode === 'detalle'" class="animate-fade-in max-w-5xl mx-auto space-y-6">
                
                <div class="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
                    <div class="px-6 py-3 bg-slate-950 flex justify-between items-center text-white text-xs font-black uppercase tracking-widest">
                        <span>{{ partidoSeleccionado?.ronda_torneo }}</span>
                        <span class="text-gray-400">{{ formatFecha(partidoSeleccionado?.fecha) }}</span>
                    </div>
                    <div class="p-8 flex flex-col md:flex-row items-center justify-center gap-8 text-white">
                        <div class="text-center w-full md:w-2/5">
                            <h4 class="text-3xl font-black truncate" :title="partidoSeleccionado?.local_nombre">{{ partidoSeleccionado?.local_nombre }}</h4>
                            <p class="text-xs font-bold text-gray-400 uppercase mt-1">Local</p>
                        </div>
                        <div class="bg-amber-500 text-slate-950 px-6 py-2 rounded-xl text-4xl font-black shadow-inner tracking-widest border-2 border-amber-400">
                            {{ partidoSeleccionado?.marcador_local }} - {{ partidoSeleccionado?.marcador_visitante }}
                        </div>
                        <div class="text-center w-full md:w-2/5">
                            <h4 class="text-3xl font-black truncate" :title="partidoSeleccionado?.visitante_nombre">{{ partidoSeleccionado?.visitante_nombre }}</h4>
                            <p class="text-xs font-bold text-gray-400 uppercase mt-1">Visitante</p>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h4 class="text-sm font-black text-indigo-900 uppercase tracking-widest border-b border-indigo-100 pb-2 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Reporte Oficial (Admin)
                        </h4>
                        <div v-if="!resumen?.informe" class="text-sm text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed">
                            El administrador no adjuntó un informe descriptivo para este encuentro.
                        </div>
                        <div v-else class="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                            {{ resumen.informe }}
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                        <h4 class="text-sm font-black text-red-800 uppercase tracking-widest border-b border-red-100 pb-2 mb-4 flex items-center">
                            <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Sanciones Registradas
                        </h4>
                        
                        <div v-if="resumen?.sanciones?.length === 0" class="text-sm text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed">
                            No se registraron sanciones disciplinarias en este partido.
                        </div>
                        
                        <div v-else class="space-y-3">
                            <div v-for="(san, index) in resumen.sanciones" :key="index" class="bg-red-50 p-3 rounded-lg border border-red-100 relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                                <div class="flex justify-between items-start mb-1 pl-2">
                                    <p class="font-bold text-gray-900 text-sm">{{ san.nombre }} {{ san.apellido }}</p>
                                    <span class="text-[10px] font-black bg-red-200 text-red-800 px-2 py-0.5 rounded uppercase">{{ san.tipo_sancion }}</span>
                                </div>
                                <p class="text-xs font-bold text-gray-500 uppercase pl-2 mb-1">{{ san.equipo }}</p>
                                <p class="text-xs text-gray-700 italic pl-2">"{{ san.motivo }}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { 
    obtenerTorneosHistorialService, 
    obtenerPartidosHistorialService, 
    obtenerResumenPartidoService 
} from '../../services/arbitrosService.js'

const idArbitroActual = ref(JSON.parse(localStorage.getItem('usuario') || '{}').id_usuario)

const viewMode = ref('torneos') 
const torneos = ref([])
const partidos = ref([])
const resumen = ref(null)

const torneoSeleccionado = ref(null)
const partidoSeleccionado = ref(null)

const tituloVista = computed(() => {
    if (viewMode.value === 'torneos') return 'Historial de Torneos'
    if (viewMode.value === 'partidos') return `Partidos Finalizados`
    if (viewMode.value === 'detalle') return 'Resumen del Partido'
})

onMounted(() => {
    cargarTorneos()
})

const cargarTorneos = async () => {
    try {
        torneos.value = await obtenerTorneosHistorialService(idArbitroActual.value)
    } catch (error) { console.error("Error cargando historial de torneos", error) }
}

const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    try {
        partidos.value = await obtenerPartidosHistorialService(idArbitroActual.value, torneo.id_torneo)
        viewMode.value = 'partidos'
    } catch (error) { console.error("Error cargando historial de partidos", error) }
}

const seleccionarPartido = async (partido) => {
    partidoSeleccionado.value = partido
    try {
        resumen.value = await obtenerResumenPartidoService(partido.id_partido)
        viewMode.value = 'detalle'
    } catch (error) { console.error("Error cargando resumen", error) }
}

const volverAtras = () => {
    if (viewMode.value === 'detalle') {
        viewMode.value = 'partidos'
        partidoSeleccionado.value = null
        resumen.value = null
    } else if (viewMode.value === 'partidos') {
        volverATorneos()
    }
}

const volverATorneos = () => {
    viewMode.value = 'torneos'
    torneoSeleccionado.value = null
    partidoSeleccionado.value = null
    partidos.value = []
    resumen.value = null
    cargarTorneos()
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() + offset)
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>