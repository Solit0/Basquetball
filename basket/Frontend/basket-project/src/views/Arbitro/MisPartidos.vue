<template>
    <div class="space-y-6 relative max-w-7xl mx-auto">
        
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div>
                <div class="flex items-center space-x-2 text-sm font-bold text-amber-600 mb-1">
                    <span @click="volverATorneos" class="cursor-pointer hover:underline">Mis Asignaciones</span>
                    <span v-if="viewMode === 'partidos' || viewMode === 'detalle'">/ {{ torneoSeleccionado?.nombre_torneo }}</span>
                    <span v-if="viewMode === 'detalle'">/ Partido #{{ partidoSeleccionado?.id_partido }}</span>
                </div>
                <h2 class="text-3xl font-black text-gray-900 flex items-center">
                    <button v-if="viewMode !== 'torneos'" @click="volverAtras" class="mr-3 text-amber-500 hover:text-amber-700 transition-colors">
                        &larr;
                    </button>
                    {{ tituloVista }}
                </h2>
            </div>
        </div>

        <div v-if="viewMode === 'torneos'" class="animate-fade-in">
            <div v-if="torneos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p class="text-lg font-bold text-gray-700">No tienes partidos asignados</p>
                <p class="text-sm mt-1">Actualmente no estás convocado como árbitro principal en ningún torneo activo.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="t in torneos" :key="t.id_torneo" @click="seleccionarTorneo(t)"
                     class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 relative overflow-hidden">
                    
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>

                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-gray-900 leading-tight pr-4">{{ t.nombre_torneo }}</h3>
                    </div>
                    
                    <p class="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                        {{ t.categoria }} | {{ t.clasificacion }}
                    </p>
                    
                    <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span class="text-sm font-medium text-gray-600">Partidos por pitar:</span>
                        <span class="px-3 py-1 bg-amber-100 text-amber-800 font-black rounded-full shadow-sm text-sm">
                            {{ t.partidos_pendientes }} pendientes
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="viewMode === 'partidos'" class="animate-fade-in">
            <div v-if="partidos.length === 0" class="text-center py-10 text-gray-500">No hay partidos pendientes en este torneo.</div>
            
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div v-for="p in partidos" :key="p.id_partido" @click="seleccionarPartido(p)"
                     class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-amber-400 cursor-pointer transition-all">
                    
                    <div class="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                        <span class="text-xs font-black text-amber-600 uppercase tracking-wider">{{ p.ronda_torneo }}</span>
                        <span class="text-xs font-bold text-gray-500 flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {{ formatFecha(p.fecha) }} - {{ p.hora }}
                        </span>
                    </div>

                    <div class="flex items-center justify-between mb-3 py-2">
                        <div class="w-2/5 text-right">
                            <p class="font-black text-gray-800 text-lg truncate" :title="p.local_nombre">{{ p.local_siglas || p.local_nombre }}</p>
                            <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Local</p>
                        </div>
                        <div class="w-1/5 text-center">
                            <span class="bg-gray-800 text-white font-black px-2 py-1 rounded text-sm">VS</span>
                        </div>
                        <div class="w-2/5 text-left">
                            <p class="font-black text-gray-800 text-lg truncate" :title="p.visitante_nombre">{{ p.visitante_siglas || p.visitante_nombre }}</p>
                            <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Visitante</p>
                        </div>
                    </div>

                    <div class="text-center text-xs text-gray-500 mt-2 bg-gray-50 py-1.5 rounded flex justify-center items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        Sede: {{ p.nombre_cancha }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else-if="viewMode === 'detalle'" class="animate-fade-in max-w-4xl mx-auto">
            
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
                <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                    <span class="font-bold text-amber-500 uppercase tracking-widest text-sm">{{ partidoDetalle?.ronda_torneo }}</span>
                    <span class="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-black">ESTADO: PENDIENTE</span>
                </div>
                
                <div class="p-8">
                    <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
                        <div class="text-center w-full md:w-2/5">
                            <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full border-4 border-gray-200 mb-3 flex items-center justify-center text-gray-400">
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h4 class="text-2xl font-black text-gray-900">{{ partidoDetalle?.local_nombre }}</h4>
                            <p class="text-xs font-bold text-indigo-600 uppercase mt-1">Equipo Local</p>
                        </div>

                        <div class="text-3xl font-black text-gray-300">VS</div>

                        <div class="text-center w-full md:w-2/5">
                            <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full border-4 border-gray-200 mb-3 flex items-center justify-center text-gray-400">
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h4 class="text-2xl font-black text-gray-900">{{ partidoDetalle?.visitante_nombre }}</h4>
                            <p class="text-xs font-bold text-gray-500 uppercase mt-1">Equipo Visitante</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div class="flex items-center text-gray-700">
                            <svg class="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <div>
                                <p class="text-[10px] font-black uppercase text-gray-400">Fecha y Hora Oficial</p>
                                <p class="font-bold">{{ formatFecha(partidoDetalle?.fecha) }} a las {{ partidoDetalle?.hora }}</p>
                            </div>
                        </div>
                        <div class="flex items-center text-gray-700">
                            <svg class="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            <div>
                                <p class="text-[10px] font-black uppercase text-gray-400">Sede del Encuentro</p>
                                <p class="font-bold">{{ partidoDetalle?.nombre_cancha }}</p>
                                <p class="text-xs text-gray-500">{{ partidoDetalle?.cancha_direccion }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h4 class="text-sm font-black text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Cuerpos Técnicos</h4>
                <div class="grid grid-cols-2 gap-8">
                    <div>
                        <p class="text-xs text-indigo-500 font-bold uppercase">{{ partidoDetalle?.local_nombre }}</p>
                        <p class="font-medium text-gray-900 mt-1 flex items-center">
                            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                            {{ partidoDetalle?.local_entrenador_nombre ? partidoDetalle.local_entrenador_nombre + ' ' + partidoDetalle.local_entrenador_apellido : 'Entrenador no registrado' }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 font-bold uppercase">{{ partidoDetalle?.visitante_nombre }}</p>
                        <p class="font-medium text-gray-900 mt-1 flex items-center">
                            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                            {{ partidoDetalle?.visitante_entrenador_nombre ? partidoDetalle.visitante_entrenador_nombre + ' ' + partidoDetalle.visitante_entrenador_apellido : 'Entrenador no registrado' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// IMPORTACIONES DE LAS RUTAS DE LA CASCADA:
import { 
    obtenerTorneosAsignadosService, 
    obtenerPartidosPorTorneoService, 
    obtenerDetallePartidoService 
} from '../services/arbitrosService.js'

const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const idArbitroActual = ref(usuarioGuardado.id_usuario || 1) // Fallback de seguridad

const viewMode = ref('torneos') // 'torneos' | 'partidos' | 'detalle'

const torneos = ref([])
const partidos = ref([])
const partidoDetalle = ref(null)

const torneoSeleccionado = ref(null)
const partidoSeleccionado = ref(null)

const tituloVista = computed(() => {
    if (viewMode.value === 'torneos') return 'Torneos Asignados'
    if (viewMode.value === 'partidos') return `Partidos Programados`
    if (viewMode.value === 'detalle') return 'Detalle del Encuentro'
})

onMounted(async () => {
    await cargarTorneos()
})

const cargarTorneos = async () => {
    try {
        torneos.value = await obtenerTorneosAsignadosService(idArbitroActual.value)
    } catch (error) {
        console.error("Error cargando torneos", error)
    }
}

const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    try {
        partidos.value = await obtenerPartidosPorTorneoService(idArbitroActual.value, torneo.id_torneo)
        viewMode.value = 'partidos'
    } catch (error) {
        console.error("Error cargando partidos", error)
    }
}

const seleccionarPartido = async (partido) => {
    partidoSeleccionado.value = partido
    try {
        partidoDetalle.value = await obtenerDetallePartidoService(idArbitroActual.value, partido.id_partido)
        viewMode.value = 'detalle'
    } catch (error) {
        console.error("Error cargando detalle", error)
    }
}

const volverAtras = () => {
    if (viewMode.value === 'detalle') {
        viewMode.value = 'partidos'
        partidoDetalle.value = null
        partidoSeleccionado.value = null
    } else if (viewMode.value === 'partidos') {
        volverATorneos()
    }
}

const volverATorneos = () => {
    viewMode.value = 'torneos'
    torneoSeleccionado.value = null
    partidoSeleccionado.value = null
    partidos.value = []
    partidoDetalle.value = null
    cargarTorneos()
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() + offset)
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>