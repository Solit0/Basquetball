<template>
    <div class="space-y-6 animate-fade-in relative h-full flex flex-col">
        
        <div class="flex items-center justify-between mb-6 border-b border-gray-200 pb-4 shrink-0">
            <div>
                <h2 class="text-3xl font-black text-gray-900">Historial de Partidos</h2>
                <p class="text-gray-600 mt-1">Revisa los resultados pasados, reportes oficiales y evalúa el arbitraje.</p>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 pb-10">
            <div v-if="partidos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-lg font-bold text-gray-700">No hay partidos registrados</p>
                <p class="text-sm mt-1">Tu equipo aún no tiene partidos finalizados en su historial.</p>
            </div>

            <div v-else class="space-y-8">
                <div v-for="p in partidos" :key="p.id_partido" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    <div class="bg-slate-900 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center text-white gap-4">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                Torneo: {{ p.nombre_torneo }}
                            </span>
                            
                            <div class="flex items-center text-sm font-bold text-gray-300">
                                <svg class="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                {{ p.fecha?.split('T')[0] }}
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-center md:justify-end gap-6 w-full md:w-auto">
                            <span class="text-xl font-black" :class="p.id_equipo_local === miEquipoId ? 'text-indigo-400' : ''">{{ p.local_nombre }}</span>
                            <div class="bg-indigo-600 px-4 py-1.5 rounded-lg text-2xl font-black shadow-inner tracking-widest border border-indigo-500">
                                {{ p.marcador_local }} - {{ p.marcador_visitante }}
                            </div>
                            <span class="text-xl font-black" :class="p.id_equipo_visitante === miEquipoId ? 'text-indigo-400' : ''">{{ p.visitante_nombre }}</span>
                        </div>
                    </div>

                    <div class="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50">
                        
                        <div class="space-y-6">
                            
                            <div class="space-y-3">
                                <h4 class="font-black text-gray-800 uppercase tracking-widest text-xs border-b border-gray-300 pb-2 flex items-center">
                                    <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Reporte Oficial del Partido
                                </h4>
                                <div class="bg-white p-5 rounded-xl border border-gray-200 text-sm text-gray-700 leading-relaxed shadow-sm">
                                    {{ p.informe_contenido || 'El administrador no adjuntó un informe descriptivo para este encuentro.' }}
                                </div>
                            </div>

                            <div class="space-y-3">
                                <h4 class="font-black text-red-800 uppercase tracking-widest text-xs border-b border-red-200 pb-2 flex items-center">
                                    <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                    Sanciones Disciplinarias
                                </h4>
                                
                                <div v-if="!p.sanciones_partido || p.sanciones_partido.length === 0" class="bg-white p-5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 italic text-center shadow-sm">
                                    No se registraron sanciones en este encuentro.
                                </div>
                                
                                <div v-else class="space-y-2">
                                    <div v-for="(san, index) in p.sanciones_partido" :key="index" 
                                         class="bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm relative overflow-hidden">
                                        <div class="absolute left-0 top-0 bottom-0 w-1" :class="san.id_equipo === miEquipoId ? 'bg-red-600' : 'bg-gray-400'"></div>
                                        <div class="pl-2">
                                            <div class="flex justify-between items-start mb-1">
                                                <p class="text-sm font-bold text-gray-900">
                                                    {{ san.nombre_jugador }} {{ san.apellido_jugador }}
                                                    <span v-if="san.id_equipo === miEquipoId" class="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded ml-2 uppercase">Tu Equipo</span>
                                                    <span v-else class="text-[9px] bg-gray-500 text-white px-1.5 py-0.5 rounded ml-2 uppercase">Rival</span>
                                                </p>
                                                <span class="text-[10px] font-black bg-white text-red-800 px-2 py-0.5 rounded border border-red-300 uppercase">{{ san.tipo_sancion }}</span>
                                            </div>
                                            <p class="text-xs text-gray-700 italic">"{{ san.motivo }}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h4 class="font-black text-indigo-900 uppercase tracking-widest text-xs border-b border-indigo-200 pb-2 flex items-center">
                                <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                Evaluación del Arbitraje
                            </h4>
                            
                            <div v-if="!p.id_evaluacion" class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center h-[calc(100%-2rem)] flex flex-col justify-center">
                                <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-500 shadow-sm">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                                </div>
                                <p class="text-sm font-medium text-indigo-900 mb-4">Ayúdanos a mejorar la liga evaluando el desempeño del cuerpo arbitral en este encuentro.</p>
                                <button @click="abrirModalEvaluacion(p)" class="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition mt-auto">
                                    Evaluar al Árbitro
                                </button>
                            </div>

                            <div v-else class="space-y-4">
                                <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                                    <div class="absolute -top-3 -right-3 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black shadow-md border-2 border-white" title="Tu Puntuación">
                                        {{ p.puntuacion }}
                                    </div>
                                    <p class="text-[10px] font-black text-gray-400 uppercase mb-2">Tu Evaluación</p>
                                    <p class="text-sm text-gray-700 italic">"{{ p.comentarios }}"</p>
                                </div>

                                <div v-if="p.respuesta_arbitro" class="bg-amber-50 p-5 rounded-xl border border-amber-200 ml-4 relative">
                                    <div class="absolute top-4 -left-3 w-6 h-6 bg-amber-500 rounded-full border-4 border-gray-50 flex items-center justify-center">
                                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                    </div>
                                    <p class="text-[10px] font-black text-amber-700 uppercase mb-2">Respuesta del Árbitro</p>
                                    <p class="text-sm text-amber-900">"{{ p.respuesta_arbitro }}"</p>
                                </div>
                                <div v-else class="text-xs text-gray-400 text-right pr-2">
                                    Esperando respuesta del árbitro...
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalEvaluarArbitro 
            v-if="mostrarModalEvaluacion" 
            :partido="partidoAevaluar" 
            @close="mostrarModalEvaluacion = false"
            @save="guardarEvaluacion"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ModalEvaluarArbitro from '../modals/ModalEvaluarArbitro.vue'
import { obtenerHistorialEquipoService, guardarEvaluacionService } from '../../services/partidosService'
import { obtenerEquipoDeEntrenadorService } from '../../services/equiposService'

const idEntrenador = localStorage.getItem('usuario_id')
const miEquipoId = ref(null) 
const partidos = ref([])
const mostrarModalEvaluacion = ref(false)
const partidoAevaluar = ref(null)

onMounted(async () => {
    await cargarMiEquipo()
    await cargarHistorial()
})

const cargarMiEquipo = async () => {
    try {
        const equipo = await obtenerEquipoDeEntrenadorService(idEntrenador)
        if (equipo) {
            miEquipoId.value = equipo.id_equipo
        }
    } catch (error) {
        console.error('Error al cargar datos del equipo:', error)
    }
}

const abrirModalEvaluacion = (partido) => {
    partidoAevaluar.value = partido
    mostrarModalEvaluacion.value = true
}

const cargarHistorial = async () => {
    try {
        const data = await obtenerHistorialEquipoService(idEntrenador)
        partidos.value = data
    } catch (error) {
        console.error('Error al cargar el historial de partidos:', error)
    }
}

const guardarEvaluacion = async (evaluacion) => {
    try {
        evaluacion.id_evaluador = idEntrenador;
        
        await guardarEvaluacionService(evaluacion)
        mostrarModalEvaluacion.value = false
        await cargarHistorial() 
        alert('Evaluación registrada exitosamente')
    } catch (error) {
        console.error('Error al guardar la evaluación:', error)
        alert('Ocurrió un error al intentar enviar la evaluación')
    }
}
</script>