<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">

            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Directorio de Jugadores</h1>
                    <p class="mt-2 text-gray-600">Gestiona los jugadores registrados en tu club.</p>
                </div>
                <button @click="abrirModalNuevo" 
                    class="px-4 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition shadow-sm">
                    + Fichar Jugador
                </button>
            </div>

            <div class="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                
                <div v-if="cargando" class="text-center py-12 text-indigo-500">
                    <svg class="animate-spin h-8 w-8 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="font-bold">Cargando directorio...</p>
                </div>

                <div v-else-if="jugadores.length === 0" class="text-center py-12 text-gray-500">
                    No tienes jugadores registrados en el club actualmente.
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estatura</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="jugador in jugadores" :key="jugador.id_jugador" class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                    {{ jugador.nombre }} {{ jugador.apellido }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {{ jugador.posicion || 'No definida' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {{ jugador.estatura ? jugador.estatura + ' m' : 'N/A' }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {{ calcularEdad(jugador.fecha_nacimiento) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <!-- CORRECCIÓN 1: Se fusionan los dos :class duplicados en uno solo -->
                                    <span :class="[
                                            jugador.activo
                                                ? 'bg-green-100 text-green-800 border-green-200'
                                                : 'bg-red-100 text-red-800 border-red-200',
                                            'px-2 py-1 text-xs font-bold rounded-full border'
                                        ]">
                                        {{ jugador.activo ? 'Activo' : 'Inactivo' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button @click="abrirModalEditar(jugador)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                                        Editar
                                    </button>
                                    <button @click="confirmarEliminacion(jugador)" class="text-red-600 hover:text-red-900">
                                        Dar de Baja
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- CORRECCIÓN 3: Modal de notificación propio en lugar de alert() -->
            <div v-if="notificacion.visible"
                :class="[
                    'fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white font-bold transition-all z-50',
                    notificacion.tipo === 'exito' ? 'bg-green-600' : 'bg-red-600'
                ]">
                {{ notificacion.mensaje }}
            </div>

            <!-- CORRECCIÓN 3: Modal de confirmación propio en lugar de confirm() -->
            <div v-if="confirmacion.visible" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Confirmar acción</h3>
                    <p class="text-gray-600 mb-6">{{ confirmacion.mensaje }}</p>
                    <div class="flex justify-end gap-3">
                        <button @click="cancelarConfirmacion"
                            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                            Cancelar
                        </button>
                        <button @click="aceptarConfirmacion"
                            class="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition">
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <ModalAgregarJugador 
            :show="showModal"
            :jugador="jugadorSeleccionado"
            :jugadoresLibres="jugadoresLibres"
            @close="cerrarModal"
            @save="guardarJugador"
        />

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import { 
    obtenerJugadoresPorEquipoService,
    crearJugadorService, 
    actualizarJugadorService,
    eliminarJugadorService,
    obtenerJugadoresLibresService,
    vincularJugadorService
} from '../services/jugadoresService'

import { obtenerEquipoDeEntrenadorService } from '../services/equiposService'
import ModalAgregarJugador from './ModalAgregarJugador.vue'

// Estado principal
const jugadores = ref([])
const jugadoresLibres = ref([])
const cargando = ref(false)
const equipoActual = ref(null)

// Control del Modal de formulario
const showModal = ref(false)
const jugadorSeleccionado = ref(null)

// CORRECCIÓN 3: Estado para notificaciones tipo toast (reemplaza alert())
const notificacion = ref({ visible: false, mensaje: '', tipo: 'exito' })

const mostrarNotificacion = (mensaje, tipo = 'exito') => {
    notificacion.value = { visible: true, mensaje, tipo }
    setTimeout(() => { notificacion.value.visible = false }, 3000)
}

// CORRECCIÓN 3: Estado para modal de confirmación (reemplaza confirm())
const confirmacion = ref({ visible: false, mensaje: '', callback: null })

const pedirConfirmacion = (mensaje) => {
    return new Promise((resolve) => {
        confirmacion.value = {
            visible: true,
            mensaje,
            callback: resolve
        }
    })
}

const aceptarConfirmacion = () => {
    confirmacion.value.visible = false
    confirmacion.value.callback(true)
}

const cancelarConfirmacion = () => {
    confirmacion.value.visible = false
    confirmacion.value.callback(false)
}

// Inicialización
const inicializarVista = async () => {
    cargando.value = true
    try {
        const idEntrenador = localStorage.getItem('usuario_id')
        equipoActual.value = await obtenerEquipoDeEntrenadorService(idEntrenador)
        if (equipoActual.value) {
            await cargarJugadores()
        }
    } catch (error) {
        console.error("Error inicializando la vista de jugadores:", error)
    } finally {
        cargando.value = false
    }
}

const cargarJugadores = async () => {
    // CORRECCIÓN 2: Se activa el spinner también al recargar tras guardar/eliminar
    cargando.value = true
    try {
        jugadores.value = await obtenerJugadoresPorEquipoService(equipoActual.value.id_equipo)
    } catch (error) {
        console.error("Error cargando jugadores del equipo:", error)
    } finally {
        cargando.value = false
    }
}

const cargarLibres = async () => {
    try {
        jugadoresLibres.value = await obtenerJugadoresLibresService()
    } catch (error) {
        console.error("Error cargando agentes libres:", error)
    }
}

// Lógica del Modal
const abrirModalNuevo = async () => {
    jugadorSeleccionado.value = null
    await cargarLibres()
    showModal.value = true
}

const abrirModalEditar = (jugador) => {
    jugadorSeleccionado.value = jugador
    showModal.value = true
}

const cerrarModal = () => {
    showModal.value = false
    jugadorSeleccionado.value = null
}

const guardarJugador = async (payload) => {
    // CORRECCIÓN 4: Validación de id_jugador antes de intentar actualizar
    if (payload.isEditing && !payload.data?.id_jugador) {
        mostrarNotificacion('Error: el jugador no tiene un ID válido.', 'error')
        return
    }

    try {
        const idEquipo = equipoActual.value.id_equipo

        if (payload.isEditing) {
            await actualizarJugadorService(payload.data.id_jugador, {
                ...payload.data,
                id_equipo: idEquipo
            })
            mostrarNotificacion('Jugador actualizado correctamente.')

        } else if (payload.isAgenteLibre) {
            await vincularJugadorService(payload.data.id_jugador, { id_equipo: idEquipo })
            mostrarNotificacion('Agente libre fichado exitosamente.')

        } else {
            await crearJugadorService({ ...payload.data, id_equipo: idEquipo })
            mostrarNotificacion('Nuevo jugador registrado en el club.')
        }

        await cargarJugadores()
        cerrarModal()

    } catch (error) {
        mostrarNotificacion(error.response?.data?.error || 'Ocurrió un error al procesar el jugador.', 'error')
    }
}

const confirmarEliminacion = async (jugador) => {
    const confirmado = await pedirConfirmacion(
        `¿Estás seguro de que deseas dar de baja a ${jugador.nombre} ${jugador.apellido} de tu club?`
    )
    if (!confirmado) return

    try {
        await eliminarJugadorService(jugador.id_jugador, equipoActual.value.id_equipo)
        mostrarNotificacion('Jugador dado de baja exitosamente.')
        await cargarJugadores()
    } catch (error) {
        mostrarNotificacion('Error al intentar dar de baja al jugador.', 'error')
    }
}

const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A'
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
    }
    return edad + ' años'
}

onMounted(() => {
    inicializarVista()
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>