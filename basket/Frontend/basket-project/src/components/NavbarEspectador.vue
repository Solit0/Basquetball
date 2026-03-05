<template>
    <nav class="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                
                <div class="flex items-center cursor-pointer" @click="$router.push('/horarios')">
                    <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md mr-3 transform transition hover:scale-105">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h1 class="text-2xl font-black text-slate-800 tracking-tight">
                        Basket<span class="text-amber-500">Pro</span>
                    </h1>
                </div>

                <div class="hidden md:flex space-x-1">
                    <router-link to="/transmisiones" 
                        class="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100">
                        Canales Oficiales de Transmisión
                    </router-link>
                    <router-link to="/emisiones" 
                        class="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100">
                        Horarios de emisión
                    </router-link>
                    <router-link to="/torneos-publicos" 
                        class="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100">
                        Torneos
                    </router-link>
                    
                    <router-link to="/horarios" 
                        class="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100"
                        :class="{ 'text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100': $route.path === '/' }">
                        Horarios de Partido
                    </router-link>
                </div>

                <div class="hidden md:flex items-center">
                    <button @click="$router.push('/login')" 
                            class="px-5 py-2.5 text-sm font-black text-indigo-600 border-2 border-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                        Acceso Staff
                    </button>
                </div>

                <div class="md:hidden flex items-center">
                    <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-600 hover:text-indigo-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-2xl absolute w-full animate-fade-in-down">
            <div class="px-4 pt-4 pb-6 space-y-2">
                <router-link to="/transmisiones" @click="isMobileMenuOpen = false" 
                    class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        Canales de Transmisión
                    </div>
                </router-link>
                
                <router-link to="/torneos-publicos" @click="isMobileMenuOpen = false" 
                    class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        Torneos
                    </div>
                </router-link>
                
                <router-link to="/horarios" @click="isMobileMenuOpen = false" 
                    class="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                    active-class="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100"
                    :class="{ 'text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100': $route.path === '/' }">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 mr-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        Horarios de Partido
                    </div>
                </router-link>
                
                <div class="pt-6 mt-2 border-t border-gray-200">
                    <button @click="$router.push('/login'); isMobileMenuOpen = false" 
                            class="w-full flex items-center justify-center px-4 py-3 text-base font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md">
                        Acceso Staff / Equipos
                    </button>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<style scoped>
.animate-fade-in-down {
    animation: fadeInDown 0.2s ease-out;
}
@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>