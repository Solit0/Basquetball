<template>
    <div class="min-h-screen bg-gray-50">
        
        <NavbarEspectador />

        <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
            
            <div class="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 class="text-3xl font-black text-gray-900 tracking-tight">Calendario Oficial</h2>
                    <p class="mt-2 text-gray-600 font-medium">Sigue de cerca todos los encuentros de las ligas activas.</p>
                </div>
                
                <div class="mt-6 md:mt-0 flex bg-gray-200 p-1 rounded-xl shadow-inner">
                    <button @click="tabActiva = 'proximos'" 
                            :class="tabActiva === 'proximos' ? 'bg-white text-indigo-700 shadow-sm font-black' : 'text-gray-600 font-medium hover:text-gray-800'"
                            class="px-6 py-2.5 rounded-lg text-sm transition-all">
                        Próximos Encuentros
                    </button>
                    <button @click="tabActiva = 'resultados'" 
                            :class="tabActiva === 'resultados' ? 'bg-white text-indigo-700 shadow-sm font-black' : 'text-gray-600 font-medium hover:text-gray-800'"
                            class="px-6 py-2.5 rounded-lg text-sm transition-all">
                        Resultados Oficiales
                    </button>
                </div>
            </div>

            <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-gray-500 font-medium">Cargando calendario...</p>
            </div>

            <div v-else>
                <div v-if="tabActiva === 'proximos'" class="animate-fade-in">
                    <div v-if="partidosProximos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                        <p class="text-lg font-bold text-gray-600">No hay partidos programados</p>
                        <p class="text-sm text-gray-500 mt-1">Vuelve más tarde para ver las nuevas fechas.</p>
                    </div>

                    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div v-for="p in partidosProximos" :key="p.id_partido" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                            
                            <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                                <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                    {{ p.nombre_torneo }} | {{ p.ronda_torneo }}
                                </span>
                                <span class="text-xs font-bold text-gray-500 flex items-center">
                                    <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    {{ formatFecha(p.fecha) }} - {{ p.hora }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between mb-4 py-2">
                                <div class="w-2/5 text-right">
                                    <p class="font-black text-gray-900 text-xl truncate" :title="p.local_nombre">{{ p.local_nombre }}</p>
                                    <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Local</p>
                                </div>
                                <div class="w-1/5 text-center">
                                    <span class="bg-gray-100 text-gray-400 font-black px-3 py-1.5 rounded-lg text-sm border border-gray-200">VS</span>
                                </div>
                                <div class="w-2/5 text-left">
                                    <p class="font-black text-gray-900 text-xl truncate" :title="p.visitante_nombre">{{ p.visitante_nombre }}</p>
                                    <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Visitante</p>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 font-medium mt-auto">
                                <div class="flex items-center mb-2 sm:mb-0">
                                    <svg class="w-4 h-4 mr-1.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    Sede: <strong class="ml-1 text-gray-800">{{ p.nombre_cancha }}</strong>
                                </div>
                                <div class="flex items-center" title="Árbitro Principal">
                                    <svg class="w-4 h-4 mr-1.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Árbitro: <strong class="ml-1 text-gray-800">{{ p.arbitro_nombre ? p.arbitro_nombre + ' ' + p.arbitro_apellido : 'Por definir' }}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="tabActiva === 'resultados'" class="animate-fade-in">
                    <div v-if="partidosFinalizados.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                        <p class="text-lg font-bold text-gray-600">No hay resultados disponibles</p>
                        <p class="text-sm text-gray-500 mt-1">Aún no ha finalizado ningún encuentro.</p>
                    </div>

                    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div v-for="p in partidosFinalizados" :key="p.id_partido" 
                             class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between">
                            
                            <div class="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                                <span class="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{{ p.nombre_torneo }}</span>
                                <span class="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded uppercase">Finalizado</span>
                            </div>

                            <div class="flex items-center justify-between mb-6">
                                <div class="w-2/5 text-right">
                                    <p class="font-black text-gray-900 text-lg truncate" :title="p.local_nombre">{{ p.local_nombre }}</p>
                                </div>
                                <div class="w-1/5 text-center">
                                    <div class="bg-slate-900 text-white px-3 py-1.5 rounded shadow-inner text-xl font-black tracking-widest">
                                        {{ p.marcador_local }} - {{ p.marcador_visitante }}
                                    </div>
                                </div>
                                <div class="w-2/5 text-left">
                                    <p class="font-black text-gray-900 text-lg truncate" :title="p.visitante_nombre">{{ p.visitante_nombre }}</p>
                                </div>
                            </div>

                            <button @click="abrirFichaTecnica(p)" 
                                    class="w-full py-2.5 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-200 flex items-center justify-center mt-auto">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Ver Ficha Técnica Completa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <div v-if="modalAbierto && fichaActual" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                
                <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 class="font-black tracking-widest uppercase text-sm text-indigo-400 mb-1">{{ fichaActual.partido.nombre_torneo }} - {{ fichaActual.partido.ronda_torneo }}</h3>
                        <p class="text-xs text-gray-400">{{ formatFecha(fichaActual.partido.fecha) }} | Sede: {{ fichaActual.partido.nombre_cancha }}</p>
                    </div>
                    <button @click="cerrarFicha" class="text-gray-400 hover:text-white transition-colors bg-slate-800 rounded-full p-1">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                    
                    <div v-if="cargandoFicha" class="text-center py-10">
                        <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p class="text-gray-500 font-medium text-sm">Cargando estadísticas oficiales...</p>
                    </div>

                    <div v-else>
                        <div class="flex items-center justify-center gap-4 md:gap-8 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div class="text-center flex-1">
                                <h4 class="text-xl md:text-3xl font-black text-gray-900">{{ fichaActual.partido.local_nombre }}</h4>
                                <p class="text-xs font-bold text-gray-500 uppercase mt-1">Local</p>
                            </div>
                            <div class="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-4xl md:text-6xl font-black shadow-inner tracking-widest border-4 border-indigo-400">
                                {{ fichaActual.partido.marcador_local }} - {{ fichaActual.partido.marcador_visitante }}
                            </div>
                            <div class="text-center flex-1">
                                <h4 class="text-xl md:text-3xl font-black text-gray-900">{{ fichaActual.partido.visitante_nombre }}</h4>
                                <p class="text-xs font-bold text-gray-500 uppercase mt-1">Visitante</p>
                            </div>
                        </div>

                        <div class="mb-4 flex justify-end">
                            <div class="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200 text-[10px] text-gray-600 font-bold flex space-x-3">
                                <span><span class="text-green-500">✓</span> Presente</span>
                                <span><span class="text-gray-400">X</span> Ausente</span>
                                <span><span class="text-red-500">🚫</span> Inhabilitado</span>
                                <span><span class="bg-amber-400 text-amber-900 px-1 rounded">©</span> Capitán</span>
                                <span><span class="border border-indigo-200 text-indigo-600 px-1 rounded">T</span> Titular</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            
                            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h5 class="font-black text-gray-800 uppercase tracking-widest text-sm">{{ fichaActual.partido.local_nombre }}</h5>
                                    <span class="text-xs font-bold text-indigo-600">{{ fichaActual.partido.marcador_local }} PTS</span>
                                </div>
                                <table class="w-full text-left text-sm">
                                    <thead class="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase border-b border-gray-200">
                                        <tr>
                                            <th class="px-4 py-2">Jugador</th>
                                            <th class="px-2 py-2 text-center">Estado</th>
                                            <th class="px-4 py-2 text-right text-indigo-600">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100">
                                        <tr v-for="j in fichaActual.alineacionLocal" :key="j.id_jugador" class="hover:bg-gray-50">
                                            <td class="px-4 py-2.5">
                                                <div class="flex items-center">
                                                    <span class="w-5 h-5 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px] font-black mr-2 shrink-0">{{ j.numero_camiseta }}</span>
                                                    <span class="font-medium text-gray-900" :class="{'line-through text-gray-400': j.estado_asistencia !== 'Presente'}">{{ j.nombre }} {{ j.apellido }}</span>
                                                    <span v-if="j.es_capitan" class="ml-1 text-[9px] bg-amber-400 text-amber-900 px-1 py-0.5 rounded font-bold shrink-0" title="Capitán">©</span>
                                                    <span v-if="j.rol_partido === 'Titular'" class="ml-1 text-[9px] border border-indigo-200 text-indigo-600 px-1 py-0.5 rounded font-bold shrink-0" title="Titular">T</span>
                                                </div>
                                            </td>
                                            <td class="px-2 py-2.5 text-center shrink-0">
                                                <span v-if="j.estado_asistencia === 'Presente'" class="text-green-500 font-bold" title="Presente">✓</span>
                                                <span v-else-if="j.estado_asistencia === 'Ausente'" class="text-gray-400 font-bold" title="Ausente">X</span>
                                                <span v-else class="text-red-500 font-bold" title="Inhabilitado">🚫</span>
                                            </td>
                                            <td class="px-4 py-2.5 text-right font-black text-indigo-600 text-sm shrink-0">
                                                {{ j.estado_asistencia === 'Presente' ? (j.puntos_anotados || 0) : '-' }}
                                            </td>
                                        </tr>
                                        <tr v-if="fichaActual.alineacionLocal.length === 0">
                                            <td colspan="3" class="px-4 py-6 text-center text-gray-400 text-sm italic">Sin registros de jugadores.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h5 class="font-black text-gray-800 uppercase tracking-widest text-sm">{{ fichaActual.partido.visitante_nombre }}</h5>
                                    <span class="text-xs font-bold text-indigo-600">{{ fichaActual.partido.marcador_visitante }} PTS</span>
                                </div>
                                <table class="w-full text-left text-sm">
                                    <thead class="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase border-b border-gray-200">
                                        <tr>
                                            <th class="px-4 py-2">Jugador</th>
                                            <th class="px-2 py-2 text-center">Estado</th>
                                            <th class="px-4 py-2 text-right text-indigo-600">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100">
                                        <tr v-for="j in fichaActual.alineacionVisitante" :key="j.id_jugador" class="hover:bg-gray-50">
                                            <td class="px-4 py-2.5">
                                                <div class="flex items-center">
                                                    <span class="w-5 h-5 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-[10px] font-black mr-2 shrink-0">{{ j.numero_camiseta }}</span>
                                                    <span class="font-medium text-gray-900" :class="{'line-through text-gray-400': j.estado_asistencia !== 'Presente'}">{{ j.nombre }} {{ j.apellido }}</span>
                                                    <span v-if="j.es_capitan" class="ml-1 text-[9px] bg-amber-400 text-amber-900 px-1 py-0.5 rounded font-bold shrink-0" title="Capitán">©</span>
                                                    <span v-if="j.rol_partido === 'Titular'" class="ml-1 text-[9px] border border-indigo-200 text-indigo-600 px-1 py-0.5 rounded font-bold shrink-0" title="Titular">T</span>
                                                </div>
                                            </td>
                                            <td class="px-2 py-2.5 text-center shrink-0">
                                                <span v-if="j.estado_asistencia === 'Presente'" class="text-green-500 font-bold" title="Presente">✓</span>
                                                <span v-else-if="j.estado_asistencia === 'Ausente'" class="text-gray-400 font-bold" title="Ausente">X</span>
                                                <span v-else class="text-red-500 font-bold" title="Inhabilitado">🚫</span>
                                            </td>
                                            <td class="px-4 py-2.5 text-right font-black text-indigo-600 text-sm shrink-0">
                                                {{ j.estado_asistencia === 'Presente' ? (j.puntos_anotados || 0) : '-' }}
                                            </td>
                                        </tr>
                                        <tr v-if="fichaActual.alineacionVisitante.length === 0">
                                            <td colspan="3" class="px-4 py-6 text-center text-gray-400 text-sm italic">Sin registros de jugadores.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div v-if="fichaActual.sanciones && fichaActual.sanciones.length > 0" class="bg-red-50 border border-red-200 rounded-xl p-5 mb-4">
                            <h4 class="text-sm font-black text-red-800 uppercase tracking-widest mb-4 flex items-center border-b border-red-200 pb-2">
                                <svg class="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                Sanciones Disciplinarias del Encuentro
                            </h4>
                            <div class="space-y-3">
                                <div v-for="(san, index) in fichaActual.sanciones" :key="index" class="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                        <p class="text-sm font-bold text-gray-900">
                                            {{ san.nombre_jugador }} {{ san.apellido_jugador }} <span class="text-gray-500 font-normal ml-1">({{ san.equipo_nombre }})</span>
                                        </p>
                                        <p class="text-xs text-gray-600 italic mt-1">"{{ san.motivo }}"</p>
                                    </div>
                                    <div class="mt-2 md:mt-0 shrink-0">
                                        <span class="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-black uppercase tracking-wider border border-red-200">{{ san.tipo_sancion }}</span>
                                    </div>
                                </div>
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
import NavbarEspectador from '../../components/NavbarEspectador.vue'

// Importamos los servicios reales
import { obtenerPartidosPublicosService, obtenerFichaTecnicaPublicaService } from '../../services/partidosService'

const tabActiva = ref('proximos')
const cargando = ref(true)
const todosLosPartidos = ref([])

// Variables del Modal
const modalAbierto = ref(false)
const cargandoFicha = ref(false)
const fichaActual = ref(null)

onMounted(async () => {
    try {
        cargando.value = true;
        // Obtenemos todos los partidos públicos de la BD
        const data = await obtenerPartidosPublicosService();
        todosLosPartidos.value = data;
    } catch (error) {
        console.error("Error al cargar el calendario:", error);
    } finally {
        cargando.value = false;
    }
})

// Partidos pendientes
const partidosProximos = computed(() => {
    return todosLosPartidos.value.filter(p => p.estado !== 'Finalizado')
})

// Partidos con resultados
const partidosFinalizados = computed(() => {
    return todosLosPartidos.value.filter(p => p.estado === 'Finalizado')
})

const abrirFichaTecnica = async (partido) => {
    modalAbierto.value = true;
    cargandoFicha.value = true;
    fichaActual.value = { partido: partido }; // Cargamos la info básica primero
    
    try {
        // Pedimos los detalles profundos al backend (Alineaciones, puntos, sanciones)
        const detalles = await obtenerFichaTecnicaPublicaService(partido.id_partido);
        
        // Construimos el objeto completo para el modal
        fichaActual.value = {
            partido: partido,
            alineacionLocal: detalles.alineacionLocal || [],
            alineacionVisitante: detalles.alineacionVisitante || [],
            sanciones: detalles.sanciones || []
        }
    } catch (error) {
        alert("Ocurrió un error al cargar la ficha técnica del partido.");
        console.error(error);
        modalAbierto.value = false;
    } finally {
        cargandoFicha.value = false;
    }
}

const cerrarFicha = () => {
    modalAbierto.value = false;
    setTimeout(() => { fichaActual.value = null; }, 300); // Dar tiempo a la animación
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
</style>