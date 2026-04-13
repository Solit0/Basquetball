<template>
    <div class="space-y-6 animate-fade-in">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">
                    Tribunal Disciplinario
                </h2>
                <p class="text-gray-600 font-medium">Revisa los reportes de árbitros y dicta sentencias oficiales.</p>
            </div>
            <div class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-black border border-indigo-200">
                {{ sanciones.length }} Casos Pendientes
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div v-if="cargando" class="py-20 text-center">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-gray-500 font-bold uppercase text-xs tracking-widest">Consultando expedientes...</p>
            </div>

            <div v-else-if="sanciones.length === 0" class="py-20 text-center bg-gray-50/50">
                <div class="text-5xl mb-4 text-green-400">⚖️</div>
                <h3 class="text-lg font-black text-gray-900">Paz en las Canchas</h3>
                <p class="text-gray-500">No hay reportes de incidentes pendientes de revisión.</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha/Partido</th>
                            <th class="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Jugador / Equipo</th>
                            <th class="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Infracción Reportada</th>
                            <th class="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Acción</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 bg-white">
                        <tr v-for="sancion in sanciones" :key="sancion.id_sancion" class="hover:bg-indigo-50/30 transition-colors">
                            <td class="px-6 py-4">
                                <p class="text-sm font-black text-gray-900">{{ sancion.fecha_reporte.split('T')[0] }}</p>
                                <p class="text-xs text-indigo-600 font-bold uppercase truncate max-w-37.5">{{ sancion.torneo_nombre }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <p class="text-sm font-bold text-gray-900">{{ sancion.jugador_nombre }} {{ sancion.jugador_apellido }}</p>
                                <p class="text-xs text-gray-500 italic">ID Jugador: {{ sancion.id_jugador.substring(0,8) }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-red-200">
                                    {{ sancion.tipo_sancion }}
                                </span>
                                <p class="text-xs text-gray-600 mt-1 italic line-clamp-1" :title="sancion.motivo">"{{ sancion.motivo }}"</p>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button @click="abrirTribunal(sancion)" 
                                    class="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-indigo-700 transition shadow-sm">
                                    Juzgar Caso
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 my-8">
                <div class="bg-indigo-600 p-6 text-white">
                    <h3 class="text-2xl font-black italic uppercase">Veredicto Oficial</h3>
                    <p class="text-indigo-100 text-xs font-bold uppercase mt-1">Caso: {{ sancionSeleccionada.jugador_nombre }} {{ sancionSeleccionada.jugador_apellido }}</p>
                </div>

                <div class="px-8 pt-6">
                    <button @click="verReporteArbitro = !verReporteArbitro" 
                        class="flex items-center justify-between w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-black py-3 px-4 rounded-xl transition-colors border border-gray-200">
                        <span class="text-xs tracking-widest uppercase">📄 Acta del Árbitro</span>
                        <svg :class="{'rotate-180': verReporteArbitro}" class="w-5 h-5 transition-transform text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    <div v-if="verReporteArbitro" class="mt-3 p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-gray-800 animate-fade-in space-y-4 shadow-inner">
                        <div>
                            <span class="font-black text-amber-800 uppercase text-[10px] tracking-widest block mb-1">Falta Cometida:</span>
                            <span class="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-red-200">
                                {{ sancionSeleccionada.tipo_sancion }}
                            </span>
                        </div>
                        <div>
                            <span class="font-black text-amber-800 uppercase text-[10px] tracking-widest block mb-1">Detalle sobre el jugador:</span>
                            <p class="italic bg-white p-3 rounded border border-amber-100">"{{ sancionSeleccionada.motivo }}"</p>
                        </div>
                        <div v-if="sancionSeleccionada.informe_partido">
                            <span class="font-black text-amber-800 uppercase text-[10px] tracking-widest block mb-1">Contexto general del partido:</span>
                            <p class="whitespace-pre-line text-xs bg-white p-3 rounded border border-amber-100">{{ sancionSeleccionada.informe_partido }}</p>
                        </div>
                    </div>
                </div>

                <div class="p-8 space-y-6 pt-6 border-t border-gray-100 mt-6">
                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Tipo de Resolución</label>
                        <select v-model="form.tipo_accion" class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:border-indigo-500 outline-none transition-all">
                            <option value="Advertencia">Advertencia Verbal/Escrita</option>
                            <option value="Multa">Multa Económica</option>
                            <option value="Suspension">Suspensión de Partidos</option>
                            <option value="Ambos">Multa + Suspensión</option>
                            <option value="Desestimar">Desestimar Reporte (Sin cargo)</option>
                        </select>
                    </div>

                    <div class="grid grid-cols-2 gap-4 animate-fade-in" v-if="form.tipo_accion !== 'Advertencia' && form.tipo_accion !== 'Desestimar'">
                        
                        <div v-if="['Suspension', 'Ambos'].includes(form.tipo_accion)">
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Partidos de Suspensión</label>
                            <input
                                type="number"
                                v-model.number="form.partidos_suspension"
                                min="1"
                                max="20"
                                @input="form.partidos_suspension = Math.max(1, Math.abs(parseInt($event.target.value) || 1))"
                                class="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl px-4 py-3 font-black text-indigo-700 focus:ring-0 outline-none"
                            />
                            <p class="text-[9px] text-indigo-500 mt-1 font-bold italic">* Pasará a 'Suplente' automáticamente.</p>
                        </div>

                        <div v-if="['Multa', 'Ambos'].includes(form.tipo_accion)">
                            <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Monto de la Multa ($)</label>
                            <input
                                type="number"
                                v-model.number="form.monto_multa"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                @input="sanitizarMulta($event)"
                                @blur="form.monto_multa = parseFloat((Math.max(0, form.monto_multa || 0)).toFixed(2))"
                                class="w-full bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3 font-black text-amber-700 focus:ring-0 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Observaciones de la Administración</label>
                        <textarea v-model="form.observaciones_admin" rows="3" placeholder="Escribe el razonamiento legal del club..."
                            class="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-800 focus:border-indigo-500 outline-none transition-all"></textarea>
                    </div>

                    <div v-if="errorRequest" class="p-3 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-lg border border-red-200">
                        {{ errorRequest }}
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button @click="cerrarTribunal" class="flex-1 py-4 text-gray-400 font-black uppercase text-xs tracking-widest hover:text-gray-600 transition">
                            Cancelar
                        </button>
                        <button @click="ejecutarSentencia" :disabled="enviando"
                            class="py-4 bg-indigo-600 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
                            style="flex: 2 1 0%">
                            {{ enviando ? 'Firmando Resolución...' : 'Emitir Sentencia' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerSancionesPendientesService, dictarResolucionService } from '../../services/resolucionesService'

const sanciones = ref([])
const cargando = ref(true)
const enviando = ref(false)
const showModal = ref(false)
const errorRequest = ref('')
const sancionSeleccionada = ref(null)
const verReporteArbitro = ref(false) // Controla si se ve el reporte en el modal

const form = ref({
    tipo_accion: 'Advertencia',
    partidos_suspension: 0,
    monto_multa: 0,
    observaciones_admin: ''
})

const cargarSanciones = async () => {
    cargando.value = true
    try {
        sanciones.value = await obtenerSancionesPendientesService()
    } catch (error) {
        console.error("Error al cargar tribunal:", error)
    } finally {
        cargando.value = false
    }
}

const abrirTribunal = (sancion) => {
    sancionSeleccionada.value = sancion
    verReporteArbitro.value = false // Oculta el reporte por defecto
    form.value = {
        tipo_accion: 'Advertencia',
        partidos_suspension: 1,
        monto_multa: 10,
        observaciones_admin: ''
    }
    showModal.value = true
}

const sanitizarMulta = (event) => {
    const raw = event.target.value
    if (raw === '' || raw === '-') {
        form.value.monto_multa = 0
        return
    }
    const valor = parseFloat(raw)
    if (isNaN(valor) || valor < 0) {
        form.value.monto_multa = 0
        event.target.value = '0.00'
        return
    }
    const truncado = Math.floor(valor * 100) / 100
    form.value.monto_multa = truncado
    const partes = raw.split('.')
    if (partes[1] && partes[1].length > 2) {
        event.target.value = truncado.toFixed(2)
    }
}

const cerrarTribunal = () => {
    showModal.value = false
    sancionSeleccionada.value = null
    errorRequest.value = ''
}

const ejecutarSentencia = async () => {
    if (enviando.value) return

    errorRequest.value = ''

    const partidos = form.value.partidos_suspension
    const multa = form.value.monto_multa

    if (['Suspension', 'Ambos'].includes(form.value.tipo_accion) && (isNaN(partidos) || partidos < 1)) {
        errorRequest.value = 'Los partidos de suspensión deben ser al menos 1.'
        return
    }

    if (['Multa', 'Ambos'].includes(form.value.tipo_accion) && (isNaN(multa) || multa < 0)) {
        errorRequest.value = 'El monto de la multa no puede ser negativo.'
        return
    }

    enviando.value = true

    const payload = {
        partidos_suspension: ['Suspension', 'Ambos'].includes(form.value.tipo_accion) ? partidos : 0,
        monto_multa: ['Multa', 'Ambos'].includes(form.value.tipo_accion) ? multa : 0,
        observaciones_admin: form.value.observaciones_admin || `Resolución emitida bajo cargo de: ${form.value.tipo_accion}`
    }

    try {
        await dictarResolucionService(sancionSeleccionada.value.id_sancion, payload)
        alert('SENTENCIA EMITIDA: El caso ha sido cerrado y el castigo aplicado.')
        await cargarSanciones()
        cerrarTribunal()
    } catch (error) {
        errorRequest.value = error.response?.data?.error || 'No se pudo emitir la sentencia.'
    } finally {
        enviando.value = false
    }
}

onMounted(() => {
    cargarSanciones()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>