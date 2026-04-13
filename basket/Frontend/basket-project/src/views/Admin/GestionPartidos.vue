<template>
    <div class="space-y-6 relative">
        
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                    <button v-if="torneoSeleccionado" @click="volver" class="mr-3 text-indigo-600 hover:text-indigo-800 transition-colors">&larr;</button>
                    Gestión de Partidos
                </h2>
                <p class="text-gray-600 mt-1">Genera las llaves, calendariza los encuentros y supervisa el progreso del torneo.</p>
            </div>
        </div>

        <div v-if="!torneoSeleccionado" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="torneos.length === 0" class="col-span-full py-12 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                No hay torneos activos actualmente.
            </div>
            
            <div v-for="t in torneos" :key="t.id_torneo" @click="seleccionarTorneo(t)"
                 class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-900 leading-tight">{{ t.nombre_torneo }}</h3>
                    <span :class="t.estado === 'En curso' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'" class="px-2 py-1 text-[10px] font-bold rounded uppercase">
                        {{ t.estado }}
                    </span>
                </div>
                <p class="text-sm text-gray-600 font-medium mb-3">
                    Equipos Originales: <span class="text-indigo-600 font-bold">{{ t.equipos_inscritos }} / {{ t.numero_equipos }}</span>
                </p>
                <button class="w-full mt-2 py-2 bg-indigo-50 text-indigo-700 font-bold rounded hover:bg-indigo-100 transition-colors">
                    Ver Llaves / Partidos
                </button>
            </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
                <div>
                    <h3 class="text-2xl font-black text-indigo-900 uppercase tracking-wide">{{ torneoSeleccionado.nombre_torneo }}</h3>
                    <p class="text-sm font-bold text-gray-500 mt-1 flex items-center">
                        <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Fechas Oficiales: Del {{ limiteInicio }} al {{ limiteFin }}
                    </p>
                </div>
                
                <div v-if="partidosOficiales.length === 0 && partidosGenerados.length === 0" class="mt-4 md:mt-0">
                    <button v-if="equiposInscritos.length === torneoSeleccionado.numero_equipos" @click="generarBrackets"
                            class="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded shadow-md hover:bg-indigo-700 transition flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        Iniciar torneo y generar la primera ronda
                    </button>
                    <div v-else class="flex items-center bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2.5 rounded-lg shadow-sm">
                        <svg class="w-5 h-5 mr-2 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span class="text-sm font-bold">Necesitan estar todos los cupos llenos del torneo para generar los partidos (Actual: {{ equiposInscritos.length }} / Requeridos: {{ torneoSeleccionado.numero_equipos }})</span>
                    </div>
                </div>

                <button v-if="sePuedeGenerarSiguienteRonda && partidosGenerados.length === 0" @click="generarBrackets"
                        class="px-6 py-2.5 bg-amber-500 text-white font-bold rounded shadow-md hover:bg-amber-600 transition mt-4 md:mt-0 flex items-center animate-pulse">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    Generar Siguiente Ronda
                </button>
            </div>

            <div v-if="campeon" class="mb-8 p-8 bg-linear-to-r from-yellow-100 via-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-2xl shadow-lg text-center animate-fade-in transform scale-100 hover:scale-105 transition-transform">
                <span class="text-6xl block mb-4">🏆</span>
                <h3 class="text-3xl font-black text-yellow-800 uppercase tracking-widest mb-2">¡TENEMOS CAMPEÓN!</h3>
                <p class="text-gray-700 font-medium">El campeón indiscutible de esta edición es:</p>
                <p class="text-4xl font-black text-indigo-900 mt-2">{{ campeon.nombre_oficial }}</p>

                <div class="mt-8 border-t border-yellow-300 pt-6">
                    <p class="text-sm text-yellow-800 mb-4 font-bold">Para poder generar reportes y estadísticas, debes cerrar el torneo oficialmente.</p>
                    <button @click="cerrarTorneo" :disabled="procesandoCierre"
                            class="bg-red-600 hover:bg-red-700 text-white font-black py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto disabled:opacity-50">
                        <svg v-if="!procesandoCierre" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        <svg v-else class="animate-spin w-5 h-5 mr-2 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        FINALIZAR Y ARCHIVAR TORNEO
                    </button>
                </div>
            </div>

            <div v-if="Object.keys(partidosPorRonda).length > 0" class="space-y-8 animate-fade-in">
                <div v-for="(partidosRonda, ronda) in partidosPorRonda" :key="ronda" class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    
                    <div class="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
                        <h4 class="text-xl font-black text-indigo-900 uppercase tracking-widest">{{ ronda }}</h4>
                        <span class="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full shadow-sm">{{ partidosRonda.length }} Partidos</span>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div v-for="partido in partidosRonda" :key="partido.id_partido" 
                            class="border rounded-xl p-5 flex flex-col justify-between transition-all"
                            :class="partido.estado === 'Finalizado' ? 'bg-white border-gray-200' : 'bg-white border-indigo-300 shadow-md'">
                            
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-2/5 text-right pr-2">
                                    <p class="font-bold text-gray-900 leading-tight text-lg">{{ partido.local_nombre }}</p>
                                    <p class="text-[10px] text-indigo-600 font-black uppercase tracking-wider mt-1">Local</p>
                                </div>
                                
                                <div class="w-1/5 text-center flex justify-center">
                                    <div v-if="partido.estado === 'Finalizado'" class="font-black text-2xl text-gray-800 bg-gray-200 px-3 py-1 rounded shadow-inner">
                                        {{ partido.marcador_local }} - {{ partido.marcador_visitante }}
                                    </div>
                                    <div v-else class="font-black text-gray-400 bg-gray-100 px-3 py-1 rounded text-sm border border-gray-200">VS</div>
                                </div>

                                <div class="w-2/5 text-left pl-2">
                                    <p class="font-bold text-gray-900 leading-tight text-lg">{{ partido.visitante_nombre }}</p>
                                    <p class="text-[10px] text-gray-500 font-black uppercase tracking-wider mt-1">Visitante</p>
                                </div>
                            </div>
                            
                            <div class="text-center text-xs font-medium text-gray-500 border-t border-gray-100 pt-3 mb-4 flex justify-center items-center">
                                <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {{ partido.fecha.split('T')[0] }} a las {{ partido.hora }} | Sede: {{ partido.nombre_cancha }}
                            </div>

                            <button v-if="partido.estado === 'Finalizado'" @click="abrirModalResumen(partido)"
                                    class="w-full py-2.5 bg-green-50 text-green-700 font-bold text-sm rounded-lg hover:bg-green-100 transition-colors border border-green-200 flex items-center justify-center">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                Mostrar Resumen del Árbitro
                            </button>
                            
                            <button v-else-if="partido.estado === 'En Juego'" disabled
                                    class="w-full py-2.5 bg-indigo-50 text-indigo-500 font-bold text-sm rounded-lg cursor-wait border border-indigo-200 flex items-center justify-center animate-pulse" title="El árbitro está dirigiendo el partido">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                En Juego - Esperando acta arbitral...
                            </button>

                            <button v-else disabled
                                    class="w-full py-2.5 bg-gray-100 text-gray-400 font-bold text-sm rounded-lg cursor-not-allowed border border-gray-200 flex items-center justify-center" title="Aún no ha llegado la fecha del encuentro">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Programado
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="partidosGenerados.length > 0" class="space-y-6 animate-fade-in mt-8">
                <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded text-sm text-amber-800 shadow-sm">
                    <strong>Paso Final:</strong> Asigna la fecha, hora y la <strong>terna arbitral</strong> completa para cada encuentro.
                </div>

                <div v-for="(p, index) in partidosGenerados" :key="index" class="bg-white border-2 border-indigo-50 rounded-xl p-5 shadow-sm">
                    <div class="flex flex-col xl:flex-row items-center justify-between gap-6">
                        
                        <div class="flex-1 flex items-center justify-center space-x-4 bg-gray-50 py-4 px-6 rounded-lg w-full border border-gray-200">
                            <div class="text-right flex-1">
                                <p class="font-black text-gray-800 text-lg">{{ p.local_nombre }}</p>
                                <p class="text-[10px] uppercase font-bold text-indigo-500 mt-1">Sede: {{ p.cancha_nombre || 'Pendiente' }}</p>
                            </div>
                            <span class="bg-gray-800 text-white font-black px-3 py-1 rounded shadow-sm">VS</span>
                            <div class="text-left flex-1">
                                <p class="font-black text-gray-800 text-lg">{{ p.visitante_nombre }}</p>
                            </div>
                        </div>

                        <div class="w-full mt-4 bg-white p-4 rounded-lg border border-gray-100">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div>
                                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Fecha</label>
                                    <input type="date" v-model="p.fecha" required :min="limiteInicio" :max="limiteFin"
                                            class="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm font-medium bg-gray-50">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Hora</label>
                                    <input type="time" v-model="p.hora" required 
                                            class="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm font-medium bg-gray-50">
                                </div>
                                
                                <div>
                                    <label class="block text-[10px] font-black text-indigo-600 uppercase mb-1">Principal *</label>
                                    <select v-model="p.id_arbitro_principal" required 
                                            class="px-3 py-2 border border-indigo-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm font-medium bg-indigo-50/50">
                                        <option value="" disabled>Seleccione...</option>
                                        <option v-for="arb in listaArbitros" :key="'prin_'+arb.id_usuario" :value="arb.id_usuario">
                                            {{ arb.nombre }} {{ arb.apellido }} (⭐ {{ arb.promedio || '0.0' }})
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Asistente 1 *</label>
                                    <select v-model="p.id_arbitro_asistente1" required 
                                            class="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm font-medium bg-gray-50">
                                        <option value="" disabled>Seleccione...</option>
                                        <option v-for="arb in listaArbitros" :key="'as1_'+arb.id_usuario" :value="arb.id_usuario">
                                            {{ arb.nombre }} {{ arb.apellido }}
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-[10px] font-black text-gray-500 uppercase mb-1">Asistente 2 *</label>
                                    <select v-model="p.id_arbitro_asistente2" required 
                                            class="px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm font-medium bg-gray-50">
                                        <option value="" disabled>Seleccione...</option>
                                        <option v-for="arb in listaArbitros" :key="'as2_'+arb.id_usuario" :value="arb.id_usuario">
                                            {{ arb.nombre }} {{ arb.apellido }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-gray-200 mt-6">
                    <button @click="partidosGenerados = []" class="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg mr-4 hover:bg-gray-300 transition">Cancelar</button>
                    <button @click="guardarCalendario" :disabled="procesando"
                            class="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition disabled:opacity-50 flex items-center">
                        <svg v-if="procesando" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {{ procesando ? 'Guardando...' : 'Confirmar y Guardar Calendario Oficial' }}
                    </button>
                </div>
            </div>

        </div>

        <ModalResumenPartido v-if="mostrarModalResumen" :partido="partidoParaResumen" @close="mostrarModalResumen = false; partidoParaResumen = null" />

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { obtenerTorneosActivosService, obtenerEquiposInscritosService, finalizarTorneoService } from '../../services/torneosService'
import { guardarPartidosMultiples, obtenerPartidosPorTorneo } from '../../services/partidosService'
import ModalResumenPartido from '../modals/ModalResumenPartido.vue'
import { obtenerUsuariosService } from '../../services/usuarioService'
import { obtenerPromedioArbitroService } from '../../services/arbitrosService'

const torneos = ref([])
const torneoSeleccionado = ref(null)
const equiposInscritos = ref([])
const partidosOficiales = ref([])
const partidosGenerados = ref([])
const procesando = ref(false)
const procesandoCierre = ref(false) 
const listaArbitros = ref([])

const mostrarModalResumen = ref(false)
const partidoParaResumen = ref(null)

const limiteInicio = computed(() => {
    if (!torneoSeleccionado.value || !torneoSeleccionado.value.fecha_inicio) return '';
    const inicioTorneo = torneoSeleccionado.value.fecha_inicio.split('T')[0];
    if (partidosOficiales.value.length > 0) {
        const fechasPartidos = partidosOficiales.value.map(p => p.fecha.split('T')[0]);
        const fechaMasAvanzada = fechasPartidos.reduce((max, actual) => actual > max ? actual : max);
        return fechaMasAvanzada > inicioTorneo ? fechaMasAvanzada : inicioTorneo;
    }
    return inicioTorneo;
});
const limiteFin = computed(() => torneoSeleccionado.value?.fecha_fin ? torneoSeleccionado.value.fecha_fin.split('T')[0] : '');

const partidosPorRonda = computed(() => {
    const grupos = {};
    partidosOficiales.value.forEach(p => {
        if (!grupos[p.ronda_torneo]) grupos[p.ronda_torneo] = [];
        grupos[p.ronda_torneo].push(p);
    });
    return grupos;
});

const partidosPendientes = computed(() => partidosOficiales.value.filter(p => p.estado !== 'Finalizado'));

const sePuedeGenerarSiguienteRonda = computed(() => {
    return partidosOficiales.value.length > 0 && 
           partidosPendientes.value.length === 0 && 
           equiposInscritos.value.length > 1;
});

const campeon = computed(() => {
    if (equiposInscritos.value.length === 1 && partidosOficiales.value.length > 0) {
        return equiposInscritos.value[0];
    }
    return null;
});

const cargarTorneos = async () => {
    try {
        const data = await obtenerTorneosActivosService()
        torneos.value = data.filter(t => t.estado !== 'Finalizado')

        const usuarios = await obtenerUsuariosService()
        const arbitros = usuarios.filter(u => u.rol === 'arbitro')
        
        const arbitrosConCalificacion = await Promise.all(
            arbitros.map(async (arb) => {
                try {
                    const stats = await obtenerPromedioArbitroService(arb.id_usuario)
                    return { ...arb, promedio: stats.promedio }
                } catch (e) {
                    return { ...arb, promedio: '0.0' } 
                }
            })
        )
        
        listaArbitros.value = arbitrosConCalificacion
    } catch (error) {
        console.error("Error al cargar torneos y árbitros:", error)
    }
}

const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    partidosGenerados.value = []
    
    try {
        partidosOficiales.value = await obtenerPartidosPorTorneo(torneo.id_torneo)
        equiposInscritos.value = await obtenerEquiposInscritosService(torneo.id_torneo)
    } catch (e) {
        console.error(e)
    }
}

const volver = () => {
    torneoSeleccionado.value = null
    partidosOficiales.value = []
    partidosGenerados.value = []
    cargarTorneos() 
}

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

const generarBrackets = () => {
    const mezclados = shuffle([...equiposInscritos.value])
    const matches = []
    
    const total = mezclados.length
    const ronda = total === 8 ? 'Cuartos de Final' : (total === 4 ? 'Semifinal' : (total === 2 ? 'Gran Final' : 'Eliminatorias'))

    for (let i = 0; i < mezclados.length; i += 2) {
        if (mezclados[i + 1]) {
            const local = mezclados[i]
            const visitante = mezclados[i + 1]
            
            matches.push({
                id_torneo: torneoSeleccionado.value.id_torneo,
                id_equipo_local: local.id_equipo,
                local_nombre: local.nombre_oficial,
                id_equipo_visitante: visitante.id_equipo,
                visitante_nombre: visitante.nombre_oficial,
                id_cancha: local.id_cancha, 
                cancha_nombre: local.nombre_cancha,
                ronda_torneo: ronda,
                fecha: '',
                hora: '',
                id_arbitro_principal: '',
                id_arbitro_asistente1: '', 
                id_arbitro_asistente2: ''  
            })
        }
    }
    partidosGenerados.value = matches
}

const validarArbitros = () => {
    const asignacionesTotales = [];

    partidosOficiales.value.forEach(p => {
        const fechaStr = p.fecha.split('T')[0];
        if (p.id_arbitro_principal) asignacionesTotales.push({ id_arb: p.id_arbitro_principal, fecha: fechaStr, hora: p.hora });
        if (p.id_arbitro_asistente1) asignacionesTotales.push({ id_arb: p.id_arbitro_asistente1, fecha: fechaStr, hora: p.hora });
        if (p.id_arbitro_asistente2) asignacionesTotales.push({ id_arb: p.id_arbitro_asistente2, fecha: fechaStr, hora: p.hora });
    });

    partidosGenerados.value.forEach(p => {
        if (p.id_arbitro_principal) asignacionesTotales.push({ id_arb: p.id_arbitro_principal, fecha: p.fecha, hora: p.hora });
        if (p.id_arbitro_asistente1) asignacionesTotales.push({ id_arb: p.id_arbitro_asistente1, fecha: p.fecha, hora: p.hora });
        if (p.id_arbitro_asistente2) asignacionesTotales.push({ id_arb: p.id_arbitro_asistente2, fecha: p.fecha, hora: p.hora });
    });

    const mapaArbitros = {};
    for (const asignacion of asignacionesTotales) {
        if (!asignacion.id_arb || !asignacion.fecha || !asignacion.hora) continue;

        const clave = `${asignacion.id_arb}_${asignacion.fecha}`;
        if (!mapaArbitros[clave]) {
            mapaArbitros[clave] = [];
        }
        const horaDate = new Date(`1970-01-01T${asignacion.hora}:00`);
        mapaArbitros[clave].push(horaDate);
    }

    for (const clave in mapaArbitros) {
        const horarios = mapaArbitros[clave];
        const [idArbitro, fecha] = clave.split('_');
        
        if (horarios.length > 2) {
            const arbitroObj = listaArbitros.value.find(a => a.id_usuario == idArbitro);
            const nombreArbitro = arbitroObj ? `${arbitroObj.nombre} ${arbitroObj.apellido}` : 'Un árbitro';
            return ` SOBRECARGA DE TRABAJO:\n\n${nombreArbitro} está asignado a ${horarios.length} partidos el día ${fecha}.\nEl límite máximo de la liga es de 2 encuentros diarios por árbitro (sin importar su rol en la cancha).`;
        }
        
        if (horarios.length === 2) {
            horarios.sort((a, b) => a - b);
            const diffMilisegundos = horarios[1] - horarios[0];
            const diffHoras = diffMilisegundos / (1000 * 60 * 60);

            if (diffHoras < 6) {
                const arbitroObj = listaArbitros.value.find(a => a.id_usuario == idArbitro);
                const nombreArbitro = arbitroObj ? `${arbitroObj.nombre} ${arbitroObj.apellido}` : 'Un árbitro';
                return ` DESCANSO INSUFICIENTE:\n\n${nombreArbitro} está asignado a 2 partidos el día ${fecha} con menos de 6 horas de diferencia.\n\nTiempo de descanso actual: ${diffHoras.toFixed(1)} horas.`;
            }
        }
    }

    return null; 
}

const guardarCalendario = async () => {
    const minStr = limiteInicio.value;
    const maxStr = limiteFin.value;

    for (const p of partidosGenerados.value) {
        if (!p.fecha || !p.hora || !p.id_arbitro_principal || !p.id_arbitro_asistente1 || !p.id_arbitro_asistente2) {
            return alert(`Falta ingresar fecha, hora o completar la terna arbitral en el partido de ${p.local_nombre} vs ${p.visitante_nombre}`);
        }
        
        if (p.id_arbitro_principal === p.id_arbitro_asistente1 || 
            p.id_arbitro_principal === p.id_arbitro_asistente2 || 
            p.id_arbitro_asistente1 === p.id_arbitro_asistente2) {
            return alert(` TERNAR INVÁLIDA:\n\nHas asignado a un mismo árbitro en múltiples posiciones para el partido de ${p.local_nombre} vs ${p.visitante_nombre}.\nPor favor, selecciona a 3 personas distintas.`);
        }

        if (p.fecha < minStr || p.fecha > maxStr) {
            return alert(`ERROR DE FECHA:\n\nEl partido ${p.local_nombre} vs ${p.visitante_nombre} tiene la fecha ${p.fecha}.\n\nDebe jugarse entre el ${minStr} y el ${maxStr}.`);
        }
    }

    const errorArbitros = validarArbitros();
    if (errorArbitros) {
        return alert(errorArbitros);
    }

    procesando.value = true
    try {
        await guardarPartidosMultiples(partidosGenerados.value)
        alert('¡Calendario y terna arbitral guardados exitosamente!')
        
        partidosOficiales.value = await obtenerPartidosPorTorneo(torneoSeleccionado.value.id_torneo)
        equiposInscritos.value = await obtenerEquiposInscritosService(torneoSeleccionado.value.id_torneo)
        partidosGenerados.value = []
    } catch (error) {
        alert(error.response?.data?.error || "Ocurrió un error al guardar los partidos.")
    } finally {
        procesando.value = false
    }
}

const abrirModalResumen = (partido) => {
    partidoParaResumen.value = partido
    mostrarModalResumen.value = true
}
const cerrarTorneo = async () => {
    if(!confirm("¿Estás seguro de finalizar y archivar este torneo? Desaparecerá de esta vista y pasará al Historial de Reportes.")) return;
    
    procesandoCierre.value = true;
    try {
        await finalizarTorneoService(torneoSeleccionado.value.id_torneo);
        alert("Torneo archivado exitosamente.");
        volver(); // Llama a la función volver para limpiar y recargar la vista principal
    } catch (error) {
        alert(error.response?.data?.error || "Error al intentar cerrar el torneo.");
    } finally {
        procesandoCierre.value = false;
    }
}

onMounted(cargarTorneos)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>