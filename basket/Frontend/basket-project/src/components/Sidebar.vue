<template>
    <aside class="w-full md:w-64 bg-gray-900 text-white min-h-screen">
        <nav class="mt-5 px-2 space-y-1">
            
            <button @click="$emit('navigate', 'equipo')"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    activeTab === 'equipo'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                ]">
                <div class="flex items-center">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M10.5 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM1.5 18a6 6 0 0113 0H1.5z" />
                    </svg>
                    Mi equipo
                </div>
            </button>

            <button 
                @click="hasTeam ? $emit('navigate', 'jugadores') : null" 
                :disabled="!hasTeam"
                :title="!hasTeam ? 'Debes crear un equipo primero' : ''"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    !hasTeam ? 'opacity-50 cursor-not-allowed' : '',
                    activeTab === 'jugadores'
                        ? 'bg-indigo-600 text-white'
                        : (!hasTeam ? 'text-gray-400' : 'text-gray-300 hover:bg-gray-800')
                ]">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        Jugadores
                    </div>
                    <svg v-if="!hasTeam" class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </button>

            <button 
                @click="hasTeam ? $emit('navigate', 'torneo') : null" 
                :disabled="!hasTeam"
                :title="!hasTeam ? 'Debes crear un equipo primero' : ''"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    !hasTeam ? 'opacity-50 cursor-not-allowed' : '',
                    activeTab === 'torneo'
                        ? 'bg-indigo-600 text-white'
                        : (!hasTeam ? 'text-gray-400' : 'text-gray-300 hover:bg-gray-800')
                ]">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744l.146.558h.571a1 1 0 010 2h-.571l-.146.558a1 1 0 11-1.934-.468L11.359 5h-.717l-.146.558a1 1 0 11-1.934-.468L9.359 5h-.571a1 1 0 010-2h.571l.146-.558A1 1 0 0112 2zm0 10a1 1 0 01.967.744l.146.558h.571a1 1 0 110 2h-.571l-.146.558a1 1 0 11-1.934-.468l.146-.558h-.717l-.146.558a1 1 0 11-1.934-.468l.146-.558h-.571a1 1 0 110-2h.571l.146-.558A1 1 0 0112 12z"
                                clip-rule="evenodd" />
                        </svg>
                        Torneo
                    </div>
                    <svg v-if="!hasTeam" class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </button>
            <button @click ="$emit('navigate', 'inscribir-torneos')"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    activeTab === 'inscribir-torneos'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                ]">
                <div class="flex items-center">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3zM12 2a1 1 0 00-1.707-.707l-4 4A1 1 0 107.707 6.707L10.293 5H13a1 1 0 100-2h-1zM12 12a1 1 0 00-1.707-.707l-4 
                            4A1 
                            1 
                            0 
                            107.707 
                            14.707L10.293 
                            13H13a1 
                            1 
                            0 
                            100-2h-1z"
                            clip-rule="evenodd" />
                    </svg>
                    Inscribir en torneos
                </div>
            </button>
            <button 
                @click="hasTeam ? $emit('navigate', 'torneos-jugados') : null" 
                :disabled="!hasTeam"
                :title="!hasTeam ? 'Debes crear un equipo primero' : ''"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    !hasTeam ? 'opacity-50 cursor-not-allowed' : '',
                    activeTab === 'torneos-jugados'
                        ? 'bg-indigo-600 text-white'
                        : (!hasTeam ? 'text-gray-400' : 'text-gray-300 hover:bg-gray-800')
                ]">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M6 3a1 1 0 000 2h2a1 1 0 100-2H6zm3.293 4.707a1 1 0 010-1.414l1.414-1.414a1 1 0 111.414 1.414L11.414 7.707a1 1 0 01-1.414 0zM10 11a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm3.293 4.707a1 1 0 010-1.414l1.414-1.414a1 1 0 111.414 1.414L14.414 15.707a1 1 0 01-1.414 0zM6 9a1 1 0 000-2h2a1 1 0 100-2H6a3 3 0 00-3 3v2a3 3 0 003-3zm9-4h2a3 3 0 013-3v2a3-3 0 00-3-3v2a3 3 0 003-3h-2a1 1 0 110-2zM6 15a1 1 0 100-2h2a1 1 0 100-2H6a3 3 0 00-3 3v2a3 3 0 003-3zm9-4h2a3 3 0 013-3v2a3 3 0 00-3 3v2a3 3 0 003-3h-2a1 1 0 110-2z"
                                clip-rule="evenodd" />
                        </svg>  
                        Historial
                    </div>
                    <svg v-if="!hasTeam" class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </button>
            <button 
                @click="hasTeam ? $emit('navigate', 'actualizar-zona') : null" 
                :disabled="!hasTeam"
                :title="!hasTeam ? 'Debes crear un equipo primero' : ''"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    !hasTeam ? 'opacity-50 cursor-not-allowed' : '',
                    activeTab === 'actualizar-zona'
                        ? 'bg-indigo-600 text-white'
                        : (!hasTeam ? 'text-gray-400' : 'text-gray-300 hover:bg-gray-800')
                ]">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M6 3a1 1 0 000 2h2a1 1 0 100-2H6zm3.293 4.707a1 1 0 010-1.414l1.414-1.414a1 1 0 111.414 1.414L11.414 7.707a1 1 0 01-1.414 0zM10 11a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm3.293 4.707a1 1 0 010-1.414l1.414-1.414a1 1 0 111.414 1.414L14.414 15.707a1 1 0 01-1.414 0zM6 9a1 1 0 000-2h2a1 1 0 100-2H6a3 3 0 00-3 3v2a3 3 0 003-3zm9-4h2a3 3 0 013-3v2a3-3 0 00-3-3v2a3 3 0 003-3h-2a1 1 0 110-2zM6 15a1 1 0 100-2h2a1 1 0 100-2H6a3 3 0 00-3 3v2a3 3 0 003-3zm9-4h2a3 3 0 013-3v2a3 3 0 00-3 3v2a3 3 0 003-3h-2a1 1 0 110-2z"
                                clip-rule="evenodd" />
                        </svg>  
                        Actualizar zona de la cancha
                    </div>
                    <svg v-if="!hasTeam" class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
            </button>
            <button @click="$emit('navigate', 'perfil')"
                :class="[
                    'w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-colors',
                    activeTab === 'perfil'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                ]">
                <div class="flex items-center">
                    <svg class="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd" />
                    </svg>
                    Perfil
                </div>
            </button>

        </nav>
        
    </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
    activeTab: {
        type: String,
        default: 'equipo'
    },
    
    hasTeam: {
        type: Boolean,
        default: false
    }
})

defineEmits(['navigate', 'logout'])
const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    router.push('/login')
}
</script>
<style scoped>
</style>