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
                    {{ torneoSeleccionado ? 'Modifica las bases o retira equipos inscritos.' : 'Selecciona un torneo para editarlo o eliminarlo.' }}
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
                    Equipos Inscritos: 
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
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div>
                        <label class="block text-xs font-black text-gray-500 uppercase">Reglamento</label>
                        <textarea v-model="form.reglamento" rows="5" :disabled="torneoSeleccionado.estado !== 'En inscripción'" class="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-amber-500 disabled:text-gray-500 disabled:cursor-not-allowed"></textarea>
                    </div>

                    <div class="flex justify-between pt-4 border-t border-gray-200 mt-4">
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

            <div class="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-6 h-fit max-h-212.5 overflow-y-auto">
                <div class="flex justify-between items-center border-b border-amber-200 pb-3 mb-4">
                    <h3 class="text-xl font-bold text-amber-900">Equipos Inscritos</h3>
                    <span class="px-3 py-1 bg-white text-amber-800 rounded-full text-sm font-black shadow-sm border border-amber-100">
                        {{ equiposInscritos.length }} / {{ form.numero_equipos }}
                    </span>
                </div>

                <div v-if="equiposInscritos.length === 0" class="text-center py-8 text-amber-700 italic bg-white/50 rounded-lg border border-amber-100">
                    Aún no hay equipos inscritos en este torneo.
                </div>

                <ul v-else class="space-y-3">
                    <li v-for="eq in equiposInscritos" :key="eq.id_equipo" 
                        class="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm border border-amber-100 transition-colors">
                        <div>
                            <p class="font-bold text-gray-900 leading-tight">{{ eq.nombre_oficial }} <span class="text-xs text-gray-500 font-normal">({{ eq.siglas }})</span></p>
                            <p class="text-[10px] text-gray-500 font-bold uppercase mt-1 flex items-center">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                {{ eq.nombre_cancha || 'Sin Sede Oficial' }}
                            </p>
                        </div>
                        
                        <button v-if="torneoSeleccionado.estado === 'En inscripción'" @click="quitarEquipo(eq)" :disabled="procesando"
                                class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                title="Expulsar equipo del torneo">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerTorneosActivosService, editarTorneoService, obtenerEquiposInscritosService, 
    quitarEquipoTorneoService, eliminarTorneoService } from '../../services/torneosService' // <-- Revisa la ruta aquí también

const viewMode = ref('lista')
const procesando = ref(false)
const torneos = ref([])
const torneoSeleccionado = ref(null)
const equiposInscritos = ref([])

const form = ref({
    nombre_torneo: '', descripcion: '', categoria: '',
    fecha_inicio: '', fecha_fin: '', numero_equipos: 8,
    id_clasificacion: '', reglamento: ''
})

const cargarTorneos = async () => {
    try {
        torneos.value = await obtenerTorneosActivosService()
    } catch (error) {
        console.error("Error cargando torneos", error)
    }
}

const seleccionarTorneo = async (torneo) => {
    
    torneoSeleccionado.value = torneo
    form.value = {
        ...torneo,
        fecha_inicio: torneo.fecha_inicio ? torneo.fecha_inicio.split('T')[0] : '',
        fecha_fin: torneo.fecha_fin ? torneo.fecha_fin.split('T')[0] : ''
    }
    viewMode.value = 'gestionar'
    await cargarEquiposInscritos(torneo.id_torneo)
}

const cargarEquiposInscritos = async (id) => {
    try {
        equiposInscritos.value = await obtenerEquiposInscritosService(id)
    } catch (error) {
        console.error("Error al cargar equipos inscritos", error)
    }
}

const handleActualizarTorneo = async () => {
    if (new Date(form.value.fecha_inicio) > new Date(form.value.fecha_fin)) {
        return alert('Error: La fecha de inicio no puede ser posterior a la fecha de fin.')
    }
    procesando.value = true
    try {
        await editarTorneoService(torneoSeleccionado.value.id_torneo, form.value)
        alert('Bases del torneo actualizadas exitosamente.')
        await cargarTorneos()
    } catch (error) {
        alert(error.response?.data?.error || 'Error al actualizar las bases.')
    } finally {
        procesando.value = false
    }
}

const quitarEquipo = async (equipo) => {
    if (!confirm(`¿Estás seguro de expulsar a "${equipo.nombre_oficial}" de este torneo?`)) return;

    procesando.value = true;
    try {
        await quitarEquipoTorneoService(torneoSeleccionado.value.id_torneo, equipo.id_equipo);
        
        equiposInscritos.value = equiposInscritos.value.filter(e => e.id_equipo !== equipo.id_equipo);
        torneoSeleccionado.value.equipos_inscritos--; 
        
        alert('Equipo retirado del torneo exitosamente.');
    } catch (error) {
        alert(error.response?.data?.error || 'Ocurrió un error al intentar quitar al equipo.');
    } finally {
        procesando.value = false;
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
    equiposInscritos.value = []
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