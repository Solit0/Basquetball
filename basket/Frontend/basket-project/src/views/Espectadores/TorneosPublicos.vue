<template>
    <div class="min-h-screen bg-gray-50">
        
        <NavbarEspectador />

        <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
            
            <div class="mb-8 flex items-center justify-between">
                <div>
                    <div class="flex items-center space-x-2 text-sm font-bold text-indigo-600 mb-1">
                        <span @click="volver" class="cursor-pointer hover:underline">Torneos Públicos</span>
                        <span v-if="torneoSeleccionado" class="text-gray-500">/ {{ torneoSeleccionado.nombre_torneo }}</span>
                    </div>
                    <h2 class="text-3xl font-black text-gray-900 tracking-tight flex items-center">
                        <button v-if="torneoSeleccionado" @click="volver" class="mr-3 text-indigo-500 hover:text-indigo-700 transition-colors" title="Regresar">
                            &larr;
                        </button>
                        {{ torneoSeleccionado ? 'Detalles de la Competición' : 'Torneos en Disputa' }}
                    </h2>
                    <p v-if="!torneoSeleccionado" class="mt-2 text-gray-600 font-medium">Conoce las ligas y competiciones que ya están en fase de juego.</p>
                </div>
            </div>

            <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-gray-500 font-medium">Cargando competiciones...</p>
            </div>

            <div v-else-if="!torneoSeleccionado" class="animate-fade-in">
                <div v-if="torneos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    <p class="text-lg font-bold text-gray-600">No hay torneos en juego</p>
                    <p class="text-sm text-gray-500 mt-1">Actualmente todos los torneos están en fase de inscripción o han finalizado.</p>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="t in torneos" :key="t.id_torneo" @click="seleccionarTorneo(t)"
                         class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-400 cursor-pointer transition-all transform hover:-translate-y-1 relative overflow-hidden group">
                        
                        <div class="absolute left-0 top-0 bottom-0 w-1" :class="t.estado === 'En curso' ? 'bg-green-500' : 'bg-indigo-500'"></div>
                        
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="text-xl font-black text-gray-900 leading-tight pr-2 group-hover:text-indigo-600 transition-colors">{{ t.nombre_torneo }}</h3>
                        </div>
                        
                        <div class="space-y-2 mt-4 text-sm text-gray-600 font-medium">
                            <p class="flex items-center">
                                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span>Inicio:</span> <span class="ml-1 text-gray-800">{{ formatFecha(t.fecha_inicio) }}</span>
                            </p>
                            <p class="flex items-center">
                                <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                <span>Categoría:</span> <span class="ml-1 text-gray-800">{{ t.categoria || 'General' }}</span>
                            </p>
                        </div>

                        <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span class="px-3 py-1 bg-green-50 text-green-700 border-green-200 text-[10px] font-black rounded-full border uppercase tracking-widest shadow-sm">
                                EN COMPETICIÓN
                            </span>
                            <span class="text-indigo-600 text-sm font-bold group-hover:underline flex items-center">
                                Ver Detalles &rarr;
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="animate-fade-in space-y-6">
                
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="bg-slate-900 px-6 md:px-8 py-6 text-white flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                            <h3 class="text-2xl md:text-3xl font-black tracking-wide">{{ torneoSeleccionado.nombre_torneo }}</h3>
                            <p class="text-indigo-300 text-sm mt-1 font-medium flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Del {{ formatFecha(torneoSeleccionado.fecha_inicio) }} al {{ formatFecha(torneoSeleccionado.fecha_fin) }}
                            </p>
                        </div>
                        <span class="px-4 py-1.5 bg-green-500 rounded-full text-xs font-black tracking-wider uppercase mt-4 md:mt-0 inline-block text-center shadow-sm">
                            En Competición
                        </span>
                    </div>
                    
                    <div class="p-6 md:p-8">
                        <h4 class="font-black text-gray-800 uppercase tracking-widest text-sm mb-4 flex items-center border-b pb-2">
                            <svg class="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            Reglamento Oficial
                        </h4>
                        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-line leading-relaxed shadow-inner">
                            {{ torneoSeleccionado.reglamento || 'No hay un reglamento específico registrado para este torneo. Se aplicarán las normas FIBA vigentes en todo momento.' }}
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                        <h4 class="text-lg font-black text-gray-800 uppercase tracking-widest flex items-center">
                            <svg class="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Equipos Participantes
                        </h4>
                        <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-indigo-200">
                            {{ equiposInscritos.length }} Inscritos
                        </span>
                    </div>
                    
                    <div v-if="cargandoEquipos" class="text-center py-10 text-gray-500 font-medium">
                        Cargando equipos...
                    </div>

                    <div v-else-if="equiposInscritos.length === 0" class="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                        Aún no hay equipos inscritos en este torneo.
                    </div>
                    
                    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <div v-for="equipo in equiposInscritos" :key="equipo.id_equipo" 
                             @click="abrirScouting(equipo)"
                             :class="equipo.estado_inscripcion === 'Eliminado' ? 'opacity-75 grayscale-30' : ''"
                             class="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md hover:border-indigo-400 transition-all group cursor-pointer relative">
                            
                            <div v-if="equipo.estado_inscripcion === 'Eliminado'" class="absolute top-2 left-2 bg-red-100 text-red-700 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-red-200 z-10 shadow-sm">
                                Eliminado
                            </div>

                            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </div>

                            <div class="w-14 h-14 mx-auto bg-gray-100 rounded-full border-4 border-white shadow-sm mb-3 flex items-center justify-center text-gray-400 font-black text-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {{ equipo.nombre_oficial.substring(0, 2).toUpperCase() }}
                            </div>
                            <p class="font-bold text-gray-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors" :title="equipo.nombre_oficial">
                                {{ equipo.nombre_oficial }}
                            </p>
                            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                {{ equipo.siglas || 'N/A' }}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            <div v-if="showScoutingModal" class="fixed inset-0 z-120 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                    <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                        <div>
                            <h3 class="font-black tracking-widest uppercase flex items-center">
                                <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                Roster Oficial
                            </h3>
                            <p class="text-xs text-slate-400 mt-1">Equipo: <span class="text-white font-bold">{{ equipoScoutingSeleccionado?.nombre_oficial }}</span></p>
                        </div>
                        <button @click="showScoutingModal = false" class="text-slate-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                        <div v-if="cargandoScouting" class="py-12 text-center text-indigo-500">
                            <svg class="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <p class="font-bold text-sm">Cargando jugadores...</p>
                        </div>
                        <div v-else-if="rosterScouting.length === 0" class="py-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white">
                            <p>El equipo aún no ha hecho público su roster.</p>
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="jugador in rosterScouting" :key="jugador.id_jugador" class="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
                                <div class="flex items-center">
                                    <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black mr-4">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    </div>
                                    <div>
                                        <p class="font-bold text-gray-900">{{ jugador.nombre }} {{ jugador.apellido }}</p>
                                    </div>
                                </div>
                                <span v-if="jugador.es_capitan" class="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded border border-yellow-200 flex items-center">
                                    © Capitán
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavbarEspectador from '../../components/NavbarEspectador.vue'

import { obtenerTorneosActivosService, obtenerEquiposInscritosService } from '../../services/torneosService'
import { obtenerPartidosPorTorneo } from '../../services/partidosService'

import { obtenerRosterPublicoService } from '../../services/inscripcionesService'

const torneos = ref([])
const torneoSeleccionado = ref(null)
const equiposInscritos = ref([])

const cargando = ref(true)
const cargandoEquipos = ref(false)

const showScoutingModal = ref(false)
const equipoScoutingSeleccionado = ref(null)
const rosterScouting = ref([])
const cargandoScouting = ref(false)

onMounted(async () => {
    try {
        cargando.value = true
        const data = await obtenerTorneosActivosService()
        const torneosValidos = []
        
        for (const torneo of data) {
            const partidosDelTorneo = await obtenerPartidosPorTorneo(torneo.id_torneo)
            if (partidosDelTorneo && partidosDelTorneo.length > 0) {
                torneosValidos.push(torneo)
            }
        }
        
        torneos.value = torneosValidos
    } catch (error) {
        console.error("Error al cargar torneos:", error)
    } finally {
        cargando.value = false
    }
})
const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    try {
        cargandoEquipos.value = true
        equiposInscritos.value = await obtenerEquiposInscritosService(torneo.id_torneo)
    } catch (error) {
        console.error("Error al cargar equipos:", error)
    } finally {
        cargandoEquipos.value = false
    }
}
const abrirScouting = async (equipo) => {
    equipoScoutingSeleccionado.value = equipo;
    showScoutingModal.value = true;
    cargandoScouting.value = true;
    rosterScouting.value = [];

    try {
        const data = await obtenerRosterPublicoService(torneoSeleccionado.value.id_torneo, equipo.id_equipo);
        rosterScouting.value = data || [];
    } catch (error) {
        console.error("Error obteniendo roster del equipo:", error);
    } finally {
        cargandoScouting.value = false;
    }
}

const volver = () => {
    torneoSeleccionado.value = null
    equiposInscritos.value = []
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>