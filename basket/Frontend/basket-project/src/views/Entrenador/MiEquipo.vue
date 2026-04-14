<template>
    <div class="space-y-6 animate-fade-in">
        <div v-if="hasTeam" class="space-y-6">
            <div class="flex justify-between items-end bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">
                        {{ equipo?.nombre_oficial || 'Mi Equipo' }} 
                        <span class="text-lg text-gray-500 font-normal ml-2">({{ equipo?.siglas }})</span>
                        <span v-if="!equipo?.activo" class="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full font-bold">
                            Inactivo
                        </span>
                    </h2>
                    <p class="mt-2 text-gray-600 font-medium">
                        Sede: <span class="text-gray-900">{{ equipo?.direccion_cancha || 'No definida' }}</span> | 
                        Categoría: <span class="capitalize text-gray-900">{{ equipo?.clasificacion || 'General' }}</span>
                    </p>
                </div>
                <div class="flex space-x-3">
                    <button @click="$emit('edit')" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                        Editar Datos
                    </button>
                    <button @click="$emit('toggle')" 
                        :class="[
                            'px-4 py-2 rounded-md transition-colors shadow-sm font-bold',
                            equipo?.activo ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300' : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                        ]">
                        {{ equipo?.activo ? 'Pausar Equipo' : 'Reactivar Equipo' }}
                    </button>
                    <button @click="$emit('leave')" class="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors shadow-sm flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Abandonar
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
                    <p class="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Jugadores Activos</p>
                    <p class="text-4xl font-black text-indigo-600">{{ estadisticas?.jugadores_activos || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
                    <p class="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Partidos Jugados</p>
                    <p class="text-4xl font-black text-gray-900">{{ estadisticas?.partidos_jugados || 0 }}</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col justify-center items-center">
                    <p class="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Victorias</p>
                    <p class="text-4xl font-black text-green-500">{{ estadisticas?.victorias || 0 }}</p>
                </div>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-200 animate-fade-in">
            <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg class="h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <h2 class="text-2xl font-black text-gray-900 mb-2">Aún no diriges ningún equipo</h2>
            <p class="text-gray-500 mb-8 text-center max-w-md font-medium">Crea un equipo nuevo o únete a la directiva de uno existente para comenzar a competir.</p>
            
            <div class="flex space-x-4">
                <button @click="$router.push('/crear-equipo')" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center">
                    + Crear Equipo Nuevo
                </button>
                <button @click="$router.push('/equipos-libres')" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center">
                    Unirme a un Equipo
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    equipo: { type: Object, default: null },
    estadisticas: { type: Object, default: null },
    hasTeam: { type: Boolean, default: false }
})
defineEmits(['edit', 'toggle', 'leave'])
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>