<template>
    <div class="h-full flex flex-col space-y-6">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 shrink-0">
            <div>
                <h2 class="text-3xl font-black text-gray-900">Desempeño y Retroalimentación</h2>
                <p class="text-gray-600 mt-1">Revisa las evaluaciones de los entrenadores y contesta a sus comentarios.</p>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pb-10 pr-2">
            <div v-if="evaluaciones.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                <p class="text-lg font-bold text-gray-700">Aún no tienes evaluaciones</p>
                <p class="text-sm mt-1">Los entrenadores no han calificado tu arbitraje en ningún partido reciente.</p>
            </div>

            <div v-else class="space-y-6">
                <div v-for="ev in evaluaciones" :key="ev.id_evaluacion" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                        <div class="flex flex-col">
                            <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1 flex items-center">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                                Torneo: {{ ev.nombre_torneo }}
                            </span>
                        </div>
                        <div class="flex items-center text-sm font-bold text-gray-300">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {{ formatFecha(ev.fecha) }}
                        </div>
                        <div class="text-sm font-black tracking-widest uppercase">
                            {{ ev.local_nombre }} <span class="text-amber-500 mx-2">VS</span> {{ ev.visitante_nombre }}
                        </div>
                    </div>

                    <div class="p-6 md:p-8 flex flex-col lg:flex-row gap-8 bg-gray-50">
                        
                        <div class="flex-1 space-y-4">
                            <div class="flex items-start justify-between">
                                <div>
                                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Evaluado por (Entrenador)</p>
                                    <h4 class="text-lg font-bold text-gray-900">{{ ev.evaluador_nombre }} {{ ev.evaluador_apellido }}</h4>
                                </div>
                                <div class="bg-indigo-600 text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-md border-2 border-indigo-200">
                                    <span class="text-2xl font-black">{{ ev.puntuacion }}</span>
                                </div>
                            </div>
                            
                            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                                <svg class="w-6 h-6 text-gray-200 absolute top-3 right-3" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path></svg>
                                <p class="text-sm text-gray-700 italic relative z-10 leading-relaxed">"{{ ev.comentarios }}"</p>
                            </div>
                        </div>

                        <div class="flex-1 bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-inner">
                            <h4 class="text-sm font-black text-amber-900 uppercase tracking-widest border-b border-amber-200 pb-2 mb-4 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                                Tu Respuesta Oficial
                            </h4>

                            <div v-if="ev.respuesta_arbitro" class="text-sm text-amber-900 whitespace-pre-line leading-relaxed">
                                {{ ev.respuesta_arbitro }}
                                <p class="text-[10px] text-amber-600 font-bold uppercase mt-4 text-right">
                                    Enviado el: {{ formatFecha(ev.fecha_respuesta) }}
                                </p>
                            </div>

                            <div v-else class="space-y-3">
                                <p class="text-xs text-amber-700 mb-2 font-medium">Puedes redactar una única respuesta formal a esta evaluación. Sé profesional.</p>
                                <textarea v-model="respuestasTemporales[ev.id_evaluacion]" rows="3" placeholder="Escribe tu descargo o agradecimiento aquí..."
                                    class="w-full px-4 py-3 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white resize-none"></textarea>
                                
                                <div class="text-right">
                                    <button @click="enviarRespuesta(ev.id_evaluacion)" 
                                            :disabled="!respuestasTemporales[ev.id_evaluacion] || procesando === ev.id_evaluacion"
                                            class="px-5 py-2 bg-amber-600 text-white font-bold text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 shadow-sm">
                                        {{ procesando === ev.id_evaluacion ? 'Enviando...' : 'Enviar Respuesta' }}
                                    </button>
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
import { ref, onMounted } from 'vue'
import { obtenerEvaluacionesService, responderEvaluacionService } from '../../services/arbitrosService.js'

const idArbitroActual = JSON.parse(localStorage.getItem('usuario') || '{}').id_usuario
const evaluaciones = ref([])
const respuestasTemporales = ref({}) 
const procesando = ref(null)

onMounted(() => {
    cargarEvaluaciones()
})

const cargarEvaluaciones = async () => {
    try {
        evaluaciones.value = await obtenerEvaluacionesService(idArbitroActual)
    } catch (error) {
        console.error("Error cargando evaluaciones:", error)
    }
}

const enviarRespuesta = async (idEvaluacion) => {
    const textoRespuesta = respuestasTemporales.value[idEvaluacion]
    if (!textoRespuesta || textoRespuesta.trim() === '') return;

    procesando.value = idEvaluacion;
    try {
        await responderEvaluacionService(idEvaluacion, textoRespuesta);
        alert("Respuesta enviada correctamente. El entrenador podrá verla en su historial.");
        await cargarEvaluaciones(); 
    } catch (error) {
        alert("Ocurrió un error al enviar tu respuesta.");
        console.error(error);
    } finally {
        procesando.value = null;
    }
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() + offset)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>