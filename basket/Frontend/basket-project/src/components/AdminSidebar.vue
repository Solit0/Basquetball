<template>
    <!--ruta del archivo: Frontend/basket-project/src/components/AdminSidebar.vue -->
    <aside class="w-full md:w-64 bg-white shadow-md md:min-h-[calc(100vh-64px)]">
        <div class="p-4">
            <h2 class="text-xs uppercase text-gray-400 font-bold tracking-wider mb-4">Menú de Administración</h2>
            <nav class="space-y-2">
                <button @click="$emit('navigate', 'canales')"
                    :class="['w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        activeTab === 'canales' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Gestión de Canales
                </button>

                <button @click="$emit('navigate', 'cuentas')"
                    :class="['w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        activeTab === 'cuentas' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Gestión de Cuentas
                </button>

                <button @click="$emit('navigate', 'torneo')"
                    :class="['w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        activeTab === 'torneo' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Crear Torneo
                </button>
                <button @click="$emit('navigate', 'partidos')"
                    :class="['w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        activeTab === 'partidos' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Gestión de Partidos
                </button>
                <button @click="$emit('navigate', 'gestion-torneos')"
                    :class="['w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        activeTab === 'gestion-torneos' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Editar torneos
                </button>
                <button @click="$emit('navigate', 'perfil')"
                    :class="['w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                        activeTab === 'perfil' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900']">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                </button>
            </nav>
        </div>
    </aside>
</template>

<script setup>
defineProps({
    activeTab: {
        type: String,
        required: true
    }
})
defineEmits(['navigate'])
</script>