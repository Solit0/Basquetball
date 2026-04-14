<template>
    <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pb-12">
        
        

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
            
            <div class="text-center mb-10">
                <h2 class="text-4xl font-black text-gray-900 mb-2">Configuración de Sede y Zonas</h2>
                <p class="text-gray-600 font-medium">Administra el inventario de asientos para la venta de boletos.</p>
            </div>

            <div v-if="cargando" class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                <svg class="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p class="text-gray-500 font-bold">Buscando información de tu sede...</p>
            </div>

            <div v-else-if="!tieneCancha" class="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 text-center animate-fade-in">
                <div class="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-2xl font-black text-gray-900 mb-2">Aún no tienes una sede registrada</h3>
                <p class="text-gray-600 mb-8 max-w-lg mx-auto">Para poder configurar las zonas de asientos y vender boletos, primero necesitas crear tu equipo y registrar tu cancha local en el sistema.</p>
                <button @click="$router.push('/crear-equipo')" class="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-md">
                    Registrar Equipo y Sede Ahora
                </button>
            </div>

            <div v-else class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-fade-in">
                
                <div class="bg-slate-900 p-8 text-white">
                    <span class="bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Equipo Local: {{ equipoNombre }}</span>
                    <h3 class="text-3xl font-black mb-1">{{ canchaInfo.nombreCancha }}</h3>
                    <p class="text-gray-400 flex items-center text-sm font-medium">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {{ canchaInfo.direccion }}
                    </p>
                </div>

                <div class="p-8">
                    <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                        <div>
                            <h4 class="text-xl font-black text-gray-800">Distribución de Zonas</h4>
                            <p class="text-sm text-gray-500 mt-1">Modifica los nombres o capacidades. Agrega nuevas zonas si dividiste tu estadio.</p>
                        </div>
                        <button type="button" @click="agregarZona" class="text-sm bg-indigo-50 border border-indigo-200 text-indigo-700 font-black px-4 py-2 rounded-lg hover:bg-indigo-100 transition flex items-center shadow-sm">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            Añadir Zona
                        </button>
                    </div>

                    <form @submit.prevent="guardarCambios">
                        <div class="space-y-4 mb-8">
                            
                            <div v-for="(zona, index) in zonasList" :key="index" 
                                 class="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm relative transition-all focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-400">
                                
                                <div class="flex-1 w-full">
                                    <label class="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Nombre de la Zona</label>
                                    <input type="text" v-model="zona.nombre_zona" placeholder="Ej: VIP Preferencial" 
                                           class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-bold text-gray-900 outline-none transition" required />
                                </div>
                                
                                <div class="w-full sm:w-40">
                                    <label class="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Capacidad (Asientos)</label>
                                    <input type="number" v-model.number="zona.capacidad" placeholder="0" min="1" 
                                           class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-bold text-gray-900 outline-none transition" required />
                                </div>
                                
                                <div class="sm:pt-5">
                                    <button v-if="!zona.id_zona" type="button" @click="removerZonaNueva(index)" class="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Eliminar zona no guardada">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                    <div v-else class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 mt-2 sm:mt-0" title="Esta zona ya existe en la base de datos">
                                        REGISTRADA
                                    </div>
                                </div>
                            </div>

                            <div v-if="zonasList.length === 0" class="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                No hay zonas configuradas. Haz clic en "Añadir Zona" para comenzar.
                            </div>
                        </div>

                        <div v-if="mensajeError" class="mb-6 bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold border border-red-200 flex items-center">
                            <svg class="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {{ mensajeError }}
                        </div>

                        <div v-if="mensajeExito" class="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm font-bold border border-emerald-200 flex items-center">
                            <svg class="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {{ mensajeExito }}
                        </div>

                        <button type="submit" :disabled="procesando" 
                                class="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg flex justify-center items-center disabled:opacity-70">
                            <svg v-if="procesando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                            {{ procesando ? 'Guardando cambios...' : 'Guardar y Actualizar Zonas' }}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Importa tus servicios reales aquí
import { obtenerSedeYZonasService, actualizarZonasService } from '../../services/canchaService';

const router = useRouter();

// Estados
const cargando = ref(true);
const procesando = ref(false);
const tieneCancha = ref(false);
const mensajeError = ref('');
const mensajeExito = ref('');

// Datos
const equipoNombre = ref('');
const canchaInfo = ref({});
const zonasList = ref([]);

const getUserId = () => {
    return localStorage.getItem('usuario_id');
};

onMounted(async () => {
    const idEntrenador = getUserId();
    
    if (!idEntrenador) {
        router.push('/login');
        return;
    }

    try {
        cargando.value = true;
        // 1. Hacemos la consulta inicial SELECT
        const datos = await obtenerSedeYZonasService(idEntrenador);
        
        equipoNombre.value = datos.equipo;
        canchaInfo.value = datos.cancha;
        
        // Mapeamos los datos por si vienen en camelCase de la BD (Drizzle)
        zonasList.value = datos.zonas.map(z => ({
            id_zona: z.idZona || z.id_zona,
            nombre_zona: z.nombreZona || z.nombre_zona,
            capacidad: z.capacidad
        }));

        // Si existe la cancha, lo marcamos como true
        tieneCancha.value = true;

    } catch (error) {
        // 2. Si el backend nos devuelve 404, significa que el entrenador no ha creado su equipo/cancha
        if (error.response?.status === 404) {
            tieneCancha.value = false;
        } else {
            mensajeError.value = "Ocurrió un error de conexión al cargar la información.";
        }
    } finally {
        cargando.value = false;
    }
});

// Manejo dinámico del array de zonas
const agregarZona = () => {
    // Añadimos un objeto sin 'id_zona' para que el backend sepa que debe hacer INSERT
    zonasList.value.push({
        nombre_zona: '',
        capacidad: null
    });
};

const removerZonaNueva = (index) => {
    // Solo permitimos remover del DOM las que no tienen ID (Aún no guardadas)
    if (!zonasList.value[index].id_zona) {
        zonasList.value.splice(index, 1);
    }
};

// Guardar los cambios (El UPSERT)
const guardarCambios = async () => {
    mensajeError.value = '';
    mensajeExito.value = '';
    
    // Validar que no envíen zonas vacías
    const zonasValidas = zonasList.value.filter(z => z.nombre_zona.trim() !== '' && z.capacidad > 0);

    if (zonasValidas.length === 0) {
        mensajeError.value = "Debes tener al menos una zona válida configurada.";
        return;
    }

    procesando.value = true;

    try {
        // Ejecutamos el UPDATE/INSERT enviando el array al backend
        await actualizarZonasService(canchaInfo.value.idCancha || canchaInfo.value.id_cancha, zonasValidas);
        
        mensajeExito.value = "¡Inventario de zonas actualizado correctamente!";
        
        // Refrescamos los datos silenciosamente para obtener los nuevos "id_zona" de las zonas insertadas
        const datosRefrescados = await obtenerSedeYZonasService(getUserId());
        zonasList.value = datosRefrescados.zonas.map(z => ({
            id_zona: z.idZona || z.id_zona,
            nombre_zona: z.nombreZona || z.nombre_zona,
            capacidad: z.capacidad
        }));

    } catch (error) {
        mensajeError.value = "Hubo un problema al guardar los cambios. Inténtalo nuevamente.";
        console.error(error);
    } finally {
        procesando.value = false;
        
        // Quitar el mensaje de éxito después de unos segundos
        setTimeout(() => {
            mensajeExito.value = '';
        }, 5000);
    }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>