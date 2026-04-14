<template>
    <div class="space-y-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h2 class="text-3xl font-black text-gray-900 italic uppercase">Historial de Sentencias</h2>
                <p class="text-gray-600 font-medium">Registro de todas las resoluciones emitidas por el tribunal.</p>
            </div>
            
            <div class="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm shrink-0">
                <label class="text-xs font-bold text-gray-500 uppercase">Filtrar por:</label>
                <select v-model="filtroTipo" class="bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block p-1.5 outline-none font-medium">
                    <option value="Todos">Todos los casos</option>
                    <option value="Multas Pendientes">Multas Pendientes</option>
                    <option value="Multas Pagadas">Multas Pagadas</option>
                    <option value="Suspensiones">Suspensiones</option>
                    <option value="Advertencias">Advertencias / Desestimados</option>
                </select>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div v-if="cargando" class="py-12 text-center text-indigo-500">
                <svg class="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="font-bold text-sm">Cargando historial...</p>
            </div>

            <div v-else-if="historialFiltrado.length === 0" class="py-16 text-center text-gray-500 bg-gray-50">
                <p class="text-lg font-bold text-gray-700">No hay registros</p>
                <p class="text-sm mt-1">No se encontraron resoluciones que coincidan con este filtro.</p>
            </div>

            <table v-else class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Fecha Resol.</th>
                        <th class="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Sancionado</th>
                        <th class="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Castigo Aplicado</th>
                        <th class="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Estado Castigo</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <tr v-for="item in historialFiltrado" :key="item.id_resolucion" class="hover:bg-gray-50/50 transition-colors">
                        <td class="px-6 py-4 text-sm font-medium text-gray-500">
                            {{ item.fecha_resolucion.split(' ')[0] }}
                        </td>
                        <td class="px-6 py-4">
                            <p class="text-sm font-black text-gray-900">{{ item.jugador }}</p>
                            <p class="text-[10px] text-indigo-600 font-bold uppercase">{{ item.torneo }}</p>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex flex-col gap-2">
                                <span v-if="item.partidos_suspension > 0" class="text-xs font-bold text-red-600 flex items-center">
                                    🚫 {{ item.partidos_suspension }} Partidos de Suspensión
                                </span>
                                
                                <div v-if="parseFloat(item.monto_multa) > 0" class="flex flex-col items-start gap-1">
                                    <span :class="item.multa_pagada ? 'text-green-600' : 'text-amber-600'" class="text-xs font-bold flex items-center">
                                        <svg v-if="item.multa_pagada" class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                                        <span v-else class="mr-1">💰</span> 
                                        Multa: ${{ item.monto_multa }}
                                    </span>
                                    
                                    <button v-if="!item.multa_pagada" @click="procesarPago(item.id_resolucion)" 
                                            class="mt-1 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase rounded shadow-sm transition-colors">
                                        Marcar como Pagada
                                    </button>
                                </div>

                                <span v-if="item.partidos_suspension === 0 && parseFloat(item.monto_multa) === 0" class="text-xs font-bold text-blue-600">
                                    📢 Advertencia / Reporte desestimado
                                </span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-center">
                            <span :class="{
                                'bg-green-100 text-green-700 border-green-200': item.estado_cumplimiento === 'Cumplido' || item.estado_cumplimiento === 'Finalizado',
                                'bg-indigo-100 text-indigo-700 border-indigo-200 animate-pulse': item.estado_cumplimiento.includes('En cumplimiento')
                            }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase border">
                                {{ item.estado_cumplimiento }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { obtenerHistorialResolucionesService, pagarMultaService } from '../../services/resolucionesService';

const historial = ref([]);
const cargando = ref(true);
const filtroTipo = ref('Todos');

onMounted(async () => {
    try {
        historial.value = await obtenerHistorialResolucionesService();
    } catch (e) {
        console.error(e);
    } finally {
        cargando.value = false;
    }
});

// Propiedad computada que evalúa el array en tiempo real según lo que el usuario elija
const historialFiltrado = computed(() => {
    if (filtroTipo.value === 'Todos') return historial.value;

    return historial.value.filter(item => {
        const tieneSuspension = item.partidos_suspension > 0;
        const monto = parseFloat(item.monto_multa);
        const tieneMulta = monto > 0;

        switch (filtroTipo.value) {
            case 'Multas Pendientes':
                return tieneMulta && !item.multa_pagada;
            case 'Multas Pagadas':
                return tieneMulta && item.multa_pagada;
            case 'Suspensiones':
                return tieneSuspension;
            case 'Advertencias':
                return !tieneSuspension && !tieneMulta;
            default:
                return true;
        }
    });
});

const procesarPago = async (idResolucion) => {
    if(!confirm("¿Confirmas que el club o jugador ya canceló el monto de esta multa? Esta acción registrará el pago oficialmente.")) return;
    
    try {
        await pagarMultaService(idResolucion);
        
        // Actualizamos visualmente el array local sin necesidad de recargar la base de datos
        const index = historial.value.findIndex(h => h.id_resolucion === idResolucion);
        if(index !== -1) {
            historial.value[index].multa_pagada = true;
        }
    } catch (error) {
        alert("Error al intentar procesar el pago. Verifica tu conexión.");
        console.error(error);
    }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>