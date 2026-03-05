<template>
    <aside class="bg-slate-900 text-slate-300 w-64 min-h-screen flex flex-col transition-all duration-300 shadow-2xl z-20">
        
        <div class="h-20 flex flex-col items-center justify-center border-b border-slate-700/50 bg-slate-950 px-4 shrink-0">
            <div class="flex items-center">
                <svg class="w-6 h-6 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <h1 class="text-lg font-black text-white tracking-widest uppercase">Panel <span class="text-amber-500">Árbitro</span></h1>
            </div>
            
            <div class="mt-1 flex items-center bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-500/30" title="Tu Puntuación Global">
                <svg class="w-3 h-3 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="text-xs font-black text-amber-400">{{ estadisticas.promedio }} / 10 <span class="text-slate-400 font-normal ml-1">({{ estadisticas.total_evaluaciones }})</span></span>
            </div>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p class="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Menú Principal</p>

            <button @click="$emit('navigate', 'inicio')"
                :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors group', activeTab === 'inicio' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800 hover:text-white']">
                <svg class="w-5 h-5 mr-3 transition-colors" :class="activeTab === 'inicio' ? 'text-slate-950' : 'group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Mis Partidos
            </button>
            <!-- */<button @click="$emit('navigate', 'torneos')"
                :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors group', activeTab === 'torneos' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800 hover:text-white']">
                <svg class="w-5 h-5 mr-3 transition-colors" :class="activeTab === 'torneos' ? 'text-slate-950' : 'group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                Torneos
            </button>-->


            <button @click="$emit('navigate', 'historial')"
                :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors group', activeTab === 'historial' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800 hover:text-white']">
                <svg class="w-5 h-5 mr-3 transition-colors" :class="activeTab === 'historial' ? 'text-slate-950' : 'group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Partidos Pasados
            </button>

            <button @click="$emit('navigate', 'evaluaciones')"
                :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors group', activeTab === 'evaluaciones' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800 hover:text-white']">
                <svg class="w-5 h-5 mr-3 transition-colors" :class="activeTab === 'evaluaciones' ? 'text-slate-950' : 'group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                Evaluaciones
            </button>

            <div class="pt-6 pb-2"><p class="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ajustes</p></div>

            <button @click="$emit('navigate', 'perfil')"
                :class="['w-full flex items-center px-4 py-3 rounded-lg transition-colors group', activeTab === 'perfil' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800 hover:text-white']">
                <svg class="w-5 h-5 mr-3 transition-colors" :class="activeTab === 'perfil' ? 'text-slate-950' : 'group-hover:text-white'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Mi Perfil
            </button>
        </nav>
    </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerPromedioArbitroService } from '../services/arbitrosService.js'

const props = defineProps({ activeTab: { type: String, default: 'inicio' } })
const emit = defineEmits(['navigate'])

const idArbitroActual = JSON.parse(localStorage.getItem('usuario') || '{}').id_usuario
const estadisticas = ref({ promedio: '0.0', total_evaluaciones: 0 })

onMounted(async () => {
    try {
        if(idArbitroActual) {
            const data = await obtenerPromedioArbitroService(idArbitroActual)
            estadisticas.value = { 
                promedio: data.promedio || '0.0', 
                total_evaluaciones: data.total_evaluaciones || 0 
            }
        }
    } catch (error) {
        console.error("Error al cargar promedio:", error)
    }
})
</script>
<style scoped>
nav::-webkit-scrollbar { width: 4px; }
nav::-webkit-scrollbar-track { background: transparent; }
nav::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 10px; }
</style>