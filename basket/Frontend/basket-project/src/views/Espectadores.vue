<template>
  <div class="min-h-screen bg-gray-50">
    
    <NavbarEspectador />

    <main class="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div class="space-y-8">
        
        <div>
          <h2 class="text-3xl font-black text-gray-900 tracking-tight">Canales de Transmisión</h2>
          <p class="mt-2 text-gray-600 font-medium">Descubre dónde ver los partidos de baloncesto en El Salvador</p>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Filtrar por Categoría</h3>
          <div class="flex flex-wrap gap-3">
            <button
              @click="filterCategory = null"
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
                filterCategory === null
                  ? 'bg-slate-900 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              Todos los canales
            </button>
            <button
              @click="filterCategory = 1"
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center',
                filterCategory === 1
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              ]"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Satelital / TV
            </button>
            <button
              @click="filterCategory = 2"
              :class="[
                'px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center',
                filterCategory === 2
                  ? 'bg-emerald-500 text-white shadow-md transform scale-105'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
              ]"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              Streaming Online
            </button>
          </div>
        </div>

        <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 font-medium">Sintonizando canales...</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="canal in filteredCanales"
            :key="canal.id_canal"
            class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all group"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 pr-4">
                <h4 class="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{{ canal.nombre_canal }}</h4>
                
                <p v-if="canal.id_tipo == 1 && canal.numero_canal" class="text-sm text-slate-500 mt-2 font-bold flex items-center">
                  <span class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 mr-2">CH {{ canal.numero_canal }}</span>
                </p>
                
                <a v-if="canal.id_tipo == 2 && canal.url_sitio" :href="canal.url_sitio" target="_blank" class="text-sm font-bold text-indigo-600 hover:text-indigo-800 mt-3 inline-flex items-center group-hover:underline">
                  Ver Transmisión 
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>

                <div class="mt-5 pt-4 border-t border-gray-100">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horarios de Transmisión</p>
                  <p class="text-sm text-gray-700 font-medium mt-1">{{ canal.horario || 'Horarios por definir' }}</p>
                </div>
              </div>
              
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm',
                  canal.id_tipo == 1
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                ]"
              >
                {{ canal.id_tipo == 1 ? 'Satelital' : 'Online' }}
              </span>
            </div>
          </div>
          
          <div v-if="filteredCanales.length === 0" class="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <p class="text-lg font-bold text-gray-600">No hay canales disponibles</p>
            <p class="text-sm text-gray-500 mt-1">No se encontraron medios de transmisión para esta categoría.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerCanalesService } from '../services/canalService' 
import NavbarEspectador from '../components/NavbarEspectador.vue'
import MisBoletos from './Espectadores/MisBoletos.vue'
import ComprarBoletos from './Espectadores/ComprarBoletos.vue'
const filterCategory = ref(null)
const canales = ref([])
const cargando = ref(true)

onMounted(async () => {
  try {
    cargando.value = true
    const data = await obtenerCanalesService()
    canales.value = data
  } catch (error) {
    console.error("Error al obtener los canales:", error)
  } finally {
    cargando.value = false
  }
})

// Filtro matemático simple usando id_tipo
const filteredCanales = computed(() => {
  // Si filterCategory es null (Todos), mostramos todos
  if (filterCategory.value === null) return canales.value;
  
  // Filtramos comparando el id_tipo directamente
  return canales.value.filter(canal => canal.id_tipo == filterCategory.value);
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>