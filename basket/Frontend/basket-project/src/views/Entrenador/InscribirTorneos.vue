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
                     class="bg-white rounded-2xl border border-gray-200 shadow-sm transition-all flex flex-col overflow-hidden group"
                     :class="{
                         'ring-2 ring-amber-400 border-transparent': estadoMiInscripcion(torneo.id_torneo) === 'Pendiente',
                         'ring-2 ring-green-500 border-transparent': estadoMiInscripcion(torneo.id_torneo) === 'Aprobada',
                         'opacity-75': estadoMiInscripcion(torneo.id_torneo) === 'Rechazada',
                         'hover:shadow-xl hover:border-indigo-400': !estadoMiInscripcion(torneo.id_torneo)
                     }">
                    
                    <div class="h-2 w-full transition-colors"
                         :class="{
                             'bg-amber-400': estadoMiInscripcion(torneo.id_torneo) === 'Pendiente',
                             'bg-green-500': estadoMiInscripcion(torneo.id_torneo) === 'Aprobada',
                             'bg-red-400': estadoMiInscripcion(torneo.id_torneo) === 'Rechazada',
                             'bg-gradient-to-r from-indigo-500 to-purple-600': !estadoMiInscripcion(torneo.id_torneo)
                         }">
                    </div>
                    
                    <div class="p-6 flex-1 flex flex-col relative">
                        <div v-if="estadoMiInscripcion(torneo.id_torneo)" class="absolute top-4 right-4 z-10">
                            <span v-if="estadoMiInscripcion(torneo.id_torneo) === 'Pendiente'" class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded shadow-sm border border-amber-200 uppercase flex items-center">
                                En Revisión
                            </span>
                            <span v-if="estadoMiInscripcion(torneo.id_torneo) === 'Aprobada'" class="bg-green-100 text-green-800 text-[10px] font-black px-2 py-1 rounded shadow-sm border border-green-300 uppercase flex items-center">
                                Inscrito Oficialmente
                            </span>
                            <span v-if="estadoMiInscripcion(torneo.id_torneo) === 'Rechazada'" class="bg-red-100 text-red-800 text-[10px] font-black px-2 py-1 rounded shadow-sm border border-red-200 uppercase flex items-center">
                                Solicitud Rechazada
                            </span>
                        </div>

                        <div class="flex justify-between items-start mb-4">
                            <span class="bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Inscripciones Abiertas</span>
                        </div>
                        
                        <h3 class="text-2xl font-black text-gray-900 mb-2 mt-2 group-hover:text-indigo-700 transition-colors pr-8">{{ torneo.nombre_torneo }}</h3>
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
                                <span class="text-gray-500 font-bold">Cupos Llenos:</span>
                                <span class="font-black text-gray-800">{{ torneo.equipos_inscritos }} / {{ torneo.numero_equipos }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button @click="verDetalles(torneo)" 
                            class="w-full py-4 font-black uppercase tracking-widest text-xs transition-colors"
                            :class="{
                                'bg-amber-100 text-amber-800 hover:bg-amber-200': estadoMiInscripcion(torneo.id_torneo) === 'Pendiente',
                                'bg-green-100 text-green-800 hover:bg-green-200': estadoMiInscripcion(torneo.id_torneo) === 'Aprobada',
                                'bg-red-100 text-red-800 hover:bg-red-200': estadoMiInscripcion(torneo.id_torneo) === 'Rechazada',
                                'bg-gray-900 text-white hover:bg-indigo-600': !estadoMiInscripcion(torneo.id_torneo)
                            }">
                        Ver Detalles
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            
            <div class="space-y-6">
                <div class="bg-white rounded-2xl shadow-sm border p-6 overflow-hidden relative"
                     :class="estadoMiInscripcion(torneoSeleccionado.id_torneo) === 'Aprobada' ? 'border-green-200' : 'border-indigo-100'">
                    
                    <div class="absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-10"
                         :class="estadoMiInscripcion(torneoSeleccionado.id_torneo) === 'Aprobada' ? 'bg-green-50' : 'bg-indigo-50'"></div>
                    
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
                            <strong>Inicio:</strong> &nbsp; {{ torneoSeleccionado.fecha_inicio.split('T')[0] }}
                        </div>
                    </div>
                </div>

                <div v-if="estadoMiInscripcion(torneoSeleccionado.id_torneo) === 'Pendiente'" class="bg-amber-50 rounded-2xl shadow-sm border border-amber-200 p-6 text-center">
                    <svg class="w-12 h-12 mx-auto text-amber-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h4 class="font-black uppercase tracking-widest text-amber-800 mb-2">Solicitud en Revisión</h4>
                    <p class="text-xs text-amber-700 mb-4">El administrador está revisando los documentos y la plantilla.</p>
                </div>

                <div v-else-if="estadoMiInscripcion(torneoSeleccionado.id_torneo) === 'Aprobada'" class="bg-green-50 rounded-2xl shadow-sm border border-green-300 p-6 text-center relative overflow-hidden">
                    <h4 class="font-black uppercase tracking-widest text-green-800 mb-2 relative z-10 text-lg">¡Felicidades!</h4>
                    <p class="text-sm text-green-700 font-medium relative z-10 mb-4">Tu equipo es oficialmente parte de esta competición.</p>
                </div>

                <div v-else-if="estadoMiInscripcion(torneoSeleccionado.id_torneo) === 'Rechazada'" class="bg-red-50 rounded-2xl shadow-sm border border-red-200 p-6 text-center">
                    <h4 class="font-black uppercase tracking-widest text-red-800 mb-2">Solicitud Rechazada</h4>
                    <p class="text-xs text-red-700">El administrador no ha aprobado tu participación en este torneo.</p>
                </div>

                <div v-else class="bg-indigo-900 rounded-2xl shadow-lg p-6 text-white text-center">
                    <h4 class="font-black uppercase tracking-widest text-sm mb-2 text-indigo-300">Armar Alineación</h4>
                    <p class="text-xs text-indigo-100 mb-6 px-4">Debes seleccionar a tus 5 titulares, capitán y asignar números de camiseta.</p>
                    <button @click="abrirRosterModal" 
                            class="w-full py-4 bg-green-500 hover:bg-green-400 text-green-900 font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        Crear Roster e Inscribir
                    </button>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
                    <h3 class="text-xl font-black text-gray-900 mb-6 flex items-center border-b pb-4">
                        Reglamento Oficial
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

            <div class="lg:col-span-2 space-y-6">
                <div v-if="rosterActual.length > 0" class="bg-white rounded-2xl shadow-sm border border-indigo-200 p-6 overflow-hidden">
                    
                    <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <h3 class="text-xl font-black text-gray-900 flex items-center">
                            <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Roster Oficial
                        </h3>
                        
                        <button v-if="torneoSeleccionado.estado === 'En inscripción'" @click="abrirRosterModal" 
                                class="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-lg hover:bg-indigo-100 transition-colors shadow-sm border border-indigo-200">
                            Editar Roster
                        </button>
                        <span v-else class="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">BLOQUEADO</span>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-for="jugador in rosterActual" :key="jugador.id_jugador" 
                             class="flex items-center p-3 rounded-xl border transition-all"
                             :class="jugador.esta_suspendido ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-gray-50 border-gray-100'">
                            
                            <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg mr-3 shadow-sm border"
                                 :class="jugador.esta_suspendido ? 'bg-red-100 text-red-800 border-red-200' : 'bg-white text-indigo-800 border-gray-200'">
                                <svg v-if="jugador.esta_suspendido" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                <span v-else>{{ jugador.numero_camiseta }}</span>
                            </div>
                            
                            <div class="flex-1">
                                <p class="font-bold flex items-center text-sm" :class="jugador.esta_suspendido ? 'text-red-900 line-through' : 'text-gray-900'">
                                    <template v-if="!jugador.esta_suspendido">
                                        <span v-if="jugador.rol_roster === 'Titular'" class="w-2 h-2 rounded-full bg-green-500 mr-2" title="Titular"></span>
                                        <span v-else class="w-2 h-2 rounded-full bg-gray-300 mr-2" title="Suplente"></span>
                                    </template>
                                    {{ jugador.nombre }} {{ jugador.apellido }}
                                </p>
                                
                                <p class="text-xs font-medium mt-0.5" :class="jugador.esta_suspendido ? 'text-red-700 font-black' : 'text-gray-500'">
                                    <template v-if="jugador.esta_suspendido">
                                        INHABILITADO POR LA LIGA
                                    </template>
                                    <template v-else>
                                        {{ jugador.posicion }} | {{ jugador.rol_roster }} 
                                        <span v-if="jugador.es_capitan" class="ml-1 text-yellow-600 font-black tracking-wide">(© CAPITÁN)</span>
                                    </template>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ModalArmarRoster 
            v-if="showRosterModal"
            :show="showRosterModal" 
            :torneo="torneoSeleccionado" 
            :rosterPrevio="rosterActual"
            :saving="procesando"
            @close="cerrarRosterModal" 
            @save="enviarSolicitudConRoster" 
        />
    </div>
</template>

<script setup>
// El script setup se mantiene EXACTAMENTE IGUAL.
import { ref, onMounted } from 'vue'
import { obtenerTorneosActivosService } from '../../services/torneosService'
import { 
    solicitarInscripcionService, 
    obtenerMisSolicitudesService,
    editarRosterService,
    obtenerMiRosterService 
} from '../../services/inscripcionesService'
import ModalArmarRoster from '../modals/ModalArmarRoster.vue';

const torneosAbiertos = ref([])
const misSolicitudes = ref([]) 
const torneoSeleccionado = ref(null)
const cargando = ref(true)
const procesando = ref(false)

const rosterActual = ref([]);

const showRosterModal = ref(false)

const idEntrenador = localStorage.getItem('usuario_id')

const cargarMisSolicitudes = async () => {
    try {
        const data = await obtenerMisSolicitudesService(idEntrenador);
        misSolicitudes.value = data || []; 
    } catch (error) {
        console.error("Error al cargar las solicitudes previas:", error);
    }
}
const estadoMiInscripcion = (id_torneo) => {
    const solicitud = misSolicitudes.value.find(s => s.id_torneo === id_torneo);
    return solicitud ? solicitud.estado : null; 
}

const cargarTorneos = async () => {
    cargando.value = true;
    try {
        const todosLosTorneos = await obtenerTorneosActivosService();
        torneosAbiertos.value = todosLosTorneos.filter(t => t.estado === 'En inscripción');
        await cargarMisSolicitudes();
    } catch (error) {
        console.error("Error al cargar los torneos:", error);
    } finally {
        cargando.value = false;
    }
}

const verDetalles = async (torneo) => {
    torneoSeleccionado.value = torneo;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const estado = estadoMiInscripcion(torneo.id_torneo);
    if (estado === 'Pendiente' || estado === 'Aprobada') {
        try {
            const dataRoster = await obtenerMiRosterService(torneo.id_torneo, idEntrenador);
            rosterActual.value = dataRoster || [];
        } catch (error) {
            console.error("Error al cargar el roster de este torneo:", error);
        }
    } else {
        rosterActual.value = [];
    }
}

const volverAlCatalogo = () => {
    torneoSeleccionado.value = null;
    rosterActual.value = [];
}

const abrirRosterModal = () => {
    showRosterModal.value = true;
}

const cerrarRosterModal = () => {
    showRosterModal.value = false;
}

const enviarSolicitudConRoster = async (rosterArmado) => {
    if (procesando.value) return;
    procesando.value = true;

    const estadoActual = estadoMiInscripcion(torneoSeleccionado.value.id_torneo);

    try {
        if (estadoActual === 'Pendiente' || estadoActual === 'Aprobada') {
            await editarRosterService(torneoSeleccionado.value.id_torneo, idEntrenador, rosterArmado);
            alert(' ROSTER ACTUALIZADO CORRECTAMENTE.\n\nLos cambios tácticos se han guardado con éxito.');
        } else {
            await solicitarInscripcionService(torneoSeleccionado.value.id_torneo, idEntrenador, rosterArmado);
            alert(' ¡SOLICITUD Y ROSTER GUARDADOS EXITOSAMENTE!\n\nTu equipo ha pasado todas las validaciones del sistema.');
        }
        
        showRosterModal.value = false;
        await cargarMisSolicitudes();
        const dataRoster = await obtenerMiRosterService(torneoSeleccionado.value.id_torneo, idEntrenador);
        rosterActual.value = dataRoster || [];
        
    } catch (error) {
        alert(error.response?.data?.error || 'Ocurrió un error inesperado al procesar el roster.');
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
</style>