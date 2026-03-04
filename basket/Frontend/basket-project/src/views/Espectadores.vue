<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="shrink-0">
              <h1 class="text-2xl font-bold text-indigo-600">BasketPro</h1>
            </div>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-center space-x-4">
              <router-link to="/login" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Iniciar Sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Canales de Transmisión</h2>
          <p class="mt-2 text-gray-600">Descubre dónde ver los partidos de baloncesto en El Salvador</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Filtrar por Categoría</h3>
          <div class="flex flex-wrap gap-4">
            <button
              @click="filterCategory = null"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                filterCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Todos
            </button>
            <button
              @click="filterCategory = 'satelital'"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                filterCategory === 'satelital'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Satelital
            </button>
            <button
              @click="filterCategory = 'online'"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                filterCategory === 'online'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              Online
            </button>
          </div>
        </div>

        <div v-if="cargando" class="text-center py-10">
            <p class="text-gray-500">Cargando canales...</p>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="canal in filteredCanales"
            :key="canal.id_canal"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 pr-4">
                <h4 class="text-xl font-semibold text-gray-900">{{ canal.nombre_canal }}</h4>
                
                <p v-if="canal.numero_canal" class="text-sm text-gray-600 mt-1 font-medium">
                  Canal: {{ canal.numero_canal }}
                </p>
                
                <a v-if="canal.url_sitio" :href="canal.url_sitio" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 block truncate">
                  {{ canal.url_sitio }}
                </a>

                <div class="mt-4">
                  <p class="text-sm font-medium text-gray-700">Horarios de Transmisión:</p>
                  <p class="text-sm text-gray-600 mt-1">{{ canal.horario || 'Horarios por definir' }}</p>
                </div>
              </div>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border',
                  canal.tipo_canal === 'satelital'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-green-50 text-green-700 border-green-200'
                ]"
              >
                {{ canal.tipo_canal }}
              </span>
            </div>
          </div>
          
          <div v-if="filteredCanales.length === 0" class="col-span-full text-center py-10">
            <p class="text-gray-500">No se encontraron canales para esta categoría.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { obtenerCanalesService } from '../services/canalService' 

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

const filteredCanales = computed(() => {
  if (!filterCategory.value) return canales.value
  return canales.value.filter(canal => canal.tipo_canal === filterCategory.value)
})
</script>