<template>
    <div class="space-y-6">
        
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                    <button v-if="torneoSeleccionado" @click="volverListado" class="mr-3 text-indigo-600 hover:text-indigo-800 transition-colors">
                        &larr;
                    </button>
                    Edición de Torneos
                </h2>
                <p class="text-gray-600 mt-1">
                    {{ torneoSeleccionado ? 'Modifica las bases o gestiona las inscripciones.' : 'Selecciona un torneo para editarlo o eliminarlo.' }}
                </p>
            </div>
        </div>

        <div v-if="!torneoSeleccionado" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            <div v-if="torneos.length === 0" class="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                No hay torneos registrados en el sistema.
            </div>
            
            <div v-for="t in torneos" :key="t.id_torneo" 
                 @click="seleccionarTorneo(t)"
                 class="rounded-xl shadow-sm border p-6 transition-all bg-white border-gray-200 hover:border-amber-500 hover:shadow-md cursor-pointer transform hover:-translate-y-1">
                
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold leading-tight text-gray-900">
                        {{ t.nombre_torneo }}
                    </h3>
                    <span :class="t.estado === 'En inscripción' ? 'bg-blue-100 text-blue-800' : 'bg-gray-600 text-white'" class="px-2 py-1 text-[10px] font-bold rounded uppercase">
                        {{ t.estado === 'En curso' ? 'Partidos Programados' : t.estado }}
                    </span>
                </div>
                
                <p class="text-sm font-medium text-gray-700">
                    Equipos Aprobados: 
                    <span class="font-bold text-indigo-600">
                        {{ t.equipos_inscritos }} / {{ t.numero_equipos }}
                    </span>
                </p>
                
                <button class="w-full mt-4 py-2 bg-amber-50 text-amber-700 font-bold rounded hover:bg-amber-100 transition-colors flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Gestionar Detalles
                </button>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 class="text-xl font-bold text-gray-900">Actualizar Bases</h3>
                    
                    <span v-if="torneoSeleccionado.estado !== 'En inscripción'" class="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-black uppercase flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Bloqueado ({{ torneoSeleccionado.estado }})
                    </span>
                </div>

                <form @submit.prevent="handleActualizarTorneo" class="space-y-4">
                    <div>
                        <label class="block text-xs font-black text-gray-500 uppercase">Nombre del Torneo</label>
                        <input type="text" v-model="form.nombre_torneo" required :disabled="torneoSeleccionado.estado !== 'En inscripción'"
                            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-black text-gray-500 uppercase">Categoría</label>
                            <select v-model="form.categoria" required :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed">
                                <option value="Sub-12">Sub-12</option>
                                <option value="Sub-15">Sub-15</option>
                                <option value="Sub-18">Sub-18</option>
                                <option value="U-23">U-23</option>
                                <option value="Libre">Libre</option>
                                <option value="Veteranos">Veteranos</option>
                                <option value="Maxi-Baloncesto">Maxi-Baloncesto</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-black text-gray-500 uppercase">Género</label>
                            <select v-model="form.id_clasificacion" required :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed">
                                <option value="Varonil">Varonil</option>
                                <option value="Femenil">Femenil</option>
                                <option value="Mixto">Mixto</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-black text-gray-500 uppercase">Cupos Exactos</label>
                            <select v-model="form.numero_equipos" required :disabled="torneoSeleccionado.estado !== 'En inscripción'"
                                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 font-bold text-amber-600 outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed">
                                <option :value="4">4 Equipos</option>
                                <option :value="8">8 Equipos</option>
                                <option :value="16">16 Equipos</option>
                                <option :value="32">32 Equipos</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-black text-gray-500 uppercase">Fecha Inicio</label>
                            <input type="date" v-model="form.fecha_inicio" required :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed">
                        </div>
                        <div>
                            <label class="block text-xs font-black text-gray-500 uppercase">Fecha Fin</label>
                            <input type="date" v-model="form.fecha_fin" required :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-black text-gray-500 uppercase">Descripción</label>
                        <textarea v-model="form.descripcion" rows="2" :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed"></textarea>
                    </div>

                    <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
                        <h4 class="text-sm font-black text-indigo-900 border-b border-indigo-200 pb-2">Estructura del Reglamento Oficial</h4>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">Reglamento General</label>
                            <textarea v-model="formReglamentos.general" rows="3" :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="w-full px-4 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500 outline-none text-sm"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">Sanciones Disciplinarias</label>
                            <textarea v-model="formReglamentos.sanciones" rows="2" :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="w-full px-4 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500 outline-none text-sm"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1">Normativas Específicas</label>
                            <textarea v-model="formReglamentos.normativas" rows="2" :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="w-full px-4 py-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed focus:ring-2 focus:ring-amber-500 outline-none text-sm"></textarea>
                        </div>
                    </div>

                    <div class="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                        <button type="button" @click="handleEliminarTorneo" :disabled="procesando"
                                class="px-4 py-2 rounded-md font-bold transition flex items-center text-sm text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50"
                                title="Archivar o Eliminar Torneo">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            Eliminar Torneo
                        </button>
                                                                        
                        <button type="submit" v-if="torneoSeleccionado.estado === 'En inscripción'" :disabled="procesando" class="px-6 py-2.5 bg-amber-600 text-white rounded-md font-bold hover:bg-amber-700 transition shadow-md flex items-center">
                            <svg v-if="procesando" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>

            <div class="bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 p-6 h-fit max-h-212.5 overflow-y-auto">
                <div class="flex justify-between items-center mb-6 border-b border-indigo-100 pb-4">
                    <div>
                        <h3 class="text-xl font-bold text-indigo-900">Solicitudes de Inscripción</h3>
                        <p class="text-sm text-indigo-700 font-medium mt-1">Estado: {{ torneoSeleccionado.estado }}</p>
                    </div>
                    <div class="bg-white px-4 py-2 rounded-lg border border-indigo-200 text-center shadow-sm">
                        <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Aprobados</p>
                        <p class="text-3xl font-black" :class="equiposAprobados.length == form.numero_equipos ? 'text-green-600' : 'text-indigo-700'">
                            {{ equiposAprobados.length }} / {{ form.numero_equipos }}
                        </p>
                    </div>
                </div>

                <div v-if="torneoSeleccionado.estado === 'En curso'" class="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
                    <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h4 class="text-xl font-black text-gray-800 mb-2">¡El torneo está en marcha!</h4>
                    <p class="text-sm text-gray-500 font-medium">Las inscripciones están cerradas. Puedes administrar el calendario desde la "Gestión de Partidos".</p>
                </div>

                <div v-else-if="equiposAprobados.length >= form.numero_equipos" class="p-6 bg-green-100 rounded-xl border border-green-300 text-center shadow-inner">
                    <h4 class="text-lg font-black text-green-800 mb-1">¡Cupo lleno!</h4>
                    <p class="text-sm text-green-700">El torneo cuenta con todos los equipos requeridos. Vuelve a la 'Gestión de Torneos' para iniciarlo.</p>
                </div>

                <div v-else>
                    <h4 class="text-xs font-black text-amber-600 uppercase mb-3 tracking-wider flex items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Solicitudes Pendientes ({{ solicitudesPendientes.length }})
                    </h4>
                    
                    <div v-if="solicitudesPendientes.length === 0" class="bg-white/60 border border-amber-100 p-6 rounded-lg text-center text-sm text-amber-600 italic mb-6">
                        No hay solicitudes de inscripción pendientes por revisar.
                    </div>
                    
                    <ul class="space-y-3 mb-6">
                        <li v-for="sol in solicitudesPendientes" :key="'pend_'+sol.id_equipo" 
                            class="bg-white p-4 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-sm border border-amber-200 hover:border-amber-400 transition-colors gap-4">
                            <div>
                                <p class="font-bold text-gray-900 leading-tight">{{ sol.nombre_oficial }} <span class="text-xs text-gray-500 font-normal">({{ sol.siglas }})</span></p>
                                <div class="flex items-center mt-1">
                                    <p class="text-[10px] text-gray-500 font-bold uppercase flex items-center mr-3">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {{ sol.nombre_cancha || 'Sin Sede Oficial' }}
                                    </p>
                                    <span class="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest border" 
                                          :class="sol.total_jugadores >= 5 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'">
                                        {{ sol.total_jugadores || 0 }} Jugadores
                                    </span>
                                </div>
                            </div>
                            <div class="flex space-x-2 w-full md:w-auto">
                                <button @click="handleResponderSolicitud(sol, 'Aprobada')" :disabled="procesando"
                                    class="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-md shadow hover:bg-green-700 disabled:opacity-50 transition-colors uppercase tracking-wide">
                                    Aprobar
                                </button>
                                <button @click="handleResponderSolicitud(sol, 'Rechazada')" :disabled="procesando"
                                    class="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-md shadow-sm hover:bg-red-200 disabled:opacity-50 transition-colors uppercase tracking-wide">
                                    Rechazar
                                </button>
                            </div>
                        </li>
                    </ul>

                    <h4 class="text-xs font-black text-green-600 uppercase mb-3 tracking-wider flex items-center pt-4 border-t border-indigo-100">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Equipos Aprobados ({{ equiposAprobados.length }})
                    </h4>

                    <div v-if="equiposAprobados.length === 0" class="bg-white/60 border border-green-100 p-6 rounded-lg text-center text-sm text-green-600 italic">
                        Aún no has aprobado a ningún equipo para este torneo.
                    </div>

                    <ul class="space-y-3">
                        <li v-for="eq in equiposAprobados" :key="'apr_'+eq.id_equipo" 
                            class="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm border border-green-200">
                            <div>
                                <p class="font-bold text-gray-900 leading-tight">{{ eq.nombre_oficial }} <span class="text-xs text-gray-500 font-normal">({{ eq.siglas }})</span></p>
                                <p class="text-[10px] text-gray-500 font-bold uppercase mt-1">Sede: {{ eq.nombre_cancha || 'Sin Sede' }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] bg-green-100 text-green-800 font-black px-2 py-1 rounded border border-green-300 uppercase">
                                    Oficial
                                </span>
                                <button v-if="torneoSeleccionado.estado === 'En inscripción'" @click="handleResponderSolicitud(eq, 'Rechazada')" :disabled="procesando"
                                        class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-200"
                                        title="Expulsar y Rechazar equipo">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        </li>
                    </ul>

                    <div v-if="equiposRechazados.length > 0" class="mt-8 animate-fade-in">
                        <h4 class="text-xs font-black text-red-600 uppercase mb-3 tracking-wider flex items-center pt-4 border-t border-red-100">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Solicitudes Rechazadas ({{ equiposRechazados.length }})
                        </h4>

                        <ul class="space-y-3">
                            <li v-for="eq in equiposRechazados" :key="'rech_'+eq.id_equipo" 
                                class="bg-red-50 p-4 rounded-lg flex justify-between items-center shadow-sm border border-red-200 opacity-80 hover:opacity-100 transition-opacity">
                                <div>
                                    <p class="font-bold text-gray-900 leading-tight line-through">{{ eq.nombre_oficial }} <span class="text-xs text-gray-500 font-normal">({{ eq.siglas }})</span></p>
                                    <p class="text-[10px] text-gray-500 font-bold uppercase mt-1">Sede: {{ eq.nombre_cancha || 'Sin Sede' }}</p>
                                </div>
                                <div class="flex flex-col items-end">
                                    <span class="text-[10px] bg-red-100 text-red-800 font-black px-2 py-1 rounded border border-red-300 uppercase mb-2">
                                        Rechazado
                                    </span>
                                    <button @click="handleResponderSolicitud(eq, 'Pendiente')" :disabled="procesando"
                                        class="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline transition-colors disabled:opacity-50">
                                        Restaurar a Pendiente
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { obtenerTorneosActivosService, editarTorneoService, eliminarTorneoService, 
    obtenerInscripcionesPorTorneoService, responderInscripcionService } from '../../services/torneosService' 

const viewMode = ref('lista')
const procesando = ref(false)
const torneos = ref([])
const torneoSeleccionado = ref(null)

// VARIABLES DE INSCRIPCIONES (NUEVO)
const inscripciones = ref([])
const solicitudesPendientes = computed(() => Array.isArray(inscripciones.value) ? inscripciones.value.filter(i => i.estado_inscripcion === 'Pendiente') : [])
const equiposAprobados = computed(() => Array.isArray(inscripciones.value) ? inscripciones.value.filter(i => i.estado_inscripcion === 'Aprobada') : [])
const equiposRechazados = computed(() => Array.isArray(inscripciones.value) ? inscripciones.value.filter(i => i.estado_inscripcion === 'Rechazada') : [])

// VARIABLES PARA REGLAMENTO DIVIDIDO
const formReglamentos = ref({
    general: '',
    sanciones: '',
    normativas: ''
})

const form = ref({
    nombre_torneo: '', descripcion: '', categoria: '',
    fecha_inicio: '', fecha_fin: '', numero_equipos: 8,
    id_clasificacion: '', reglamento: ''
})

const separarReglamentos = (textoCompleto) => {
    formReglamentos.value = { general: '', sanciones: '', normativas: '' };
    if (!textoCompleto) return;

    if (!textoCompleto.includes('REGLAMENTO GENERAL:\n')) {
        formReglamentos.value.general = textoCompleto;
        return;
    }

    try {
        const partesSanciones = textoCompleto.split('\n\nSANCIONES DISCIPLINARIAS:\n');
        formReglamentos.value.general = partesSanciones[0].replace('REGLAMENTO GENERAL:\n', '').trim();
        
        if (partesSanciones.length > 1) {
            const partesNormativas = partesSanciones[1].split('\n\nNORMATIVAS ESPECIFICAS:\n');
            formReglamentos.value.sanciones = partesNormativas[0].trim();
            formReglamentos.value.normativas = (partesNormativas[1] || '').trim();
        }
    } catch (e) {
        console.error("Error al parsear el reglamento:", e);
        formReglamentos.value.general = textoCompleto; 
    }
}

const concatenarReglamentos = () => {
    return `REGLAMENTO GENERAL:\n${formReglamentos.value.general}\n\nSANCIONES DISCIPLINARIAS:\n${formReglamentos.value.sanciones}\n\nNORMATIVAS ESPECIFICAS:\n${formReglamentos.value.normativas}`;
}

const cargarTorneos = async () => {
    try {
        torneos.value = await obtenerTorneosActivosService()
    } catch (error) {
        console.error("Error cargando torneos", error)
    }
}
const cargarInscripciones = async (id) => {
    try {
        const res = await obtenerInscripcionesPorTorneoService(id);
        inscripciones.value = Array.isArray(res) ? res : (res?.data || []);
        
        if (torneoSeleccionado.value) {
            torneoSeleccionado.value.equipos_inscritos = equiposAprobados.value.length;
        }
    } catch (error) {
        console.error("Error al cargar inscripciones:", error);
        inscripciones.value = [];
    }
}

const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    form.value = {
        ...torneo,
        id_clasificacion: torneo.clasificacion_genero || 'Varonil',
        fecha_inicio: torneo.fecha_inicio ? torneo.fecha_inicio.split('T')[0] : '',
        fecha_fin: torneo.fecha_fin ? torneo.fecha_fin.split('T')[0] : ''
    }
    
    separarReglamentos(torneo.reglamento);
    viewMode.value = 'gestionar'
    await cargarInscripciones(torneo.id_torneo)
}

const handleResponderSolicitud = async (solicitud, nuevoEstado) => {
    if (nuevoEstado === 'Aprobada') {
        const totalJugadores = parseInt(solicitud.total_jugadores || 0);
        if (totalJugadores < 5) {
            return alert(`❌ REGLA DE COMPETICIÓN:\n\nEl equipo "${solicitud.nombre_oficial}" no puede ser aprobado porque solo cuenta con ${totalJugadores} jugador(es) en su plantilla activa.\n\nRechaza la solicitud o pide al entrenador que fiche a 5 jugadores mínimo.`);
        }
        if (equiposAprobados.value.length >= form.value.numero_equipos) {
            return alert(`REGLA DE TORNEO: Ya has aprobado a los ${form.value.numero_equipos} equipos requeridos. El cupo está lleno.`);
        }
    } else if (nuevoEstado === 'Rechazada') {
        if (!confirm(`¿Estás seguro de RECHAZAR y/o EXPULSAR al equipo ${solicitud.nombre_oficial} de este torneo?`)) return;
    }
    procesando.value = true
    try {
        await responderInscripcionService(torneoSeleccionado.value.id_torneo, solicitud.id_equipo, nuevoEstado)
        await cargarInscripciones(torneoSeleccionado.value.id_torneo)
        if (nuevoEstado === 'Aprobada') alert('Equipo aprobado e inscrito oficialmente en el torneo.');
        if (nuevoEstado === 'Rechazada') alert('El equipo ha sido rechazado/expulsado exitosamente.');
    } catch (error) {
        alert(error.response?.data?.error || 'Error al procesar la solicitud.')
    } finally {
        procesando.value = false
    }
}

const handleActualizarTorneo = async () => {
    if (new Date(form.value.fecha_inicio) > new Date(form.value.fecha_fin)) {
        return alert('Error: La fecha de inicio no puede ser posterior a la fecha de fin.')
    }

    form.value.reglamento = concatenarReglamentos();

    procesando.value = true
    try {
        await editarTorneoService(torneoSeleccionado.value.id_torneo, form.value)
        alert('Bases del torneo actualizadas exitosamente.')
        await cargarTorneos()
        volverListado()
    } catch (error) {
        alert(error.response?.data?.error || 'Error al actualizar las bases.')
    } finally {
        procesando.value = false
    }
}

const handleEliminarTorneo = async () => {
    if (!confirm(`¿Estás 100% seguro de archivar y eliminar el torneo "${torneoSeleccionado.value.nombre_torneo}"?\nSi se completó, desaparecerá de las listas activas.`)) return;

    procesando.value = true;
    try {
        await eliminarTorneoService(torneoSeleccionado.value.id_torneo);
        alert('El torneo ha sido eliminado/archivado del sistema.');
        volverListado();
    } catch (error) {
        alert(error.response?.data?.error || 'No se pudo eliminar el torneo por motivos de seguridad.');
    } finally {
        procesando.value = false;
    }
}

const volverListado = () => {
    viewMode.value = 'lista'
    torneoSeleccionado.value = null
    inscripciones.value = []
    
    formReglamentos.value = { general: '', sanciones: '', normativas: '' };
    
    cargarTorneos()
}

onMounted(cargarTorneos)
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>