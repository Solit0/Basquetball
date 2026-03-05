<template>
    <aside class="bg-slate-900 text-slate-300 w-64 min-h-screen flex flex-col transition-all duration-300 shadow-2xl z-20">
        
        <div class="h-20 flex items-center justify-center border-b border-slate-700/50 bg-slate-950 px-6 shrink-0">
            <svg class="w-8 h-8 text-amber-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            <h1 class="text-xl font-black text-white tracking-widest uppercase">Panel <span class="text-amber-500">Árbitro</span></h1>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p class="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Menú Principal</p>

            <router-link to="/arbitro/inicio" class="flex items-center px-4 py-3 rounded-lg transition-colors group" active-class="bg-amber-500 text-slate-950 font-bold shadow-md" exact-active-class="bg-amber-500 text-slate-950 font-bold shadow-md">
                <svg class="w-5 h-5 mr-3 group-hover:text-white transition-colors" :class="{'text-slate-950': $route.path === '/arbitro/inicio'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Inicio
            </router-link>

            <router-link to="/arbitro/torneos" class="flex items-center px-4 py-3 rounded-lg transition-colors group hover:bg-slate-800 hover:text-white" active-class="bg-amber-500 text-slate-950 font-bold shadow-md" exact-active-class="bg-amber-500 text-slate-950 font-bold shadow-md">
                <svg class="w-5 h-5 mr-3 group-hover:text-white transition-colors" :class="{'text-slate-950': $route.path.includes('/arbitro/torneos')}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Torneos y Partidos
            </router-link>

            <router-link to="/arbitro/evaluaciones" class="flex items-center px-4 py-3 rounded-lg transition-colors group hover:bg-slate-800 hover:text-white" active-class="bg-amber-500 text-slate-950 font-bold shadow-md" exact-active-class="bg-amber-500 text-slate-950 font-bold shadow-md">
                <svg class="w-5 h-5 mr-3 group-hover:text-white transition-colors" :class="{'text-slate-950': $route.path.includes('/arbitro/evaluaciones')}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                Evaluaciones
            </router-link>

            <router-link to="/arbitro/historial" class="flex items-center px-4 py-3 rounded-lg transition-colors group hover:bg-slate-800 hover:text-white" active-class="bg-amber-500 text-slate-950 font-bold shadow-md" exact-active-class="bg-amber-500 text-slate-950 font-bold shadow-md">
                <svg class="w-5 h-5 mr-3 group-hover:text-white transition-colors" :class="{'text-slate-950': $route.path.includes('/arbitro/historial')}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Partidos Pasados
            </router-link>

            <div class="pt-6 pb-2">
                <p class="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ajustes</p>
            </div>

            <router-link to="/arbitro/perfil" class="flex items-center px-4 py-3 rounded-lg transition-colors group hover:bg-slate-800 hover:text-white" active-class="bg-amber-500 text-slate-950 font-bold shadow-md" exact-active-class="bg-amber-500 text-slate-950 font-bold shadow-md">
                <svg class="w-5 h-5 mr-3 group-hover:text-white transition-colors" :class="{'text-slate-950': $route.path.includes('/arbitro/perfil')}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Mi Perfil
            </router-link>
        </nav>

        <div class="p-4 border-t border-slate-700/50 bg-slate-950 shrink-0">
            <button @click="cerrarSesion" class="w-full flex items-center justify-center px-4 py-2.5 text-sm font-bold text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Cerrar Sesión
            </button>
        </div>
        
    </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cerrarSesion = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        
        localStorage.removeItem('usuario_id')
        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
        router.push('/login') 
    }
}
</script>

<style scoped>
nav::-webkit-scrollbar {
    width: 4px;
}
nav::-webkit-scrollbar-track {
    background: transparent;
}
nav::-webkit-scrollbar-thumb {
    background-color: #334155; 
    border-radius: 10px;
}
</style>