<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
            
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Equipos Disponibles</h2>
                <p class="text-lg text-gray-600 mb-8">Selecciona un equipo sin entrenador para asumir su dirección, o crea uno nuevo desde cero.</p>
                
                <div class="flex justify-center space-x-4">
                    <button @click="$router.push('/crear-equipo')" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm">
                        Crear Nuevo Equipo
                    </button>
                    <button @click="$router.push('/entrenador')" class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition shadow-sm">
                        Volver al Panel
                    </button>
                </div>
            </div>

            <div v-if="cargando" class="text-center py-20">
                <p class="text-gray-500">Buscando equipos disponibles...</p>
            </div>

            <div v-else-if="equiposLibres.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="equipo in equiposLibres" :key="equipo.id_equipo" class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">{{ equipo.nombre_oficial }}</h3>
                            <span class="text-sm font-medium text-indigo-600">{{ equipo.siglas }}</span>
                        </div>
                        <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full capitalize">
                            {{ equipo.clasificacion }}
                        </span>
                    </div>
                    
                    <div class="space-y-2 mb-6">
                        <p class="text-sm text-gray-600 flex items-center">
                            <svg class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {{ equipo.direccion_cancha || 'Sede por definir' }}
                        </p>
                    </div>

                    <button @click="asumirEquipo(equipo)" class="w-full px-4 py-2 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition">
                        Asumir Dirección
                    </button>
                </div>
            </div>

            <div v-else class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-medium text-gray-900 mb-2">No hay equipos libres</h3>
                <p class="text-gray-500">Actualmente todos los equipos registrados tienen un entrenador asignado.</p>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../Enviroments/enviroment'

const router = useRouter()
const equiposLibres = ref([])
const cargando = ref(true)

const cargarEquiposLibres = async () => {
    try {
        const response = await api.get('/equipos/libres/disponibles')
        equiposLibres.value = response.data
        console.log('Respuesta equipos libres:', response.data)
    } catch (error) {
        console.error("Error al cargar equipos libres:", error)
    } finally {
        cargando.value = false
    }
}

const asumirEquipo = async (equipo) => {
    const confirmacion = confirm(`¿Estás seguro que deseas asumir la dirección de ${equipo.nombre_oficial}?`)
    if (!confirmacion) return

    try {
        const id_entrenador = localStorage.getItem('usuario_id') 
        
        await api.post(`/equipos/${equipo.id_equipo}/unirse`, { id_entrenador })
        
        alert('¡Felicidades! Ahora eres el entrenador de este equipo.')
        router.push('/entrenador')
    } catch (error) {
        console.error(" ERROR DETALLADO AL UNIRSE:", error.response || error);
        alert(error.response?.data?.error || 'Ocurrió un error al intentar unirte al equipo.')
    }
}

onMounted(() => {
    cargarEquiposLibres()
})
</script>