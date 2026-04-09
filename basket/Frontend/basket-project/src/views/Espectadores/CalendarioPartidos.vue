<template>
  <div :class="mostrarNavbarPublico ? 'min-h-screen bg-gray-50' : 'bg-gray-50'">
    <NavbarEspectador v-if="mostrarNavbarPublico" />
  
    <main :class="mostrarNavbarPublico ? 'max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8' : 'py-4'">
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 class="text-3xl font-black text-gray-900 tracking-tight">Calendario de Partidos</h2>
          <p class="mt-2 text-gray-600 font-medium">Encuentra todos los días con partidos programados.</p>
        </div>

        <div class="flex items-center gap-2">
          <button @click="cambiarMes(-1)" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700">«</button>
          <div class="text-center">
            <p class="text-lg font-black text-gray-800">{{ mesNombre }} {{ anioActual }}</p>
          </div>
          <button @click="cambiarMes(1)" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700">»</button>
        </div>
      </div>

      <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p class="text-gray-500 font-medium">Cargando partidos...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-6">
        <div>
          <div class="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-500 uppercase mb-1">
            <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
          </div>

          <div class="grid grid-cols-7 gap-1">
            <div v-for="celda in calendario" :key="celda.fecha || celda.index" class="h-28 border rounded-lg p-1 bg-white relative" :class="celda.esMesActual ? 'border-gray-200' : 'border-transparent bg-gray-50'">
              <button v-if="celda.fecha" @click="seleccionarDia(celda.fecha)" class="text-left w-full h-full rounded-lg focus:outline-none" :class="selDia === celda.fecha ? 'ring-2 ring-indigo-500' : ''">
                <div class="flex justify-between items-start">
                  <span class="text-xs font-bold text-slate-800">{{ celda.dia }}</span>
                  <span v-if="partidosPorDia(celda.fecha).length > 0" class="text-[10px] px-1 py-0.5 rounded bg-indigo-100 text-indigo-700">{{ partidosPorDia(celda.fecha).length }}</span>
                </div>
                <div class="mt-1 space-y-1">
                  <span v-for="p in partidosPorDia(celda.fecha).slice(0, 2)" :key="p.id_partido" class="block text-[10px] py-0.5 rounded bg-slate-200 text-slate-700 truncate" :title="p.local_nombre + ' vs ' + p.visitante_nombre">
                    {{ p.local_nombre }} vs {{ p.visitante_nombre }}
                  </span>
                  <span v-if="partidosPorDia(celda.fecha).length > 2" class="block text-[10px] text-gray-500">+{{ partidosPorDia(celda.fecha).length - 2 }} más</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <aside class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 h-fit">
          <h3 class="font-black text-md text-gray-800">Partidos del día</h3>
          <p class="text-sm text-gray-500 mt-1 mb-3">{{ selDia ? formatFechaLarga(selDia) : 'Selecciona un día' }}</p>

          <div v-if="!selDia" class="text-gray-400 italic">Haz clic en cualquier día con partidos para ver los detalles.</div>

          <div v-else>
            <div v-if="partidosSeleccionados.length === 0" class="text-gray-500">No hay partidos programados para esta fecha.</div>

            <div v-else class="space-y-3">
              <div v-for="partido in partidosSeleccionados" :key="partido.id_partido" class="border border-gray-100 rounded-lg p-3 shadow-sm">
                <p class="text-sm font-bold text-gray-800">{{ formatHora(partido.hora) }} - {{ partido.local_nombre }} vs {{ partido.visitante_nombre }}</p>
                <p class="text-xs text-gray-500">{{ partido.nombre_torneo }} • {{ partido.ronda_torneo }}</p>
                <p class="text-xs text-slate-600 mt-1">Sede: {{ partido.nombre_cancha || 'Por definir' }}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onUnmounted,computed, onMounted } from 'vue'
import NavbarEspectador from '../../components/NavbarEspectador.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import { obtenerPartidosPublicosService } from '../../services/partidosService'

const cargando = ref(true)
const partidos = ref([])
const hoy = new Date()
const mesActual = ref(hoy.getMonth())
const anioActual = ref(hoy.getFullYear())
const selDia = ref('')

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


const props = defineProps({
  esAdmin: {
    type: Boolean,
    default: false
  }
})

const mostrarNavbarPublico = computed(() => !props.esAdmin)
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
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const formatHora = (hora) => {
  if (!hora) return 'Hora no definida'
  return hora
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
