<template>
    <div class="flex min-h-screen bg-gray-50">
        
        <SidebarArbitro :activeTab="activeTab" @navigate="navigateTo" />

        <main class="flex-1 flex flex-col h-screen overflow-hidden">
            
            <header class="bg-white shadow-sm border-b border-gray-200 shrink-0">
                <div class="px-6 py-4 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800">Panel Principal</h2>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black">
                                {{ userName.charAt(0).toUpperCase() }}
                            </div>
                            <span class="text-gray-700 font-medium">Hola, {{ userName }}</span>
                        </div>
                        <button @click="logout" class="text-gray-500 hover:text-red-500 transition-colors text-sm font-bold bg-gray-100 px-3 py-1.5 rounded-lg">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <div class="flex-1 overflow-auto p-6 md:p-8">
                <div class="max-w-7xl mx-auto h-full relative">
                    
                    <div v-if="activeTab === 'inicio'" class="h-full animate-fade-in">
                        <MisPartidosArbitro />
                    </div>

                    <div v-if="activeTab === 'historial'" class="h-full animate-fade-in">
                        <HistorialArbitro />
                    </div>

                    <div v-if="activeTab === 'evaluaciones'" class="h-full animate-fade-in">
                        <EvaluacionesArbitro />
                    </div>

                    <div v-if="activeTab === 'perfil'" class="h-full animate-fade-in">
                        <PerfilArbitro @perfil-actualizado="userName = $event" />
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SidebarArbitro from '../components/SidebarArbitro.vue'
import MisPartidosArbitro from './Arbitro/MisPartidos.vue'
import HistorialArbitro from './Arbitro/HistorialArbitro.vue'
import EvaluacionesArbitro from './Arbitro/EvaluacionesArbitro.vue'
import PerfilArbitro from './Arbitro/PerfilArbitro.vue'
const router = useRouter()
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioGuardado.nombre || 'Árbitro')
const activeTab = ref('inicio')
const navigateTo = (tab) => {
    activeTab.value = tab
}

const logout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario')
        localStorage.removeItem('usuario_id')
        localStorage.removeItem('token')
        router.push('/login')
    }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>