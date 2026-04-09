<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
            
            <div class="px-6 py-4 bg-green-700 text-white flex justify-between items-center shrink-0">
                <h3 class="text-lg font-black uppercase tracking-wider">Acta y Resumen Oficial</h3>
                <button @click="$emit('close')" class="text-green-200 hover:text-white transition-colors bg-green-800 rounded-full p-1.5">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto flex-1 bg-gray-50 space-y-8">
                
                <div class="flex justify-center items-center gap-6 pb-6 border-b border-gray-200 bg-white p-6 rounded-xl shadow-sm">
                    <div class="text-right flex-1">
                        <p class="font-black text-xl text-gray-900">{{ partido.local_nombre }}</p>
                        <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Local</p>
                    </div>
                    <div class="bg-gray-100 px-6 py-3 rounded-lg border border-gray-300 shadow-inner text-3xl font-black text-gray-800">
                        {{ partido.marcador_local }} - {{ partido.marcador_visitante }}
                    </div>
                    <div class="text-left flex-1">
                        <p class="font-black text-xl text-gray-900">{{ partido.visitante_nombre }}</p>
                        <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Visitante</p>
                    </div>
                </div>

                <div v-if="cargando" class="text-center py-10 text-gray-500 flex flex-col items-center">
                    <svg class="animate-spin h-8 w-8 text-green-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Cargando acta oficial...
                </div>
                
                <div v-else class="space-y-8">
                    
                    <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Informe General del Árbitro
                        </h4>
                        <p class="text-sm text-gray-700 italic bg-gray-50 p-3 rounded border border-gray-100">
                            "{{ informeTexto }}"
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div>
                            <h4 class="text-sm font-black text-indigo-700 border-b-2 border-indigo-100 pb-2 mb-3 uppercase">Puntos Local</h4>
                            <ul class="space-y-2">
                                <li v-for="j in anotadoresLocal" :key="j.id_jugador" class="flex justify-between items-center text-sm border-b border-gray-50 pb-1">
                                    <span class="text-gray-700 truncate pr-2">#{{ j.numero_camiseta }} {{ j.nombre }} {{ j.apellido }}</span>
                                    <span class="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{{ j.puntos_anotados }} pts</span>
                                </li>
                                <li v-if="anotadoresLocal.length === 0" class="text-xs text-gray-400 italic">Nadie anotó puntos.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 class="text-sm font-black text-gray-700 border-b-2 border-gray-200 pb-2 mb-3 uppercase">Puntos Visitante</h4>
                            <ul class="space-y-2">
                                <li v-for="j in anotadoresVisitante" :key="j.id_jugador" class="flex justify-between items-center text-sm border-b border-gray-50 pb-1">
                                    <span class="text-gray-700 truncate pr-2">#{{ j.numero_camiseta }} {{ j.nombre }} {{ j.apellido }}</span>
                                    <span class="font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{{ j.puntos_anotados }} pts</span>
                                </li>
                                <li v-if="anotadoresVisitante.length === 0" class="text-xs text-gray-400 italic">Nadie anotó puntos.</li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-red-50 p-5 rounded-xl border border-red-200 shadow-sm">
                        <h4 class="text-sm font-black text-red-700 uppercase tracking-widest mb-4 flex items-center border-b border-red-100 pb-2">
                            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Sanciones Disciplinarias
                        </h4>
                        
                        <div v-if="sancionesList.length === 0" class="text-sm text-red-400 italic font-medium">
                            No hubo sanciones ni expulsiones en este encuentro.
                        </div>
                        
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="(s, index) in sancionesList" :key="index" class="bg-white p-4 rounded-lg border border-red-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <p class="font-black text-gray-900 text-sm">#{{ s.numero_camiseta }} {{ s.nombre }} {{ s.apellido }}</p>
                                    <p class="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                                        Equipo: {{ s.id_equipo === partido.id_equipo_local ? partido.local_nombre : partido.visitante_nombre }}
                                    </p>
                                </div>
                                <div class="mt-3 pt-3 border-t border-red-50">
                                    <p class="text-xs font-black text-red-600 bg-red-50 inline-block px-2 py-0.5 rounded uppercase">{{ s.tipo_sancion }}</p>
                                    <p class="text-xs text-gray-600 mt-2"><span class="font-bold">Motivo:</span> {{ s.motivo }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="px-6 py-4 bg-white border-t border-gray-200 flex justify-end shrink-0">
                <button @click="$emit('close')" class="px-8 py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition shadow-md">
                    Cerrar Resumen
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { obtenerResumenPartidoService } from '../../services/partidosService'
import { obtenerUsuariosService } from '../../services/usuarioService' 

const props = defineProps({ partido: { type: Object, required: true } })
const emit = defineEmits(['close'])

const cargando = ref(true)

const resumenData = ref({ anotaciones: [], sanciones: [], informe: '' })
const listaArbitros = ref([]) 

onMounted(async () => {
    try {
        const usuarios = await obtenerUsuariosService()
        listaArbitros.value = usuarios.filter(u => u.rol === 'arbitro')

        const data = await obtenerResumenPartidoService(props.partido.id_partido)
        if (data) {
            resumenData.value = {
                anotaciones: data.anotaciones || [],
                sanciones: data.sanciones || [],
                informe: data.informe || 'No hay informe disponible.'
            }
        }
    } catch (error) {
        console.error("Error obteniendo el resumen:", error)
    } finally {
        cargando.value = false
    }
})

// 🔴 Usamos Optional Chaining (?) por seguridad
const anotadoresLocal = computed(() => resumenData.value.anotaciones?.filter(a => a.id_equipo === props.partido.id_equipo_local) || [])
const anotadoresVisitante = computed(() => resumenData.value.anotaciones?.filter(a => a.id_equipo === props.partido.id_equipo_visitante) || [])
const sancionesList = computed(() => resumenData.value.sanciones || [])
const informeTexto = computed(() => resumenData.value.informe)
</script>