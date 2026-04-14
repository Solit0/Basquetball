<template>
    <div class="min-h-screen bg-gray-50">
        
        <NavbarEspectador />

        <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
            
            <div class="mb-8">
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">Horarios de Emisión</h2>
                <p class="mt-2 text-gray-600 font-medium">Sintoniza tus partidos favoritos. Selecciona un canal para ver su programación oficial.</p>
            </div>

            <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-gray-500 font-medium">Cargando canales...</p>
            </div>

            <div v-else-if="canales.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <p class="text-lg font-bold text-gray-600">No hay canales disponibles</p>
                <p class="text-sm text-gray-500 mt-1">Actualmente no contamos con medios de transmisión asociados.</p>
            </div>

            <div v-else class="flex flex-col lg:flex-row gap-8">
                
                <div class="lg:w-1/3 flex flex-col gap-3">
                    <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Medios Oficiales</h3>
                    
                    <button v-for="canal in canales" :key="canal.id_canal" @click="seleccionarCanal(canal)"
                            class="w-full text-left p-5 rounded-2xl border-2 transition-all transform hover:-translate-y-1 relative overflow-hidden"
                            :class="canalSeleccionado?.id_canal === canal.id_canal ? 'bg-slate-900 border-slate-900 shadow-lg text-white' : 'bg-white border-gray-200 hover:border-indigo-300 text-gray-800 shadow-sm'">
                        
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="text-xl font-black mb-1">{{ canal.nombre_canal }}</h4>
                                <p v-if="canal.tipo_canal === 'satelital'" class="text-xs font-bold opacity-80 flex items-center">
                                    <span class="px-1.5 py-0.5 bg-white/20 rounded mr-1">CH</span> {{ canal.numero_canal }}
                                </p>
                                <p v-else class="text-xs font-bold opacity-80 flex items-center truncate max-w-50">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                    {{ canal.url_sitio }}
                                </p>
                            </div>
                            
                            <span :class="canal.tipo_canal === 'satelital' ? (canalSeleccionado?.id_canal === canal.id_canal ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800') : (canalSeleccionado?.id_canal === canal.id_canal ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800')" 
                                  class="text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider">
                                {{ canal.tipo_canal }}
                            </span>
                        </div>
                    </button>
                </div>

                <div class="lg:w-2/3">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-125">
                        
                        <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                            <h3 class="text-xl font-black text-indigo-900 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Programación: {{ canalSeleccionado?.nombre_canal }}
                            </h3>
                            <a v-if="canalSeleccionado?.tipo_canal === 'online' && canalSeleccionado?.url_sitio" :href="canalSeleccionado.url_sitio" target="_blank"
                               class="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition flex items-center border border-indigo-200">
                                Ir a la Transmisión
                                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                        </div>

                        <!-- ✅ FILTROS AGREGADOS -->
                        <div class="flex flex-col sm:flex-row gap-3 mb-6">
                            <!-- Barra de búsqueda -->
                            <div class="relative flex-1">
                                <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <input v-model="busqueda" type="text" placeholder="Buscar por equipo o día..."
                                    class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                            </div>

                            <!-- Filtro de orden -->
                            <select v-model="orden" class="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                <option value="recientes">Más recientes primero</option>
                                <option value="antiguos">Más antiguos primero</option>
                            </select>

                            <!-- Formato de hora -->
                            <select v-model="formatoHora" class="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                <option value="24h">Formato 24h</option>
                                <option value="ampm">Formato AM/PM</option>
                            </select>
                        </div>

                        <div v-if="cargandoCartelera" class="text-center py-20">
                            <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <p class="text-gray-500 font-medium">Actualizando guía de televisión...</p>
                        </div>

                        <div v-else-if="carteleraFiltrada.length === 0" class="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <p class="text-gray-600 font-bold">Sin resultados</p>
                            <p class="text-sm text-gray-500 mt-1">No se encontraron partidos con ese criterio de búsqueda.</p>
                        </div>

                        <div v-else class="space-y-6">
                            <div v-for="partido in carteleraFiltrada" :key="partido.id_transmision" 
                                 class="border border-gray-200 rounded-xl p-0 overflow-hidden shadow-sm hover:shadow-md transition-all">
                                
                                <div class="bg-gray-100 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <span class="text-[10px] font-black text-gray-500 uppercase tracking-widest">{{ partido.torneo_nombre }}</span>
                                    <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded shadow-sm border border-indigo-100 flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {{ formatFecha(partido.fecha) }}
                                    </span>
                                </div>

                                <div class="p-5">
                                    <div class="flex items-center justify-between mb-6">
                                        <div class="w-2/5 text-right">
                                            <p class="font-black text-gray-900 text-lg md:text-xl truncate" :title="partido.local_nombre">{{ partido.local_nombre }}</p>
                                            <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Local</p>
                                        </div>
                                        <div class="w-1/5 text-center">
                                            <span class="bg-slate-900 text-white font-black px-3 py-1.5 rounded-lg text-sm shadow-inner">VS</span>
                                        </div>
                                        <div class="w-2/5 text-left">
                                            <p class="font-black text-gray-900 text-lg md:text-xl truncate" :title="partido.visitante_nombre">{{ partido.visitante_nombre }}</p>
                                            <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Visitante</p>
                                        </div>
                                    </div>

                                    <div class="flex flex-col sm:flex-row justify-between items-stretch gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                                        <div class="flex items-center bg-white px-4 py-2 rounded-lg border border-red-200 shadow-sm flex-1">
                                            <span class="relative flex h-3 w-3 mr-3 shrink-0">
                                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                            </span>
                                            <div>
                                                <p class="text-[10px] font-black text-red-500 uppercase tracking-wider">La Previa Inicia</p>
                                                <p class="text-lg font-black text-red-800">{{ formatHora(partido.hora_transmision) }}</p>
                                            </div>
                                        </div>

                                        <div class="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex-1">
                                            <svg class="w-5 h-5 mr-3 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <div>
                                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-wider">Salto Inicial</p>
                                                <p class="text-lg font-black text-gray-800">{{ formatHora(partido.hora_partido) }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavbarEspectador from '@/components/NavbarEspectador.vue'
import { obtenerCanalesService, obtenerTransmisionesPorCanalService } from '@/services/canalService'

const canales = ref([])
const canalSeleccionado = ref(null)
const cartelera = ref([])
const cargando = ref(true)
const cargandoCartelera = ref(false)

// ✅ Variables de filtros
const busqueda = ref('')
const orden = ref('recientes')
const formatoHora = ref('24h')

onMounted(async () => {
    try {
        cargando.value = true
        const data = await obtenerCanalesService()
        canales.value = data
        if (data.length > 0) {
            seleccionarCanal(data[0])
        }
    } catch (error) {
        console.error("Error al obtener los canales:", error)
    } finally {
        cargando.value = false
    }
})

const seleccionarCanal = async (canal) => {
    canalSeleccionado.value = canal
    busqueda.value = '' // ✅ Limpiar búsqueda al cambiar canal
    try {
        cargandoCartelera.value = true
        cartelera.value = await obtenerTransmisionesPorCanalService(canal.id_canal)
    } catch (error) {
        console.error("Error al obtener la cartelera:", error)
        cartelera.value = []
    } finally {
        cargandoCartelera.value = false
    }
}

// ✅ Cartelera filtrada y ordenada
const carteleraFiltrada = computed(() => {
    let resultado = [...cartelera.value]

    // Filtro por búsqueda (equipo o día)
    if (busqueda.value.trim()) {
        const texto = busqueda.value.toLowerCase()
        resultado = resultado.filter(p => {
            const diaFormateado = formatFecha(p.fecha).toLowerCase()
            return (
                p.local_nombre?.toLowerCase().includes(texto) ||
                p.visitante_nombre?.toLowerCase().includes(texto) ||
                diaFormateado.includes(texto)
            )
        })
    }

    // Ordenar por fecha y hora
    resultado.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora_partido}`)
        const fechaB = new Date(`${b.fecha}T${b.hora_partido}`)
        return orden.value === 'recientes' ? fechaB - fechaA : fechaA - fechaB
    })

    return resultado
})

// ✅ Formato de hora consistente (24h o AM/PM)
const formatHora = (hora) => {
    if (!hora) return 'Por definir'
    const [hh, mm] = hora.substring(0, 5).split(':')
    if (formatoHora.value === 'ampm') {
        const h = parseInt(hh)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const hora12 = h % 12 || 12
        return `${hora12}:${mm} ${ampm}`
    }
    return `${hh}:${mm} hrs`
}

const formatFecha = (fechaString) => {
    if (!fechaString) return ''
    const date = new Date(fechaString)
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() + offset)
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>