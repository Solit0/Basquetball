<template>
    <div class="space-y-6 relative animate-fade-in">
        
        <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <div>
                <h2 class="text-3xl font-black text-gray-900 flex items-center">
                    <svg class="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    Ranking de Equipos
                </h2>
                <p class="text-gray-600 mt-1">Consulta la tabla de posiciones global y cruza filtros para un análisis preciso.</p>
            </div>
        </div>

        <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Torneo Específico</label>
                <select v-model="filtros.torneo" @change="cargarRanking" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none cursor-pointer">
                    <option value="Todos">🏆 Todos los Torneos</option>
                    <option v-for="t in listaTorneos" :key="t.id_torneo" :value="t.id_torneo">
                        {{ t.nombre_torneo }}
                    </option>
                </select>
            </div>

            <div>
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Nivel / Edad</label>
                <select v-model="filtros.categoria" @change="cargarRanking" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none cursor-pointer">
                    <option value="Todas">📊 Todas las Categorías</option>
                    <option value="Sub-12">Sub-12 (Infantil)</option>
                    <option value="Sub-15">Sub-15 (Pasarela)</option>
                    <option value="Sub-18">Sub-18 (Juvenil)</option>
                    <option value="U-23">U-23 (Promesas)</option>
                    <option value="Libre">Libre (Primera División)</option>
                    <option value="Veteranos">Veteranos (+35)</option>
                    <option value="Maxi-Baloncesto">Maxi-Baloncesto (+45)</option>
                </select>
            </div>

            <div>
                <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Rama</label>
                <select v-model="filtros.clasificacion" @change="cargarRanking" 
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none cursor-pointer">
                    <option value="Todas">🚻 Todas las Ramas</option>
                    <option v-for="c in listaClasificaciones" :key="c.id_clasificacion" :value="c.id_clasificacion">
                        {{ c.descripcion }}
                    </option>
                </select>
            </div>
        </div>

        <div class="text-right">
            <span class="text-sm text-gray-500 font-medium">Equipos listados:</span>
            <span class="ml-2 bg-gray-800 text-white px-3 py-1 rounded-full font-black text-sm">{{ ranking.length }}</span>
        </div>

        <div v-if="cargando" class="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
            <svg class="animate-spin h-10 w-10 mx-auto text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p class="font-bold text-gray-600">Calculando estadísticas cruzadas...</p>
        </div>

        <div v-else-if="ranking.length === 0" class="py-20 text-center bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
            <span class="text-5xl block mb-4">📊</span>
            <h3 class="text-lg font-black text-gray-800">No hay coincidencias</h3>
            <p class="text-gray-500 mt-2 max-w-md mx-auto">Ningún equipo con partidos finalizados coincide con esta combinación exacta de filtros.</p>
        </div>

        <div v-else class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-900 text-white uppercase text-[10px] tracking-widest font-black">
                            <th class="p-4 text-center w-16">Pos</th>
                            <th class="p-4">Equipo</th>
                            <th class="p-4 text-center" title="Partidos Jugados">PJ</th>
                            <th class="p-4 text-center text-green-400" title="Partidos Ganados">PG</th>
                            <th class="p-4 text-center text-red-400" title="Partidos Perdidos">PP</th>
                            <th class="p-4 text-center text-yellow-400" title="Porcentaje de Victorias">% Win Rate</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        <tr v-for="(equipo, index) in ranking" :key="equipo.id_equipo" 
                            class="border-b border-gray-100 hover:bg-indigo-50/50 transition-colors"
                            :class="{'bg-yellow-50/30': index === 0, 'bg-gray-50/50': index === 1, 'bg-orange-50/30': index === 2}">
                            
                            <td class="p-4 text-center font-black">
                                <span v-if="index === 0" class="flex items-center justify-center w-8 h-8 mx-auto bg-yellow-400 text-yellow-900 rounded-full shadow-sm text-lg">🥇</span>
                                <span v-else-if="index === 1" class="flex items-center justify-center w-8 h-8 mx-auto bg-gray-300 text-gray-800 rounded-full shadow-sm text-lg">🥈</span>
                                <span v-else-if="index === 2" class="flex items-center justify-center w-8 h-8 mx-auto bg-orange-400 text-orange-900 rounded-full shadow-sm text-lg">🥉</span>
                                <span v-else class="text-gray-500 text-base">{{ index + 1 }}</span>
                            </td>

                            <td class="p-4">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs mr-3 border border-indigo-200">
                                        {{ equipo.siglas || equipo.nombre_oficial.substring(0,2).toUpperCase() }}
                                    </div>
                                    <div>
                                        <p class="font-black text-gray-900 text-base">{{ equipo.nombre_oficial }}</p>
                                    </div>
                                </div>
                            </td>

                            <td class="p-4 text-center font-bold text-gray-700 text-base">{{ equipo.partidos_jugados }}</td>
                            <td class="p-4 text-center font-black text-green-600 text-base bg-green-50/30">{{ equipo.partidos_ganados }}</td>
                            <td class="p-4 text-center font-bold text-red-500 text-base">{{ equipo.partidos_perdidos }}</td>
                            
                            <td class="p-4 text-center">
                                <div class="flex items-center justify-center">
                                    <span class="font-black text-base" :class="calcularWinRate(equipo) >= 50 ? 'text-indigo-600' : 'text-gray-500'">
                                        {{ calcularWinRate(equipo) }}%
                                    </span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-1 max-w-20 mx-auto overflow-hidden">
                                    <div class="h-1.5 rounded-full" :class="calcularWinRate(equipo) >= 50 ? 'bg-indigo-500' : 'bg-gray-400'" :style="`width: ${calcularWinRate(equipo)}%`"></div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import {obtenerTorneosActivosService} from '../../services/torneosService'
import { obtenerRankingEquiposService, obtenerClasificacionesService } from '../../services/estadisticasService' 

const ranking = ref([])
const cargando = ref(true)

const listaTorneos = ref([])
const listaClasificaciones = ref([])

const filtros = reactive({
    torneo: 'Todos',
    categoria: 'Todas',
    clasificacion: 'Todas'
})

const cargarListas = async () => {
    try {
        const resClasificaciones = await obtenerClasificacionesService();
        listaClasificaciones.value = resClasificaciones || [];

        const resTorneos = await obtenerTorneosActivosService();
        listaTorneos.value = resTorneos || [];
    } catch (error) {
        console.warn("Aviso: No se pudieron cargar las listas de filtros.", error);
    }
}

const cargarRanking = async () => {
    cargando.value = true;
    try {
        const data = await obtenerRankingEquiposService(filtros.categoria, filtros.clasificacion, filtros.torneo);
        ranking.value = data || [];
    } catch (error) {
        console.error("Error al cargar el ranking:", error);
        alert("No se pudieron cargar las estadísticas. Revisa tu conexión.");
    } finally {
        cargando.value = false;
    }
}

const calcularWinRate = (equipo) => {
    if (!equipo.partidos_jugados || equipo.partidos_jugados === 0) return 0;
    const porcentaje = (equipo.partidos_ganados / equipo.partidos_jugados) * 100;
    return Number.isInteger(porcentaje) ? porcentaje : porcentaje.toFixed(1);
}

onMounted(async () => {
    await cargarListas();
    await cargarRanking();
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>