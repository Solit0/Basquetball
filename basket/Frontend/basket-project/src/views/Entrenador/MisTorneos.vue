<template>
    <div class="space-y-6 animate-fade-in relative">
        
        <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div>
                <div class="flex items-center space-x-2 text-sm font-bold text-indigo-600 mb-1">
                    <span @click="volverALista" class="cursor-pointer hover:underline">Mis Torneos</span>
                    <span v-if="torneoSeleccionado" class="text-gray-500">/ {{ torneoSeleccionado.nombre_torneo }}</span>
                </div>
                <h2 class="text-3xl font-black text-gray-900 flex items-center">
                    <button v-if="torneoSeleccionado" @click="volverALista" class="mr-3 text-indigo-500 hover:text-indigo-700 transition-colors" title="Regresar">
                        &larr;
                    </button>
                    {{ torneoSeleccionado ? 'Detalles del Torneo' : 'Torneos en Disputa' }}
                </h2>
                <p v-if="!torneoSeleccionado" class="text-gray-600 mt-1">Competiciones en las que tu equipo está inscrito oficialmente.</p>
            </div>
        </div>

        <div v-if="showReglamentoModal" class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
                <div class="bg-red-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h3 class="font-black tracking-widest uppercase flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Lectura Obligatoria
                    </h3>
                </div>
                <div class="p-8 overflow-y-auto flex-1">
                    <h4 class="text-2xl font-black text-gray-900 mb-2">Reglamento Oficial: {{ torneoPendiente?.nombre_torneo }}</h4>
                    <p class="text-gray-500 text-sm mb-6 pb-4 border-b">Debes leer y aceptar las normativas de este torneo para poder acceder a la información, calendarios y estadísticas.</p>
                    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-line leading-relaxed shadow-inner">
                        {{ torneoPendiente?.reglamento || 'No hay un reglamento específico registrado para este torneo. Se aplicarán las normas FIBA vigentes en todo momento.' }}
                    </div>
                </div>
                <div class="bg-gray-50 px-8 py-5 border-t border-gray-200 shrink-0">
                    <label class="flex items-center space-x-3 cursor-pointer mb-5 p-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                        <input type="checkbox" v-model="reglasAceptadas" class="w-6 h-6 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer">
                        <span class="text-gray-800 font-bold select-none">He leído, comprendido y acepto cumplir con el reglamento establecido para este torneo.</span>
                    </label>
                    <div class="flex justify-end space-x-4">
                        <button @click="cancelarReglamento" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">Cancelar y Volver</button>
                        <button @click="confirmarReglamento" :disabled="!reglasAceptadas" :class="!reglasAceptadas ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'" class="px-8 py-3 text-white font-black rounded-lg transition-all flex items-center">
                            Aceptar y Continuar &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!torneoSeleccionado" class="animate-fade-in">
            <div v-if="torneos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p class="text-lg font-bold text-gray-700">Sin competiciones activas</p>
                <p class="text-sm mt-1">Tu equipo no está participando en ningún torneo en este momento.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="t in torneos" :key="t.id_torneo" @click="intentarSeleccionarTorneo(t)"
                     class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 relative overflow-hidden group">
                    <div class="absolute left-0 top-0 bottom-0 w-1" :class="t.estado === 'En curso' ? 'bg-green-500' : 'bg-indigo-500'"></div>
                    
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-bold text-gray-900 leading-tight pr-2 group-hover:text-indigo-600 transition-colors">{{ t.nombre_torneo }}</h3>
                    </div>
                    
                    <div class="space-y-2 mt-4 text-sm text-gray-600">
                        <p class="flex items-center">
                            <span class="font-medium">Inicio:</span> <span class="ml-1">{{ t.fecha_inicio.split('T')[0] }}</span>
                        </p>
                        <p class="flex items-center">
                            <span class="font-medium">Categoría:</span> <span class="ml-1">{{ t.categoria }}</span>
                        </p>
                        <p class="flex items-center mt-2 pt-2 border-t border-gray-100">
                            <span class="font-bold text-gray-800 text-xs uppercase">Inscripción:</span>
                            <span v-if="t.estado_inscripcion === 'Aprobada'" class="ml-2 text-xs font-black text-green-600 bg-green-100 px-2 py-0.5 rounded">Aprobada</span>
                            <span v-else-if="t.estado_inscripcion === 'Pendiente'" class="ml-2 text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded">En Revisión</span>
                            <span v-else class="ml-2 text-xs font-black text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{{ t.estado_inscripcion || 'Inscrito' }}</span>
                        </p>
                    </div>

                    <div class="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span :class="t.estado === 'En curso' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'" class="px-2.5 py-1 text-xs font-black rounded uppercase">
                            {{ t.estado }}
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
                <div class="bg-slate-900 px-6 py-5 text-white flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                        <h3 class="text-2xl font-black tracking-wide">{{ torneoSeleccionado.nombre_torneo }}</h3>
                        <p class="text-indigo-300 text-sm mt-1 font-medium">Categoría: {{ torneoSeleccionado.categoria }}</p>
                    </div>
                    <span :class="torneoSeleccionado.estado === 'En curso' ? 'bg-green-500' : 'bg-indigo-500'" class="px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mt-4 md:mt-0 inline-block text-center shadow-sm">
                        Estado: {{ torneoSeleccionado.estado }}
                    </span>
                </div>
                
                <div class="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="space-y-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h4 class="font-black text-gray-800 uppercase tracking-widest text-xs mb-4 border-b border-gray-200 pb-2">Información Logística</h4>
                        <div class="flex items-start">
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase">Periodo de Competición</p>
                                <p class="text-sm font-medium text-gray-900">Del {{ torneoSeleccionado.fecha_inicio.split('T')[0] }} al {{ torneoSeleccionado.fecha_fin.split('T')[0] }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4 bg-green-50 p-5 rounded-xl border border-green-200 relative">
                        <h4 class="font-black text-green-900 uppercase tracking-widest text-xs mb-4 border-b border-green-200 pb-2 pr-8">Reglamento y Observaciones</h4>
                        <div class="text-sm text-gray-700 whitespace-pre-line max-h-32 overflow-y-auto pr-2">
                            {{ torneoSeleccionado.reglamento || 'No hay un reglamento específico registrado para este torneo.' }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-indigo-200 p-6 md:p-8 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
                <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <h4 class="text-lg font-black text-indigo-900 uppercase flex items-center">
                        <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Mi Roster Oficial
                    </h4>
                    <span v-if="!cargandoRoster" class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">{{ miRoster.length }} Convocados</span>
                </div>
                
                <div v-if="cargandoRoster" class="text-center py-8 text-indigo-500">
                    <svg class="animate-spin h-8 w-8 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="italic text-sm font-bold">Cargando tu roster...</p>
                </div>
                
                <div v-else-if="miRoster.length === 0" class="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p class="font-medium">Tu equipo aún no tiene un roster oficial aprobado para este torneo.</p>
                </div>
                
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="jugador in miRoster" :key="jugador.id_jugador" 
                         class="flex items-center p-3 rounded-lg border transition-all"
                         :class="jugador.esta_suspendido ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100'">
                        
                        <div class="w-8 h-8 rounded flex items-center justify-center font-black text-sm mr-3 shadow-sm border"
                             :class="jugador.esta_suspendido ? 'bg-red-100 text-red-800 border-red-200' : 'bg-indigo-600 text-white border-indigo-700'">
                            {{ jugador.numero_camiseta }}
                        </div>
                        
                        <div class="flex-1">
                            <p class="font-bold text-sm truncate" :class="jugador.esta_suspendido ? 'text-red-900 line-through' : 'text-gray-900'">
                                {{ jugador.nombre }} {{ jugador.apellido }}
                            </p>
                            
                            <p class="text-[10px] font-black uppercase tracking-wider mt-0.5">
                                <span v-if="jugador.esta_suspendido" class="text-red-600 flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                    INHABILITADO
                                </span>
                                <span v-else>
                                    <span :class="jugador.rol_roster === 'Titular' ? 'text-indigo-600' : 'text-gray-400'">{{ jugador.rol_roster }}</span>
                                    <span v-if="jugador.es_capitan" class="ml-1 text-yellow-600">(© CAPITÁN)</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <h4 class="text-lg font-black text-gray-800 uppercase flex items-center">
                        <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Equipos Participantes (Scouting)
                    </h4>
                    <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{{ equiposRivales.length }} Inscritos</span>
                </div>
                
                <div v-if="equiposRivales.length === 0" class="text-center py-8 text-gray-500 italic">
                    Cargando equipos participantes...
                </div>
                
                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div v-for="equipo in equiposRivales" :key="equipo.id_equipo" 
                         @click="equipo.id_equipo !== miEquipoId ? abrirScouting(equipo) : null"
                         class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center transition-all relative group"
                         :class="{'border-indigo-400 bg-indigo-50': equipo.id_equipo === miEquipoId, 'hover:border-indigo-300 hover:shadow-md cursor-pointer': equipo.id_equipo !== miEquipoId}">
                        
                        <span v-if="equipo.id_equipo === miEquipoId" class="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase">Mi Equipo</span>
                        
                        <div v-if="equipo.id_equipo !== miEquipoId" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </div>

                        <div class="w-12 h-12 mx-auto bg-white rounded-full border-2 border-gray-300 mb-3 flex items-center justify-center text-gray-400 font-bold"
                             :class="{'border-indigo-300 text-indigo-500': equipo.id_equipo === miEquipoId}">
                            {{ equipo.nombre_oficial.substring(0, 2).toUpperCase() }}
                        </div>
                        <p class="font-bold text-gray-800 text-sm truncate" :title="equipo.nombre_oficial">{{ equipo.nombre_oficial }}</p>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="showScoutingModal" class="fixed inset-0 z-120 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 class="font-black tracking-widest uppercase flex items-center">
                            <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            Reporte de Scouting
                        </h3>
                        <p class="text-xs text-slate-400 mt-1">Roster de: <span class="text-white font-bold">{{ equipoScoutingSeleccionado?.nombre_oficial }}</span></p>
                    </div>
                    <button @click="showScoutingModal = false" class="text-slate-400 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div v-if="cargandoScouting" class="py-12 text-center text-indigo-500">
                        <svg class="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p class="font-bold text-sm">Obteniendo datos del rival...</p>
                    </div>
                    
                    <div v-else-if="rosterScouting.length === 0" class="py-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white">
                        <p>El equipo aún no ha hecho público su roster oficial o no tiene jugadores aprobados.</p>
                    </div>
                    
                    <div v-else class="space-y-3">
                        <div v-for="jugador in rosterScouting" :key="jugador.id_jugador" 
                             class="bg-white border rounded-lg p-4 flex justify-between items-center shadow-sm"
                             :class="jugador.esta_suspendido ? 'border-red-200 bg-red-50' : 'border-gray-200'">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full flex items-center justify-center font-black mr-4"
                                     :class="jugador.esta_suspendido ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'">
                                    {{ jugador.numero_camiseta || '#' }}
                                </div>
                                <div>
                                    <p class="font-bold text-gray-900" :class="{'line-through text-red-800' : jugador.esta_suspendido}">
                                        {{ jugador.nombre }} {{ jugador.apellido }}
                                    </p>
                                    <p v-if="jugador.esta_suspendido" class="text-[10px] font-black text-red-600 uppercase mt-0.5">Sancionado</p>
                                </div>
                            </div>
                            <span v-if="jugador.es_capitan && !jugador.esta_suspendido" class="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded border border-yellow-200 flex items-center">
                                © Capitán
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerTorneosDeEquipoService, obtenerEquiposInscritosService } from '../../services/torneosService' 
import { obtenerPartidosPorTorneo } from '../../services/partidosService'
import { obtenerMiRosterService, obtenerRosterPublicoService } from '../../services/inscripcionesService'

const idUsuario = localStorage.getItem('usuario_id') 

const miEquipoId = ref(null) 
const torneos = ref([])
const torneoSeleccionado = ref(null)
const equiposRivales = ref([])
const partidosTorneo = ref([])

const miRoster = ref([])
const cargandoRoster = ref(false) 

const showScoutingModal = ref(false)
const equipoScoutingSeleccionado = ref(null)
const rosterScouting = ref([])
const cargandoScouting = ref(false)

const showReglamentoModal = ref(false)
const torneoPendiente = ref(null)
const reglasAceptadas = ref(false)

onMounted(async () => {
    try {
        if (!idUsuario) return;
        const data = await obtenerTorneosDeEquipoService(idUsuario)
        torneos.value = data
        if (data.length > 0 && data[0].id_equipo) {
            miEquipoId.value = data[0].id_equipo
        }
    } catch (error) {
        console.error("Error cargando torneos del equipo:", error)
    }
})

const haAceptadoReglas = (idTorneo) => {
    const key = `reglas_aceptadas_t${idTorneo}_e${miEquipoId.value}`;
    return localStorage.getItem(key) === 'true';
}

const intentarSeleccionarTorneo = (torneo) => {
    if (torneo.id_equipo) {
        miEquipoId.value = torneo.id_equipo;
    }

    if (haAceptadoReglas(torneo.id_torneo)) {
        cargarDetallesTorneo(torneo);
    } else {
        torneoPendiente.value = torneo;
        reglasAceptadas.value = false;
        showReglamentoModal.value = true;
    }
}

const confirmarReglamento = () => {
    if (!reglasAceptadas.value) return;
    const key = `reglas_aceptadas_t${torneoPendiente.value.id_torneo}_e${miEquipoId.value}`;
    localStorage.setItem(key, 'true');
    showReglamentoModal.value = false;
    cargarDetallesTorneo(torneoPendiente.value);
    torneoPendiente.value = null;
}

const cancelarReglamento = () => {
    showReglamentoModal.value = false;
    torneoPendiente.value = null;
    reglasAceptadas.value = false;
}

const cargarDetallesTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    equiposRivales.value = []
    partidosTorneo.value = []
    miRoster.value = [] 
    
    cargandoRoster.value = true; 

    try {
        equiposRivales.value = await obtenerEquiposInscritosService(torneo.id_torneo)
        partidosTorneo.value = await obtenerPartidosPorTorneo(torneo.id_torneo)
        console.log("Intentando obtener roster privado...");
        let dataRoster = await obtenerMiRosterService(torneo.id_torneo, idUsuario)
        
        // Si el roster privado falla o viene vacío, pero sabemos nuestro ID de equipo, usamos el público (Scouting)
        if ((!dataRoster || dataRoster.length === 0) && miEquipoId.value) {
            console.warn("Roster privado no encontrado. Forzando carga a través de Roster Público...");
            dataRoster = await obtenerRosterPublicoService(torneo.id_torneo, miEquipoId.value);
        }

        miRoster.value = dataRoster || []

    } catch (error) {
        console.error("Error crítico cargando detalles del torneo:", error)
    } finally {
        cargandoRoster.value = false;
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
        console.error("Error obteniendo roster del rival:", error);
    } finally {
        cargandoScouting.value = false;
    }
}

const volverALista = () => {
    torneoSeleccionado.value = null
    equiposRivales.value = []
    partidosTorneo.value = []
    miRoster.value = []
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>