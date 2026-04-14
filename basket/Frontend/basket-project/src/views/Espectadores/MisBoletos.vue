<template>
    <NavbarEspectador />
    <div class="min-h-screen bg-gray-50 pb-12">
        
        

        <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
            
            <div class="mb-10 text-center md:text-left">
                <h2 class="text-3xl font-black text-gray-900 tracking-tight">Mis Boletos Oficiales</h2>
                <p class="mt-2 text-gray-600 font-medium">Aquí están tus entradas compradas. Presenta esta pantalla el día del evento.</p>
            </div>

            <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-gray-500 font-medium">Buscando tus boletos en la taquilla...</p>
            </div>

            <div v-else-if="mensajeError" class="bg-red-50 text-red-700 p-6 rounded-2xl font-bold border border-red-200 flex items-center justify-center text-center">
                <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {{ mensajeError }}
            </div>

            <div v-else-if="misBoletos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200 shadow-sm">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                </div>
                <p class="text-lg font-bold text-gray-600">Aún no tienes boletos</p>
                <p class="text-sm text-gray-500 mt-1 mb-6">Explora la cartelera y apoya a tus equipos favoritos.</p>
                <button @click="$router.push('/horarios')" class="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow">
                    Ver Próximos Partidos
                </button>
            </div>

            <div v-else class="space-y-6">
                <div v-for="boleto in misBoletos" :key="boleto.id_transaccion" 
                     class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow relative">
                    
                    <div class="hidden md:block w-3 bg-indigo-600"></div>

                    <div class="p-6 flex-1 relative">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <span class="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-amber-200">
                                    Pase Oficial
                                </span>
                            </div>
                            <div class="text-right">
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Comprado el</p>
                                <p class="text-xs text-gray-600 font-medium">{{ formatFechaCorta(boleto.fecha_transaccion) }}</p>
                            </div>
                        </div>

                        <div class="flex items-center justify-between mb-6 bg-slate-900 text-white p-4 rounded-xl shadow-inner">
                            <div class="w-2/5 text-right">
                                <p class="font-black text-lg md:text-xl truncate" :title="boleto.local_nombre">{{ boleto.local_nombre }}</p>
                                <p class="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Local</p>
                            </div>
                            <div class="w-1/5 text-center">
                                <span class="bg-indigo-600 text-white font-black px-2 py-1 rounded text-sm mx-2">VS</span>
                            </div>
                            <div class="w-2/5 text-left">
                                <p class="font-black text-lg md:text-xl truncate" :title="boleto.visitante_nombre">{{ boleto.visitante_nombre }}</p>
                                <p class="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Visitante</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                            <div>
                                <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Fecha
                                </p>
                                <p class="text-sm font-black text-gray-900">{{ formatFecha(boleto.fecha_partido) }}</p>
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Hora
                                </p>
                                <p class="text-sm font-black text-gray-900">{{ boleto.hora_partido }}</p>
                            </div>
                            <div class="col-span-2 sm:col-span-1">
                                <p class="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center">
                                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    Sede
                                </p>
                                <p class="text-sm font-black text-gray-900 truncate" :title="boleto.sede">{{ boleto.sede }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="hidden md:flex flex-col justify-center items-center relative w-8 border-l-2 border-dashed border-gray-200 bg-gray-50">
                        <div class="w-6 h-6 bg-gray-50 rounded-full absolute -top-3 -left-3.5 border-b border-gray-200"></div>
                        <div class="w-6 h-6 bg-gray-50 rounded-full absolute -bottom-3 -left-3.5 border-t border-gray-200"></div>
                    </div>
                    <div class="md:hidden w-full border-t-2 border-dashed border-gray-200 my-2 relative">
                        <div class="w-6 h-6 bg-gray-50 rounded-full absolute -left-3 -top-3.5 border-r border-gray-200"></div>
                        <div class="w-6 h-6 bg-gray-50 rounded-full absolute -right-3 -top-3.5 border-l border-gray-200"></div>
                    </div>

                    <div class="p-6 bg-gray-50 md:w-64 flex flex-col justify-between items-center text-center">
                        <div class="w-full">
                            <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Zona</p>
                            <p class="text-2xl font-black text-indigo-600 uppercase mb-4">{{ boleto.zona }}</p>
                            
                            <div class="flex justify-between items-center border-t border-gray-200 pt-3 mb-2">
                                <span class="text-xs text-gray-500 font-medium">Asientos:</span>
                                <span class="text-lg font-black text-gray-900">{{ boleto.cantidad }}x</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-500 font-medium">Pagado:</span>
                                <span class="text-lg font-black text-emerald-600">${{ boleto.monto_total }}</span>
                            </div>
                        </div>
                        
                        <div class="mt-6 pt-4 border-t border-gray-200 w-full opacity-60 flex flex-col items-center">
                            <div class="flex h-10 w-full justify-center space-x-1">
                                <div class="w-1 bg-gray-800 h-full"></div>
                                <div class="w-2 bg-gray-800 h-full"></div>
                                <div class="w-1 bg-gray-800 h-full"></div>
                                <div class="w-3 bg-gray-800 h-full"></div>
                                <div class="w-1 bg-gray-800 h-full"></div>
                                <div class="w-2 bg-gray-800 h-full"></div>
                                <div class="w-1 bg-gray-800 h-full"></div>
                                <div class="w-2 bg-gray-800 h-full"></div>
                                <div class="w-1 bg-gray-800 h-full"></div>
                                <div class="w-1 bg-gray-800 h-full"></div>
                                <div class="w-3 bg-gray-800 h-full"></div>
                                <div class="w-1 bg-gray-800 h-full"></div>
                            </div>
                            <p class="text-[8px] font-mono mt-1 tracking-widest text-gray-500">{{ boleto.id_transaccion.split('-')[0].toUpperCase() }}</p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavbarEspectador from '@/components/NavbarEspectador.vue';
import { obtenerMisBoletosService } from '../../services/ticketingService';

const router = useRouter();
const misBoletos = ref([]);
const cargando = ref(true);
const mensajeError = ref('');

onMounted(async () => {
    // 1. Validamos que exista un usuario logueado
    const storageUsuario = localStorage.getItem('usuario');
    const storageId = localStorage.getItem('usuario_id');

    if (!storageUsuario || !storageId) {
        router.push('/login');
        return;
    }

    try {
        cargando.value = true;
        // 2. Llamamos a tu servicio recién creado
        const data = await obtenerMisBoletosService(storageId);
        misBoletos.value = data;
    } catch (error) {
        mensajeError.value = "No pudimos conectar con la taquilla. Intenta recargar la página.";
        console.error("Error al cargar mis boletos:", error);
    } finally {
        cargando.value = false;
    }
});
const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offset);
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' });
};

const formatFechaCorta = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>