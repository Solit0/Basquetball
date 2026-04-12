<template>
    <div class="space-y-6 animate-fade-in">
        <div v-if="equipo">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="text-3xl font-bold text-gray-900">Directorio de Jugadores</h2>
                    <p class="mt-2 text-gray-600">Registra jugadores en tu club. Elegirás a los titulares y sus números al inscribirte a cada torneo.</p>
                </div>
                <button @click="openAddPlayerModal"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                    + Fichar Jugador
                </button>
            </div>

            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div v-if="cargando" class="text-center py-12 text-indigo-500">
                    <svg class="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="font-bold text-sm">Cargando jugadores...</p>
                </div>
                
                <div v-else-if="players.length === 0" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Base de datos vacía</h3>
                    <p class="mt-1 text-sm text-gray-500">Comienza registrando jugadores a tu club.</p>
                </div>

                <table v-else class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatura</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nacimiento</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="player in players" :key="player.id_jugador" 
                            class="transition-colors"
                            :class="player.esta_suspendido ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'">
                            
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <span class="text-sm font-bold" :class="player.esta_suspendido ? 'text-red-900' : 'text-gray-900'">
                                        {{ player.nombre }} {{ player.apellido }}
                                    </span>
                                    <span v-if="player.esta_suspendido" class="ml-2 flex items-center bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        Sancionado
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ player.posicion || 'No definida' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ player.estatura ? player.estatura + ' m' : 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {{ player.fecha_nacimiento ? player.fecha_nacimiento.split('T')[0] : 'N/A' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                <button @click="editPlayer(player)" class="text-indigo-600 hover:text-indigo-900 mr-4 font-bold">
                                    Editar
                                </button>
                                <button @click="confirmDeletePlayer(player)" class="text-red-600 hover:text-red-900 font-bold">
                                    Dar de Baja
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-200">
            <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <svg class="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Sección Bloqueada</h2>
            <p class="text-gray-600 mb-8 text-center max-w-md">Para registrar jugadores, primero debes tener un equipo asignado.</p>
            <div class="flex space-x-4">
                <button @click="$router.push('/crear-equipo')" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm">
                    Crear Equipo
                </button>
                <button @click="$router.push('/equipos-libres')" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition shadow-sm">
                    Unirme a Equipo
                </button>
            </div>
        </div>

        <ModalAgregarJugador 
            :show="showPlayerModal"
            :jugador="selectedPlayer"
            :jugadoresLibres="jugadoresLibres"
            @close="closePlayerModal"
            @save="savePlayer"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ModalAgregarJugador from '../ModalAgregarJugador.vue' 
import { 
     
    crearJugadorService, 
    actualizarJugadorService, 
    eliminarJugadorService,
    obtenerJugadoresLibresService,
    vincularJugadorService
} from '../../services/jugadoresService'
import { obtenerJugadoresPorEquipoService } from '@/services/equiposService'
const props = defineProps({
    equipo: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['cambio-jugadores'])

const players = ref([])
const jugadoresLibres = ref([])
const cargando = ref(false)

const showPlayerModal = ref(false)
const selectedPlayer = ref(null)

const cargarJugadores = async () => {
    if (!props.equipo) return;
    
    cargando.value = true;
    try {
        const data = await obtenerJugadoresPorEquipoService(props.equipo.id_equipo);
        players.value = data; 
    } catch (error) {
        console.error('Error al cargar jugadores:', error)
    } finally {
        cargando.value = false;
    }
}

const cargarJugadoresLibres = async () => {
    try {
        jugadoresLibres.value = await obtenerJugadoresLibresService();
    } catch (error) {
        console.error('Error cargando agentes libres:', error)
    }
}

const openAddPlayerModal = async () => {
    selectedPlayer.value = null
    await cargarJugadoresLibres();
    showPlayerModal.value = true
}

const editPlayer = (player) => {
    selectedPlayer.value = player
    showPlayerModal.value = true
}

const closePlayerModal = () => {
    showPlayerModal.value = false
    selectedPlayer.value = null
}

const savePlayer = async (payload) => {
    try {
        if (payload.isEditing) {
            await actualizarJugadorService(payload.data.id_jugador, {
                ...payload.data,
                id_equipo: props.equipo.id_equipo 
            })
            alert('Jugador actualizado correctamente')
        } else if (payload.isAgenteLibre) {
            await vincularJugadorService(payload.data.id_jugador, {
                numero_camiseta: payload.data.numero_camiseta || 0,
                es_capitan: false,
                id_equipo: props.equipo.id_equipo
            })
            alert('Agente libre fichado correctamente')
        } else {
            await crearJugadorService({
                ...payload.data,
                id_equipo: props.equipo.id_equipo
            })
            alert('Nuevo jugador registrado correctamente')
        }
        await cargarJugadores()
        emit('cambio-jugadores') // Avisa al Dashboard para que actualice la tarjeta de "Jugadores Registrados"
        closePlayerModal()
    } catch (error) {
        alert(error.response?.data?.error || 'Error al procesar el jugador')
    }
}

const confirmDeletePlayer = (player) => {
    if (confirm(`¿Estás seguro de dar de baja a ${player.nombre} ${player.apellido}?`)) {
        eliminarJugador(player)
    }
}

const eliminarJugador = async (player) => {
    try {
        await eliminarJugadorService(player.id_jugador, props.equipo.id_equipo)
        alert('Jugador dado de baja exitosamente')
        await cargarJugadores()
        emit('cambio-jugadores')
    } catch (error) {
        alert('Error al dar de baja al jugador')
    }
}

// Si el equipo se carga con delay en el dashboard, escuchamos el cambio
watch(() => props.equipo, (newVal) => {
    if (newVal) cargarJugadores()
})

onMounted(() => {
    if (props.equipo) cargarJugadores()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>