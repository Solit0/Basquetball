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

        <div v-if="showReglamentoModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
                        <button @click="cancelarReglamento" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                            Cancelar y Volver
                        </button>
                        <button @click="confirmarReglamento" :disabled="!reglasAceptadas"
                                :class="!reglasAceptadas ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'"
                                class="px-8 py-3 text-white font-black rounded-lg transition-all flex items-center">
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
                            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span class="font-medium">Inicio:</span> <span class="ml-1">{{ t.fecha_inicio.split('T')[0] }}</span>
                        </p>
                        <p class="flex items-center">
                            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                            <span class="font-medium">Categoría:</span> <span class="ml-1">{{ t.categoria }}</span>
                        </p>
                    </div>

                    <div class="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span :class="t.estado === 'En curso' ? 'bg-green-100 text-green-800' : 'bg-indigo-100 text-indigo-800'" class="px-2.5 py-1 text-xs font-black rounded uppercase">
                            {{ t.estado }}
                        </span>
                        <span class="text-indigo-600 text-sm font-bold group-hover:underline flex items-center">
                            <svg v-if="!haAceptadoReglas(t.id_torneo)" class="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
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
                            <svg class="w-5 h-5 mr-3 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase">Periodo de Competición</p>
                                <p class="text-sm font-medium text-gray-900">Del {{ torneoSeleccionado.fecha_inicio.split('T')[0] }} al {{ torneoSeleccionado.fecha_fin.split('T')[0] }}</p>
                            </div>
                        </div>
                        
                        <div class="flex items-start">
                            <svg class="w-5 h-5 mr-3 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            <div>
                                <p class="text-xs font-bold text-gray-500 uppercase">Sede(s) del Torneo</p>
                                <p class="text-sm font-medium text-gray-900">Sedes asignadas por partido</p>
                                <p class="text-xs text-gray-500 italic mt-1">Revisa el calendario de partidos para ver la cancha específica de cada encuentro.</p>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-4 bg-green-50 p-5 rounded-xl border border-green-200 relative">
                        <div class="absolute top-4 right-4 text-green-500" title="Reglamento Aceptado">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 class="font-black text-green-900 uppercase tracking-widest text-xs mb-4 border-b border-green-200 pb-2 pr-8">Reglamento y Observaciones</h4>
                        <div class="text-sm text-gray-700 whitespace-pre-line max-h-32 overflow-y-auto pr-2">
                            {{ torneoSeleccionado.reglamento || 'No hay un reglamento específico registrado para este torneo. Se aplicarán las normas FIBA vigentes.' }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <h4 class="text-lg font-black text-gray-800 uppercase flex items-center">
                        <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Equipos Participantes
                    </h4>
                    <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{{ equiposRivales.length }} Inscritos</span>
                </div>
                
                <div v-if="equiposRivales.length === 0" class="text-center py-8 text-gray-500 italic">
                    Cargando equipos participantes...
                </div>
                
                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div v-for="equipo in equiposRivales" :key="equipo.id_equipo" 
                         class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow relative"
                         :class="{'border-indigo-400 bg-indigo-50 shadow-sm': equipo.id_equipo === miEquipoId}">
                        
                        <span v-if="equipo.id_equipo === miEquipoId" class="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm uppercase">Mi Equipo</span>

                        <div class="w-12 h-12 mx-auto bg-white rounded-full border-2 border-gray-300 mb-3 flex items-center justify-center text-gray-400 font-bold"
                             :class="{'border-indigo-300 text-indigo-500': equipo.id_equipo === miEquipoId}">
                            {{ equipo.nombre_oficial.substring(0, 2).toUpperCase() }}
                        </div>
                        <p class="font-bold text-gray-800 text-sm truncate" :title="equipo.nombre_oficial">{{ equipo.nombre_oficial }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <h4 class="text-lg font-black text-gray-800 uppercase flex items-center">
                        <svg class="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Calendario de Encuentros
                    </h4>
                    <span class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">{{ partidosTorneo.length }} Programados</span>
                </div>

                <div v-if="partidosTorneo.length === 0" class="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                    <p class="text-gray-500 font-medium">Aún no se han generado las llaves ni los partidos para este torneo.</p>
                </div>

                <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <div v-for="partido in partidosTorneo" :key="partido.id_partido" 
                         class="border rounded-xl p-5 flex flex-col justify-between transition-all bg-white relative overflow-hidden"
                         :class="(partido.id_equipo_local === miEquipoId || partido.id_equipo_visitante === miEquipoId) ? 'border-indigo-400 shadow-md ring-1 ring-indigo-400' : 'border-gray-200'">
                        
                        <div v-if="partido.id_equipo_local === miEquipoId || partido.id_equipo_visitante === miEquipoId" 
                             class="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>

                        <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                            <span class="text-xs font-black uppercase tracking-wider"
                                  :class="(partido.id_equipo_local === miEquipoId || partido.id_equipo_visitante === miEquipoId) ? 'text-indigo-600' : 'text-gray-500'">
                                {{ partido.ronda_torneo }}
                            </span>
                            <span :class="{'bg-green-100 text-green-800': partido.estado === 'Finalizado', 'bg-blue-100 text-blue-800': partido.estado === 'En Juego', 'bg-gray-100 text-gray-600': partido.estado === 'Programado'}" 
                                  class="text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                {{ partido.estado }}
                            </span>
                        </div>

                        <div class="flex items-center justify-between mb-4">
                            <div class="w-2/5 text-right pr-2">
                                <p class="font-bold leading-tight text-lg truncate" 
                                   :class="partido.id_equipo_local === miEquipoId ? 'text-indigo-700' : 'text-gray-900'" :title="partido.local_nombre">
                                   {{ partido.local_nombre }}
                                </p>
                                <p class="text-[10px] font-black uppercase tracking-wider mt-1" :class="partido.id_equipo_local === miEquipoId ? 'text-indigo-400' : 'text-gray-400'">Local</p>
                            </div>
                            
                            <div class="w-1/5 text-center flex justify-center">
                                <div v-if="partido.estado === 'Finalizado'" class="font-black text-xl text-gray-800 bg-gray-200 px-3 py-1 rounded shadow-inner">
                                    {{ partido.marcador_local }} - {{ partido.marcador_visitante }}
                                </div>
                                <div v-else class="font-black text-gray-400 bg-gray-100 px-3 py-1 rounded text-sm border border-gray-200">VS</div>
                            </div>

                            <div class="w-2/5 text-left pl-2">
                                <p class="font-bold leading-tight text-lg truncate" 
                                   :class="partido.id_equipo_visitante === miEquipoId ? 'text-indigo-700' : 'text-gray-900'" :title="partido.visitante_nombre">
                                   {{ partido.visitante_nombre }}
                                </p>
                                <p class="text-[10px] font-black uppercase tracking-wider mt-1" :class="partido.id_equipo_visitante === miEquipoId ? 'text-indigo-400' : 'text-gray-400'">Visitante</p>
                            </div>
                        </div>
                        
                        <div class="text-center text-xs font-medium border-t border-gray-100 pt-3 flex justify-center items-center"
                             :class="(partido.id_equipo_local === miEquipoId || partido.id_equipo_visitante === miEquipoId) ? 'text-indigo-600 bg-indigo-50 -mx-5 -mb-5 p-3 rounded-b-xl' : 'text-gray-500'">
                            <svg class="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span v-if="partido.fecha">{{ partido.fecha.split('T')[0] }} a las {{ partido.hora }} | </span>
                            <span v-else>Fecha por definir | </span>
                            Sede: {{ partido.nombre_cancha || 'Por definir' }}
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
import { obtenerPartidosPorTorneo } from '../../services/partidosService' // <-- ASEGÚRATE DE TENER ESTO IMPORTADO

const idUsuario = localStorage.getItem('usuario_id') 

const miEquipoId = ref(null) 
const torneos = ref([])
const torneoSeleccionado = ref(null)
const equiposRivales = ref([])
const partidosTorneo = ref([])

// Variables para el Modal de Reglamento
const showReglamentoModal = ref(false)
const torneoPendiente = ref(null)
const reglasAceptadas = ref(false)

onMounted(async () => {
    try {
        if (!idUsuario) return;
        const data = await obtenerTorneosDeEquipoService(idUsuario)
        torneos.value = data
        
        if (data.length > 0) {
            miEquipoId.value = data[0].id_equipo
        }
    } catch (error) {
        console.error("Error cargando torneos del equipo:", error)
    }
})

// Función para verificar si ya se aceptó el reglamento previamente (lee el localStorage)
const haAceptadoReglas = (idTorneo) => {
    const key = `reglas_aceptadas_t${idTorneo}_e${miEquipoId.value}`;
    return localStorage.getItem(key) === 'true';
}

// Interceptamos el clic. Si no ha aceptado, mostramos el modal. Si ya aceptó, cargamos directo.
const intentarSeleccionarTorneo = (torneo) => {
    if (haAceptadoReglas(torneo.id_torneo)) {
        cargarDetallesTorneo(torneo);
    } else {
        torneoPendiente.value = torneo;
        reglasAceptadas.value = false;
        showReglamentoModal.value = true;
    }
}

// Botón ACEPTAR del Modal
const confirmarReglamento = () => {
    if (!reglasAceptadas.value) return;
    
    // Guardamos en localStorage para el futuro
    const key = `reglas_aceptadas_t${torneoPendiente.value.id_torneo}_e${miEquipoId.value}`;
    localStorage.setItem(key, 'true');
    
    // Cerramos modal y cargamos los datos
    showReglamentoModal.value = false;
    cargarDetallesTorneo(torneoPendiente.value);
    torneoPendiente.value = null;
}

// Botón CANCELAR del Modal
const cancelarReglamento = () => {
    showReglamentoModal.value = false;
    torneoPendiente.value = null;
    reglasAceptadas.value = false;
}

// Función real que carga los datos de la base de datos
const cargarDetallesTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    equiposRivales.value = []
    partidosTorneo.value = []
    
    try {
        equiposRivales.value = await obtenerEquiposInscritosService(torneo.id_torneo)
        partidosTorneo.value = await obtenerPartidosPorTorneo(torneo.id_torneo)
    } catch (error) {
        console.error("Error cargando detalles o partidos:", error)
    }
}

const volverALista = () => {
    torneoSeleccionado.value = null
    equiposRivales.value = []
    partidosTorneo.value = []
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>