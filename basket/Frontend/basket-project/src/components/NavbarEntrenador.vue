<template>
    <nav class="bg-white shadow-md z-50 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <h1 class="text-2xl font-black text-indigo-600 tracking-tight">BasketPro</h1>
                    </div>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-4">
                        
                        <div class="relative flex items-center">
                            <button @click="menuNotificaciones = !menuNotificaciones" 
                                    class="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors bg-white rounded-full shadow-sm border border-gray-100 focus:outline-none">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                                
                                <span v-if="notificaciones.length > 0" class="absolute top-0 right-0 block w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full items-center justify-center transform translate-x-1 -translate-y-1 shadow-sm">
                                    {{ notificaciones.length }}
                                </span>
                            </button>

                            <div v-if="menuNotificaciones" class="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                                <div class="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
                                    <span class="font-bold text-sm">Próximos Encuentros</span>
                                    <span class="bg-indigo-800 text-xs px-2 py-0.5 rounded-full">{{ notificaciones.length }}</span>
                                </div>
                                
                                <div class="max-h-72 overflow-y-auto">
                                    <div v-if="notificaciones.length === 0" class="p-6 text-center text-gray-500 text-sm font-medium">
                                        No tienes partidos programados próximamente.
                                    </div>
                                    
                                    <div v-else v-for="notif in notificaciones" :key="notif.id_partido" class="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left">
                                        <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                                            {{ formatFecha(notif.fecha) }} a las {{ notif.hora }}
                                        </p>
                                        <p class="font-black text-gray-800 text-sm">
                                            {{ notif.local_nombre }} <span class="text-gray-400 font-normal mx-1">vs</span> {{ notif.visitante_nombre }}
                                        </p>
                                        <p class="text-xs text-gray-500 mt-2 flex items-center">
                                            <svg class="w-3 h-3 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                            {{ notif.sede }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <span class="text-gray-900 px-3 py-2 text-sm font-bold bg-gray-50 rounded-lg border border-gray-100">
                            👤 {{ userName }}
                        </span>
                        <button @click="logout"
                            class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { obtenerNotificacionesEntrenadorService } from '../services/partidosService' // Ajusta la ruta si es necesario

const props = defineProps({
    userName: { type: String, required: true }
})

const router = useRouter()
const toast = useToast()

// 🔴 Variables Reactivas para la Notificación
const notificaciones = ref([])
const menuNotificaciones = ref(false)

onMounted(async () => {
    const idEntrenador = localStorage.getItem('usuario_id');
    
    if (idEntrenador) {
        try {
            const data = await obtenerNotificacionesEntrenadorService(idEntrenador);
            notificaciones.value = data;

            // 🔴 Lógica para mostrar el Toast SOLO UNA VEZ por sesión
            const yaNotificado = sessionStorage.getItem('notificacion_partidos_vista');

            if (data.length > 0 && !yaNotificado) {
                const fecha = formatFecha(data[0].fecha);
                
                if (data.length === 1) {
                    toast.info(`🏀 Tienes un partido programado el ${fecha}. ¡Revisa tu campana!`, {
                        timeout: 8000
                    });
                } else {
                    toast.warning(`🚨 ¡Día de Torneo! Tienes ${data.length} partidos programados el ${fecha}.`, {
                        timeout: 8000
                    });
                }

                // Marcamos que ya le avisamos en esta sesión
                sessionStorage.setItem('notificacion_partidos_vista', 'true');
            }
        } catch (error) {
            console.error("Error cargando la campana de notificaciones:", error);
        }
    }
})

// En la función logout, limpiamos la variable para que si entra otro entrenador, le salga la alerta.
const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    sessionStorage.removeItem('notificacion_partidos_vista') // 🔴 Limpiamos
    toast.clear()
    router.push('/login')
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}


</script>

<style scoped>
/* Animación para que el menú de la campana caiga suavemente */
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>