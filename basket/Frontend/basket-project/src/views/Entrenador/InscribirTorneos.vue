<!--Ruta del archivo: Frontend/basket-project/src/views/Entrenador/InscribirTorneos.vue-->
<template>
    <div class="space-y-6 animate-fade-in">
        
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <div>
                <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                    <button v-if="torneoSeleccionado" @click="volverAlCatalogo" class="mr-3 text-indigo-600 hover:text-indigo-800 transition-colors">
                        &larr;
                    </button>
                    {{ torneoSeleccionado ? 'Ficha Técnica del Torneo' : 'Explorar Torneos' }}
                </h2>
                <p class="text-gray-600 mt-1">
                    {{ torneoSeleccionado ? 'Revisa las bases de la competición antes de enviar tu solicitud.' : 'Encuentra la competición ideal para tu equipo y solicita un cupo.' }}
                </p>
            </div>
        </div>

        <div v-if="!torneoSeleccionado">
            
            <div v-if="cargando" class="text-center py-12 text-indigo-500 font-bold flex flex-col items-center">
                <svg class="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Buscando competiciones abiertas...
            </div>

            <div v-else-if="torneosAbiertos.length === 0" class="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center shadow-sm">
                <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <h3 class="text-xl font-black text-gray-700 mb-2">No hay torneos en fase de inscripción</h3>
                <p class="text-gray-500">Actualmente la liga no tiene competiciones recibiendo solicitudes. Vuelve más tarde.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="torneo in torneosAbiertos" :key="torneo.id_torneo" 
                     class="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col overflow-hidden group">
                    
                    <div class="h-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-green-100 text-green-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Inscripciones Abiertas</span>
                            <span class="text-xs font-black text-gray-400">{{ torneo.numero_equipos }} Cupos</span>
                        </div>
                        
                        <h3 class="text-2xl font-black text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">{{ torneo.nombre_torneo }}</h3>
                        <p class="text-sm text-gray-500 line-clamp-2 mb-4">{{ torneo.descripcion || 'Sin descripción general.' }}</p>
                        
                        <div class="space-y-2 mt-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500 font-bold">Categoría:</span>
                                <span class="font-black text-indigo-700">{{ torneo.categoria }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500 font-bold">Género:</span>
                                <span class="font-black text-gray-800">{{ torneo.clasificacion_genero || 'No especificado' }}</span>
                            </div>
                            <div class="flex justify-between text-sm pt-2 border-t border-gray-200">
                                <span class="text-gray-500 font-bold">Salto Inicial:</span>
                                <span class="font-black text-gray-800">{{ torneo.fecha_inicio ? torneo.fecha_inicio.split('T')[0] : 'Por definir' }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button @click="verDetalles(torneo)" class="w-full py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-colors">
                        Ver Detalles y Participar
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 overflow-hidden relative">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10"></div>
                    
                    <h3 class="text-2xl font-black text-indigo-900 mb-2 relative z-10">{{ torneoSeleccionado.nombre_torneo }}</h3>
                    <p class="text-sm text-gray-600 mb-6 relative z-10">{{ torneoSeleccionado.descripcion }}</p>
                    
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</span>
                            <span class="font-black text-indigo-600 text-lg">{{ torneoSeleccionado.categoria }}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Clasificación</span>
                            <span class="font-black text-gray-800 text-lg">{{ torneoSeleccionado.clasificacion_genero }}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Equipos Aprobados</span>
                            <span class="font-black text-gray-800 text-lg">{{ torneoSeleccionado.equipos_inscritos }} / {{ torneoSeleccionado.numero_equipos }}</span>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gray-100 space-y-3">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <strong>Inicio:</strong> &nbsp; {{ torneoSeleccionado.fecha_inicio.split('T')[0] }}
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <strong>Fin aprox:</strong> &nbsp; {{ torneoSeleccionado.fecha_fin.split('T')[0] }}
                        </div>
                    </div>
                </div>

                <div class="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white text-center">
                    <h4 class="font-black uppercase tracking-widest text-sm mb-2 text-indigo-300">¿Cumples los requisitos?</h4>
                    <p class="text-xs text-indigo-100 mb-6 px-4">El sistema auditará las edades y la plantilla de tu equipo antes de enviar la solicitud.</p>
                    
                    <button @click="solicitarCupo" :disabled="procesando"
                            class="w-full py-4 bg-green-500 hover:bg-green-400 text-green-900 font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center">
                        <svg v-if="procesando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {{ procesando ? 'Auditando Equipo...' : 'Solicitar Inscripción' }}
                    </button>
                </div>
            </div>

            <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                <h3 class="text-xl font-black text-gray-900 mb-6 flex items-center border-b pb-4">
                    <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Reglamento Oficial del Torneo
                </h3>
                
                <div class="prose prose-sm md:prose-base max-w-none text-gray-600">
                    <div v-if="!torneoSeleccionado.reglamento" class="text-center italic py-8 text-gray-400">
                        El administrador no especificó normativas detalladas para este torneo.
                    </div>
                    <div v-else class="whitespace-pre-line leading-relaxed">
                        {{ torneoSeleccionado.reglamento }}
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { obtenerTorneosActivosService } from '../../services/torneosService'
import { solicitarInscripcionService } from '../../services/inscripcionesService'
const torneosAbiertos = ref([])
const torneoSeleccionado = ref(null)
const cargando = ref(true)
const procesando = ref(false)

const idEntrenador = localStorage.getItem('usuario_id')

const cargarTorneos = async () => {
    cargando.value = true;
    try {
        const todosLosTorneos = await obtenerTorneosActivosService();
        
        torneosAbiertos.value = todosLosTorneos.filter(t => t.estado === 'En inscripción');
    } catch (error) {
        console.error("Error al cargar los torneos:", error);
    } finally {
        cargando.value = false;
    }
}

const verDetalles = (torneo) => {
    torneoSeleccionado.value = torneo;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const volverAlCatalogo = () => {
    torneoSeleccionado.value = null;
}

const solicitarCupo = async () => {
    if (!confirm(`¿Estás seguro de enviar la solicitud de inscripción para tu equipo al torneo "${torneoSeleccionado.value.nombre_torneo}"?\n\nAl confirmar, el sistema verificará automáticamente las edades de tus jugadores titulares y las fechas de la competición.`)) {
        return;
    }

    procesando.value = true;
    try {
        await solicitarInscripcionService(torneoSeleccionado.value.id_torneo, idEntrenador);
        
        alert(' ¡SOLICITUD ENVIADA EXITOSAMENTE!\n\nTu equipo ha pasado todas las validaciones del sistema. Ahora debes esperar a que el administrador apruebe tu solicitud.');
        
        volverAlCatalogo();
    } catch (error) {
        // Mostramos la alerta exacta (Error de Edad, Falta de Jugadores, Género, etc.) generada por tu robusto backend
        alert(error.response?.data?.error || 'Ocurrió un error inesperado al procesar la solicitud.');
    } finally {
        procesando.value = false;
    }
}

onMounted(() => {
    cargarTorneos();
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>s