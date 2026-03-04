<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="shrink-0">
                            <h1 class="text-2xl font-bold text-indigo-600">BasketPro <span class="text-sm text-gray-500 font-normal">| Panel Árbitro</span></h1>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-center space-x-4">
                            <span class="text-gray-800 text-sm font-medium px-3 py-2">
                                Hola, {{ userName }}
                            </span>
                            <button @click="logout"
                                class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
            <!-- Sidebar específico para árbitro -->
            <div class="w-64 bg-white shadow-md">
                <div class="p-4">
                    <h2 class="text-lg font-semibold text-gray-800 mb-4">Menú Árbitro</h2>
                    <nav class="space-y-2">
                        <button @click="activeTab = 'partidos'" 
                            :class="activeTab === 'partidos' ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'text-gray-600 hover:bg-gray-50 border-transparent'"
                            class="w-full text-left px-4 py-2 text-sm font-medium rounded-md border transition">
                            Mis Partidos
                        </button>
                        <button @click="activeTab = 'estadisticas'" 
                            :class="activeTab === 'estadisticas' ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'text-gray-600 hover:bg-gray-50 border-transparent'"
                            class="w-full text-left px-4 py-2 text-sm font-medium rounded-md border transition">
                            Estadísticas
                        </button>
                        <button @click="activeTab = 'perfil'" 
                            :class="activeTab === 'perfil' ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'text-gray-600 hover:bg-gray-50 border-transparent'"
                            class="w-full text-left px-4 py-2 text-sm font-medium rounded-md border transition">
                            Mi Perfil
                        </button>
                    </nav>
                </div>
            </div>

            <main class="flex-1 overflow-auto bg-gray-50">
                <div class="py-6 px-4 sm:px-6 lg:px-8">
                    
                    <!-- Sección: Mis Partidos -->
                    <div v-if="activeTab === 'partidos'" class="space-y-6 animate-fade-in">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900">Mis Partidos Asignados</h2>
                            <p class="mt-2 text-gray-600">Próximos partidos y horarios.</p>
                        </div>

                        <div class="bg-white rounded-lg shadow-md overflow-hidden">
                            <div class="p-6 border-b">
                                <h3 class="text-lg font-semibold">Próximos Partidos</h3>
                            </div>
                            <div class="overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitante</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancha</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="partido in partidosAsignados" :key="partido.id_partido" class="hover:bg-gray-50">
                                            <td class="px-6 py-4 whitespace-nowrap">{{ partido.fecha }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">{{ partido.hora }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ partido.equipo_local }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">{{ partido.equipo_visitante }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">{{ partido.cancha }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Programado</span>
                                            </td>
                                        </tr>
                                        <tr v-if="partidosAsignados.length === 0">
                                            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                                                No tienes partidos asignados actualmente.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Sección: Estadísticas -->
                    <div v-if="activeTab === 'estadisticas'" class="space-y-6 animate-fade-in">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900">Estadísticas</h2>
                            <p class="mt-2 text-gray-600">Resumen de tu desempeño.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <p class="text-gray-500 text-center py-10">Estadísticas en desarrollo...</p>
                        </div>
                    </div>

                    <!-- Sección: Perfil -->
                    <div v-if="activeTab === 'perfil'" class="space-y-6 animate-fade-in">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900">Mi Perfil</h2>
                            <p class="mt-2 text-gray-600">Información personal.</p>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-6">
                            <p class="text-gray-500 text-center py-10">Perfil en desarrollo...</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerPartidosAsignadosService } from '../services/arbitroService'

const router = useRouter()
const activeTab = ref('partidos')

const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioGuardado.nombre || 'Árbitro')
const partidosAsignados = ref([])

const cargarPartidos = async () => {
    try {
        const idArbitro = usuarioGuardado.id_usuario
        if (idArbitro) {
            partidosAsignados.value = await obtenerPartidosAsignadosService(idArbitro)
        }
    } catch (error) {
        console.error("Error cargando partidos:", error)
    }
}

onMounted(() => {
    cargarPartidos()
})

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('token')
    router.push('/login')
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>