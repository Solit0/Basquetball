<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            
            <div class="px-6 py-4 bg-indigo-900 text-white flex justify-between items-center shrink-0">
                <div>
                    <h3 class="text-xl font-black uppercase tracking-wider">Hoja de Anotación Oficial</h3>
                    <p class="text-indigo-200 text-xs font-medium mt-1">Partido: {{ partido.local_nombre }} vs {{ partido.visitante_nombre }}</p>
                </div>
                <button @click="$emit('close')" class="text-indigo-200 hover:text-white transition-colors bg-indigo-800 hover:bg-indigo-700 rounded-full p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                <form id="resultadoForm" @submit.prevent="guardarResultado" class="space-y-8">
                    
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h4 class="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 border-b pb-2">1. Resultado Final y Oficial</h4>
                        
                        <div class="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                            <div class="text-center w-full md:w-1/3">
                                <label class="block text-sm font-bold text-gray-800 mb-2">{{ partido.local_nombre }} (Local)</label>
                                <input type="number" v-model="form.marcador_local" required min="0"
                                    class="w-full text-center text-4xl font-black text-indigo-700 py-3 border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all">
                            </div>
                            
                            <div class="text-2xl font-black text-gray-300">VS</div>

                            <div class="text-center w-full md:w-1/3">
                                <label class="block text-sm font-bold text-gray-800 mb-2">{{ partido.visitante_nombre }} (Visitante)</label>
                                <input type="number" v-model="form.marcador_visitante" required min="0"
                                    class="w-full text-center text-4xl font-black text-gray-700 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-100 focus:border-gray-500 outline-none transition-all">
                            </div>
                        </div>

                        </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h4 class="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 border-b pb-2">2. Puntos Individuales</h4>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h5 class="font-bold text-gray-800 bg-indigo-50 px-3 py-2 rounded text-sm mb-3">Equipo Local: {{ partido.local_nombre }}</h5>
                                <div v-if="puntosLocal.length === 0" class="text-xs text-gray-500 italic">No hay jugadores registrados en este equipo.</div>
                                <div v-for="jugador in puntosLocal" :key="jugador.id_jugador" class="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
                                    
                                    <div class="text-sm text-gray-700 truncate pr-2 flex items-center">
                                        <span class="mr-2">#{{ jugador.numero_camiseta || '-' }}</span>
                                        <span>{{ jugador.nombre }} {{ jugador.apellido }}</span>
                                        
                                        <span v-if="jugador.es_capitan" 
                                              class="ml-2 text-[9px] font-black bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded shadow-sm border border-yellow-500">
                                            © CAP
                                        </span>
                                    </div>

                                    <input type="number" v-model="jugador.puntos" min="0" class="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
                                </div>
                            </div>

                            <div>
                                <h5 class="font-bold text-gray-800 bg-gray-100 px-3 py-2 rounded text-sm mb-3">Equipo Visitante: {{ partido.visitante_nombre }}</h5>
                                <div v-if="puntosVisitante.length === 0" class="text-xs text-gray-500 italic">No hay jugadores registrados en este equipo.</div>
                                <div v-for="jugador in puntosVisitante" :key="jugador.id_jugador" class="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
                                    
                                    <div class="text-sm text-gray-700 truncate pr-2 flex items-center">
                                        <span class="mr-2">#{{ jugador.numero_camiseta || '-' }}</span>
                                        <span>{{ jugador.nombre }} {{ jugador.apellido }}</span>
                                        
                                        <span v-if="jugador.es_capitan" 
                                              class="ml-2 text-[9px] font-black bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded shadow-sm border border-yellow-500">
                                            © CAP
                                        </span>
                                    </div>

                                    <input type="number" v-model="jugador.puntos" min="0" class="w-16 px-2 py-1 text-center border border-gray-300 rounded text-sm font-bold focus:ring-2 focus:ring-gray-500 outline-none">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div class="flex justify-between items-center border-b pb-2 mb-4">
                            <h4 class="text-sm font-black text-indigo-400 uppercase tracking-widest">3. Informe e Incidentes</h4>
                            <button type="button" @click="agregarIncidente" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded hover:bg-indigo-100 transition">
                                + Añadir Incidente
                            </button>
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Redacción del Informe General *</label>
                            <textarea v-model="form.informe_contenido" required rows="4" placeholder="Describa cómo transcurrió el partido..."
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50"></textarea>
                        </div>

                        <div v-if="incidentes.length > 0" class="space-y-3 mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <h5 class="text-xs font-black text-orange-800 uppercase">Registro de Incidentes</h5>
                            <div v-for="(inc, index) in incidentes" :key="index" class="flex flex-wrap md:flex-nowrap gap-2 items-start bg-white p-3 rounded shadow-sm border border-orange-200">
                                <input type="text" v-model="inc.tipo_incidente" placeholder="Tipo (Ej. Insultos)" required class="flex-1 min-w-30 px-2 py-1 border rounded text-xs outline-none focus:ring-1 focus:ring-orange-500">
                                <input type="number" v-model="inc.minuto_aprox" placeholder="Minuto" class="w-20 px-2 py-1 border rounded text-xs outline-none focus:ring-1 focus:ring-orange-500">
                                <input type="text" v-model="inc.descripcion_breve" placeholder="Descripción breve..." class="flex-2 min-w-50 w-full md:w-auto px-2 py-1 border rounded text-xs outline-none focus:ring-1 focus:ring-orange-500">
                                <button type="button" @click="incidentes.splice(index, 1)" class="p-1 text-red-500 hover:bg-red-50 rounded text-xs font-bold">Quitar</button>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-red-500">
                        <div class="flex justify-between items-center border-b pb-2 mb-4">
                            <h4 class="text-sm font-black text-red-500 uppercase tracking-widest">4. Reporte de Infracciones</h4>
                            <button type="button" @click="agregarSancion" class="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition">
                                + Emitir Infracción
                            </button>
                        </div>
                        
                        <p class="text-xs text-gray-500 mb-4">Registra las faltas graves cometidas en este partido.</p>

                        <div v-if="sanciones.length === 0" class="text-center text-sm text-gray-400 py-2">No se han registrado infracciones.</div>
                        
                        <div v-for="(san, index) in sanciones" :key="index" class="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3 space-y-3 relative">
                            <button type="button" @click="sanciones.splice(index, 1)" class="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-black">&times;</button>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black text-gray-500 uppercase">Jugador Infractor</label>
                                    <select v-model="san.id_jugador" required class="w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-red-500">
                                        <option value="" disabled>Seleccione jugador...</option>
                                        
                                        <optgroup :label="'Local: ' + partido.local_nombre">
                                            <option v-for="j in puntosLocal" :value="j.id_jugador" :key="'L'+j.id_jugador">
                                                {{ j.nombre }} {{ j.apellido }} {{ j.es_capitan ? ' (© CAP)' : '' }}
                                            </option>
                                        </optgroup>
                                        
                                        <optgroup :label="'Visitante: ' + partido.visitante_nombre">
                                            <option v-for="j in puntosVisitante" :value="j.id_jugador" :key="'V'+j.id_jugador">
                                                {{ j.nombre }} {{ j.apellido }} {{ j.es_capitan ? ' (© CAP)' : '' }}
                                            </option>
                                        </optgroup>
                                        
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-gray-500 uppercase">Gravedad / Tipo</label>
                                    <select v-model="san.tipo_sancion" required class="w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-red-500">
                                        <option value="Conducta Antideportiva">Conducta Antideportiva</option>
                                        <option value="Agresión Física">Agresión Física</option>
                                        <option value="Acumulación de Faltas Técnicas">Acumulación de Faltas Técnicas</option>
                                        <option value="Falta Flagrante">Falta Flagrante</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-black text-gray-500 uppercase">Motivo Detallado de la Infracción</label>
                                <input type="text" v-model="san.motivo" required placeholder="Explique brevemente qué sucedió..." class="w-full mt-1 p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-red-500">
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="px-6 py-4 border-t border-gray-200 bg-white flex justify-end space-x-4 shrink-0">
                <button type="button" @click="$emit('close')" class="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition">
                    Cancelar
                </button>
                <button form="resultadoForm" type="submit" :disabled="procesando" 
                        class="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center">
                    <svg v-if="procesando" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {{ procesando ? 'Guardando...' : 'Finalizar Partido y Cerrar Acta' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerAlineacionPartidoService } from '../../services/arbitrosService'
import { finalizarPartidoService } from '../../services/partidosService'

const props = defineProps({
    partido: { type: Object, required: true },
    idTorneo: { type: String, required: true }
})

const emit = defineEmits(['close'])

const procesando = ref(false)

const puntosLocal = ref([])
const puntosVisitante = ref([])
const incidentes = ref([])
const sanciones = ref([])

const form = ref({
    marcador_local: 0,
    marcador_visitante: 0,
    informe_contenido: ''
})

onMounted(async () => {
    try {
        const alineacionLocal = await obtenerAlineacionPartidoService(props.partido.id_partido, props.partido.id_local || props.partido.id_equipo_local);
        const alineacionVisitante = await obtenerAlineacionPartidoService(props.partido.id_partido, props.partido.id_visitante || props.partido.id_equipo_visitante);
        
        const jugadoresLocal = alineacionLocal.filter(j => j.estado_asistencia === 'Presente');
        const jugadoresVisitante = alineacionVisitante.filter(j => j.estado_asistencia === 'Presente');

        puntosLocal.value = jugadoresLocal.map(j => ({ id_jugador: j.id_jugador, nombre: j.nombre, 
            numero_camiseta: j.numero_camiseta, puntos: 0, apellido: j.apellido, es_capitan: j.es_capitan }));
        puntosVisitante.value = jugadoresVisitante.map(j => ({ id_jugador: j.id_jugador, nombre: j.nombre, apellido: j.apellido,
            numero_camiseta: j.numero_camiseta, puntos: 0, es_capitan: j.es_capitan }));

    } catch (error) {
        console.error("Error cargando datos del modal", error)
        alert("Error cargando datos. Verifica tu conexión.")
    }
})

const agregarIncidente = () => {
    incidentes.value.push({ tipo_incidente: '', minuto_aprox: null, descripcion_breve: '' })
}

const agregarSancion = () => {
    sanciones.value.push({ 
        id_jugador: '', 
        tipo_sancion: 'Conducta Antideportiva', 
        motivo: '' 
    })
}

const guardarResultado = async () => {
    const totalLocal = puntosLocal.value.reduce((suma, jugador) => suma + (jugador.puntos || 0), 0);
    const totalVisitante = puntosVisitante.value.reduce((suma, jugador) => suma + (jugador.puntos || 0), 0);

    if (totalLocal !== parseInt(form.value.marcador_local)) {
        return alert(` INCONGRUENCIA EN MARCADOR LOCAL:\n\nLa suma de los puntos individuales (${totalLocal}) no coincide con el marcador final (${form.value.marcador_local}).`);
    }
    if (totalVisitante !== parseInt(form.value.marcador_visitante)) {
        return alert(` INCONGRUENCIA EN MARCADOR VISITANTE:\n\nLa suma de los puntos individuales (${totalVisitante}) no coincide con el marcador final (${form.value.marcador_visitante}).`);
    }

    if (!confirm(`¿Confirmas que el marcador oficial fue ${form.value.marcador_local} a ${form.value.marcador_visitante}?\n\nEl equipo perdedor será eliminado del torneo. Esta acción no se puede deshacer.`)) {
        return;
    }
    procesando.value = true;
    try {
        const jugadoresAnotadores = [
            ...puntosLocal.value.filter(j => j.puntos > 0),
            ...puntosVisitante.value.filter(j => j.puntos > 0)
        ].map(j => ({ id_jugador: j.id_jugador, puntos: j.puntos }));
        const incidentesLimpios = incidentes.value.map(inc => ({
            ...inc,
            minuto_aprox: inc.minuto_aprox === '' ? null : inc.minuto_aprox
        }));

        const payload = {
            id_torneo: props.idTorneo,
            id_equipo_local: props.partido.id_local || props.partido.id_equipo_local,
            id_equipo_visitante: props.partido.id_visitante || props.partido.id_equipo_visitante,
            marcador_local: parseInt(form.value.marcador_local),
            marcador_visitante: parseInt(form.value.marcador_visitante),
            id_arbitro: props.partido.id_arbitro_principal, 
            informe_contenido: form.value.informe_contenido,
            incidentes: incidentesLimpios,
            sanciones: sanciones.value,
            puntos_jugadores: jugadoresAnotadores
        };

        await finalizarPartidoService(props.partido.id_partido, payload);
        alert('¡Resultado y acta oficial guardados con éxito!');
        emit('close', true); // Emitimos un "true" para indicarle a la vista principal que recargue los datos

    } catch (error) {
        alert(error.response?.data?.error || "Ocurrió un error al guardar el resultado.")
    } finally {
        procesando.value = false;
    }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
</style>