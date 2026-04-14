<template>
  <div :class="mostrarNavbarPublico ? 'min-h-screen bg-gray-50' : 'bg-gray-50'">
    <NavbarEspectador v-if="mostrarNavbarPublico" />
  
    <main :class="mostrarNavbarPublico ? 'max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8' : 'py-4'">
      
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in">
        <div>
          <h2 class="text-3xl font-black text-gray-900 tracking-tight">Calendario de Partidos</h2>
          <p class="mt-2 text-gray-600 font-medium">Encuentra todos los días con partidos programados.</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="cambiarMes(-1)" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700">«</button>
          <div class="text-center w-40">
            <p class="text-lg font-black text-gray-800 capitalize">{{ mesNombre }} {{ anioActual }}</p>
          </div>
          <button @click="cambiarMes(1)" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700">»</button>
        </div>
      </div>

      <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p class="text-gray-500 font-medium">Cargando partidos...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-6 animate-fade-in">
        
        <div>
          <div class="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500 uppercase mb-1">
            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <div v-for="celda in calendario" :key="celda.fecha || celda.index" class="h-28 border rounded-lg p-1 bg-white relative" :class="celda.esMesActual ? 'border-gray-200' : 'border-transparent bg-gray-50'">
              <button v-if="celda.fecha" @click="seleccionarDia(celda.fecha)" class="text-left w-full h-full rounded-lg focus:outline-none transition-all" :class="selDia === celda.fecha ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'">
                <div class="flex justify-between items-start">
                  <span class="text-xs font-bold" :class="selDia === celda.fecha ? 'text-indigo-700' : 'text-slate-800'">{{ celda.dia }}</span>
                  <span v-if="partidosPorDia(celda.fecha).length > 0" class="text-[10px] px-1 py-0.5 rounded font-bold" :class="selDia === celda.fecha ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'">
                      {{ partidosPorDia(celda.fecha).length }}
                  </span>
                </div>
                <div class="mt-1 space-y-1">
                  <span v-for="p in partidosPorDia(celda.fecha).slice(0, 2)" :key="p.id_partido" 
                        class="block text-[9px] font-bold px-1 py-0.5 rounded truncate" 
                        :class="p.estado === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-700'"
                        :title="p.local_nombre + ' vs ' + p.visitante_nombre">
                    {{ p.local_siglas || p.local_nombre.substring(0,3) }} vs {{ p.visitante_siglas || p.visitante_nombre.substring(0,3) }}
                  </span>
                  <span v-if="partidosPorDia(celda.fecha).length > 2" class="block text-[10px] text-gray-500 font-bold text-center">
                      +{{ partidosPorDia(celda.fecha).length - 2 }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <aside class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 h-fit sticky top-6">
          <h3 class="font-black text-lg text-gray-800 flex items-center border-b pb-2 mb-3">
              <svg class="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Partidos del Día
          </h3>
          <p class="text-sm font-bold text-indigo-600 mb-4 capitalize bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">
              {{ selDia ? formatFechaLarga(selDia) : 'Seleccione una fecha' }}
          </p>

          <div v-if="!selDia" class="text-gray-400 italic text-sm text-center py-10 border-2 border-dashed rounded-xl">
              Haz clic en cualquier día con partidos en el calendario para ver los detalles.
          </div>

          <div v-else>
            <div v-if="partidosSeleccionados.length === 0" class="text-gray-500 text-sm text-center py-8">No hay encuentros programados.</div>

            <div v-else class="space-y-4 max-h-150 overflow-y-auto pr-2">
              <div v-for="partido in partidosSeleccionados" :key="partido.id_partido" class="border border-gray-100 rounded-xl p-4 shadow-sm bg-gray-50 hover:border-indigo-200 transition-colors group">
                
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-black text-gray-500 uppercase">{{ formatHora(partido.hora) }}</span>
                    <span v-if="partido.estado === 'Finalizado'" class="text-[9px] bg-green-500 text-white font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">Finalizado</span>
                    <span v-else-if="partido.estado === 'En Juego'" class="text-[9px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider animate-pulse">En Juego</span>
                </div>
                
                <div class="flex justify-between items-center my-2">
                    <div class="w-[45%] text-right font-black text-sm truncate" :title="partido.local_nombre">{{ partido.local_nombre }}</div>
                    <div class="w-[10%] text-center text-xs font-black text-gray-400">VS</div>
                    <div class="w-[45%] text-left font-black text-sm truncate" :title="partido.visitante_nombre">{{ partido.visitante_nombre }}</div>
                </div>

                <div class="text-[10px] text-gray-500 border-t border-gray-200 pt-2 mt-2">
                    <p class="font-bold text-indigo-700 truncate">{{ partido.nombre_torneo }}</p>
                    <p class="truncate">{{ partido.ronda_torneo }} | Sede: {{ partido.nombre_cancha || 'Por definir' }}</p>
                </div>

                <div class="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button v-if="partido.estado === 'Finalizado'" @click="abrirFichaTecnica(partido)" 
                            class="w-full text-xs font-black text-green-700 bg-green-100 py-2 rounded-lg hover:bg-green-200 transition-colors shadow-sm flex justify-center items-center">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Ver Resultados
                    </button>
                    
                </div>

              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <div v-if="modalAbierto && fichaActual" class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                <div>
                    <h3 class="font-black tracking-widest uppercase text-sm text-indigo-400 mb-1">{{ fichaActual.partido.nombre_torneo }} - {{ fichaActual.partido.ronda_torneo }}</h3>
                    <p class="text-xs text-gray-400">{{ formatFechaLarga(fichaActual.partido.fecha) }} | Sede: {{ fichaActual.partido.nombre_cancha }}</p>
                </div>
                <button @click="cerrarFicha" class="text-gray-400 hover:text-white transition-colors bg-slate-800 rounded-full p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                <div v-if="cargandoFicha" class="text-center py-10">
                    <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="text-gray-500 font-medium text-sm">Cargando estadísticas oficiales...</p>
                </div>
                <div v-else>
                    <div class="flex items-center justify-center gap-4 md:gap-8 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div class="text-center flex-1">
                            <h4 class="text-xl md:text-3xl font-black text-gray-900">{{ fichaActual.partido.local_nombre }}</h4>
                            <p class="text-xs font-bold text-gray-500 uppercase mt-1">Local</p>
                        </div>
                        <div class="bg-indigo-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-4xl md:text-6xl font-black shadow-inner tracking-widest border-4 border-indigo-400">
                            {{ fichaActual.partido.marcador_local }} - {{ fichaActual.partido.marcador_visitante }}
                        </div>
                        <div class="text-center flex-1">
                            <h4 class="text-xl md:text-3xl font-black text-gray-900">{{ fichaActual.partido.visitante_nombre }}</h4>
                            <p class="text-xs font-bold text-gray-500 uppercase mt-1">Visitante</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                <h5 class="font-black text-gray-800 uppercase tracking-widest text-sm">{{ fichaActual.partido.local_nombre }}</h5>
                            </div>
                            <table class="w-full text-left text-sm">
                                <thead class="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase border-b border-gray-200">
                                    <tr><th class="px-4 py-2">Jugador</th><th class="px-4 py-2 text-right text-indigo-600">Pts</th></tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="j in fichaActual.alineacionLocal" :key="j.id_jugador" class="hover:bg-gray-50">
                                        <td class="px-4 py-2.5 flex items-center">
                                            <span class="text-xs font-black text-gray-400 w-5 mr-2">{{ j.numero_camiseta }}</span>
                                            <span class="font-medium text-gray-900">{{ j.nombre }} {{ j.apellido }}</span>
                                            <span v-if="j.es_capitan" class="ml-1 text-[9px] bg-amber-400 text-amber-900 px-1 py-0.5 rounded font-bold shrink-0" title="Capitán">©</span>
                                        </td>
                                        <td class="px-4 py-2.5 text-right font-black text-indigo-600 text-sm">{{ j.puntos_anotados || 0 }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                <h5 class="font-black text-gray-800 uppercase tracking-widest text-sm">{{ fichaActual.partido.visitante_nombre }}</h5>
                            </div>
                            <table class="w-full text-left text-sm">
                                <thead class="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase border-b border-gray-200">
                                    <tr><th class="px-4 py-2">Jugador</th><th class="px-4 py-2 text-right text-indigo-600">Pts</th></tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="j in fichaActual.alineacionVisitante" :key="j.id_jugador" class="hover:bg-gray-50">
                                        <td class="px-4 py-2.5 flex items-center">
                                            <span class="text-xs font-black text-gray-400 w-5 mr-2">{{ j.numero_camiseta }}</span>
                                            <span class="font-medium text-gray-900">{{ j.nombre }} {{ j.apellido }}</span>
                                            <span v-if="j.es_capitan" class="ml-1 text-[9px] bg-amber-400 text-amber-900 px-1 py-0.5 rounded font-bold shrink-0" title="Capitán">©</span>
                                        </td>
                                        <td class="px-4 py-2.5 text-right font-black text-indigo-600 text-sm">{{ j.puntos_anotados || 0 }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="modalRosterAbierto && partidoRosterActual" class="fixed inset-0 z-120 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                
                <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h3 class="font-black tracking-widest uppercase text-sm text-indigo-400 mb-1">Previa del Encuentro</h3>
                        <p class="text-xs text-gray-400">{{ partidoRosterActual.local_nombre }} vs {{ partidoRosterActual.visitante_nombre }}</p>
                    </div>
                    <button @click="cerrarRosters" class="text-gray-400 hover:text-white transition-colors bg-slate-800 rounded-full p-1">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div v-if="cargandoRosters" class="text-center py-10">
                        <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p class="text-gray-500 font-medium text-sm">Buscando información de los equipos...</p>
                    </div>

                    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 text-center">
                                <h5 class="font-black text-gray-800 uppercase tracking-widest text-sm">{{ partidoRosterActual.local_nombre }}</h5>
                                <span class="text-[10px] font-bold text-gray-500 uppercase">Local</span>
                            </div>
                            <div class="p-4">
                                <p v-if="rosterLocal.length === 0" class="text-center text-gray-400 text-sm italic py-4">Roster no disponible.</p>
                                <ul v-else class="space-y-3">
                                    <li v-for="j in rosterLocal" :key="j.id_jugador" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black mr-3">{{ j.numero_camiseta || '#' }}</div>
                                            <div>
                                                <p class="font-bold text-gray-900 text-sm">{{ j.nombre }} {{ j.apellido }}</p>
                                                <p class="text-[10px] text-gray-500 uppercase font-medium">{{ j.posicion || 'N/A' }}</p>
                                            </div>
                                        </div>
                                        <span v-if="j.es_capitan" class="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded shadow-sm">© Capitán</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200 text-center">
                                <h5 class="font-black text-gray-800 uppercase tracking-widest text-sm">{{ partidoRosterActual.visitante_nombre }}</h5>
                                <span class="text-[10px] font-bold text-gray-500 uppercase">Visitante</span>
                            </div>
                            <div class="p-4">
                                <p v-if="rosterVisitante.length === 0" class="text-center text-gray-400 text-sm italic py-4">Roster no disponible.</p>
                                <ul v-else class="space-y-3">
                                    <li v-for="j in rosterVisitante" :key="j.id_jugador" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div class="flex items-center">
                                            <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black mr-3">{{ j.numero_camiseta || '#' }}</div>
                                            <div>
                                                <p class="font-bold text-gray-900 text-sm">{{ j.nombre }} {{ j.apellido }}</p>
                                                <p class="text-[10px] text-gray-500 uppercase font-medium">{{ j.posicion || 'N/A' }}</p>
                                            </div>
                                        </div>
                                        <span v-if="j.es_capitan" class="bg-yellow-100 text-yellow-800 text-[10px] font-black px-2 py-1 rounded shadow-sm">© Capitán</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted,computed, onMounted } from 'vue'
import NavbarEspectador from '../../components/NavbarEspectador.vue'

// 🔴 Importaciones agregadas para los modales
import { obtenerPartidosPublicosService, obtenerFichaTecnicaPublicaService } from '../../services/partidosService'
import { obtenerRosterPublicoService } from '../../services/inscripcionesService'

const cargando = ref(true)
const partidos = ref([])
const hoy = new Date()
const mesActual = ref(hoy.getMonth())
const anioActual = ref(hoy.getFullYear())
const selDia = ref('')

// 🔴 Variables Modales
const modalAbierto = ref(false)
const cargandoFicha = ref(false)
const fichaActual = ref(null)

const modalRosterAbierto = ref(false)
const cargandoRosters = ref(false)
const partidoRosterActual = ref(null)
const rosterLocal = ref([])
const rosterVisitante = ref([])

const props = defineProps({
  esAdmin: {
    type: Boolean,
    default: false
  }
})

const mostrarNavbarPublico = computed(() => !props.esAdmin)

const cargarPartidos = async () => {
  try {
    const data = await obtenerPartidosPublicosService()
    partidos.value = data || []
  } catch (error) {
    console.error('Error cargando partidos:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(cargarPartidos)

const obtenerDiasMes = (mes, anio) => {
  const primerDia = new Date(anio, mes, 1)
  const ultimoDia = new Date(anio, mes + 1, 0)
  const diasPrevios = (primerDia.getDay() + 6) % 7 
  const totalCeldas = 42
  const dias = []

  for (let i = 0; i < totalCeldas; i++) {
    const numero = i - diasPrevios + 1
    const fecha = new Date(anio, mes, numero)
    const esMesActual = numero > 0 && numero <= ultimoDia.getDate()

    dias.push({
      index: i,
      fecha: esMesActual ? fecha.toISOString().substring(0, 10) : null,
      dia: esMesActual ? fecha.getDate() : '',
      esMesActual
    })
  }
  return dias
}

const calendario = computed(() => obtenerDiasMes(mesActual.value, anioActual.value))

const partidosPorFecha = computed(() => {
  const map = {}
  partidos.value.forEach(p => {
    if (!p.fecha) return
    const date = new Date(p.fecha)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    const key = date.toISOString().substring(0, 10)
    if (!map[key]) map[key] = []
    map[key].push(p)
  })
  return map
})

const partidosPorDia = (fecha) => {
  return partidosPorFecha.value[fecha] || []
}

const mesNombre = computed(() => new Date(anioActual.value, mesActual.value).toLocaleDateString('es-ES', { month: 'long' }))

const cambiarMes = (offset) => {
  const nuevaFecha = new Date(anioActual.value, mesActual.value + offset)
  anioActual.value = nuevaFecha.getFullYear()
  mesActual.value = nuevaFecha.getMonth()
  selDia.value = ''
}

const seleccionarDia = (fecha) => {
  selDia.value = fecha
}

const partidosSeleccionados = computed(() => (selDia.value ? partidosPorDia(selDia.value) : []))

const formatFechaLarga = (fechaStr) => {
  if (!fechaStr) return ''
  const date = new Date(fechaStr)
  const offset = date.getTimezoneOffset();
  date.setMinutes(date.getMinutes() + offset);
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const formatHora = (hora) => {
  if (!hora) return 'Hora no definida'
  return hora.substring(0, 5) // Solo horas y minutos
}

// 🔴 LÓGICA DE LOS MODALES
const abrirFichaTecnica = async (partido) => {
    modalAbierto.value = true;
    cargandoFicha.value = true;
    fichaActual.value = { partido: partido };
    
    try {
        const detalles = await obtenerFichaTecnicaPublicaService(partido.id_partido);
        
        fichaActual.value = {
            partido: partido,
            alineacionLocal: detalles.alineacionLocal || [],
            alineacionVisitante: detalles.alineacionVisitante || [],
            sanciones: detalles.sanciones || []
        }
    } catch (error) {
        alert("Ocurrió un error al cargar la ficha técnica del partido.");
        modalAbierto.value = false;
    } finally {
        cargandoFicha.value = false;
    }
}

const cerrarFicha = () => {
    modalAbierto.value = false;
    setTimeout(() => { fichaActual.value = null; }, 300);
}

const abrirRostersPartido = async (partido) => {
    modalRosterAbierto.value = true;
    cargandoRosters.value = true;
    partidoRosterActual.value = partido;
    rosterLocal.value = [];
    rosterVisitante.value = [];

    try {
        const idLocal = partido.id_equipo_local || partido.id_local;
        const idVisitante = partido.id_equipo_visitante || partido.id_visitante;

        const [resLocal, resVisitante] = await Promise.all([
            obtenerRosterPublicoService(partido.id_torneo, idLocal),
            obtenerRosterPublicoService(partido.id_torneo, idVisitante)
        ]);
        
        rosterLocal.value = resLocal || [];
        rosterVisitante.value = resVisitante || [];
        
    } catch (error) {
        alert("Ocurrió un error al cargar los rosters.");
        modalRosterAbierto.value = false;
    } finally {
        cargandoRosters.value = false;
    }
}

const cerrarRosters = () => {
    modalRosterAbierto.value = false;
    setTimeout(() => { 
        partidoRosterActual.value = null;
        rosterLocal.value = [];
        rosterVisitante.value = [];
    }, 300);
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>