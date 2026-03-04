<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Jugadores</h1>
                    <p class="mt-2 text-gray-600">Lista de jugadores registrados en el sistema.</p>
                </div>
                <button @click="mostrarFormulario = true" 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                    + Nuevo Jugador
                </button>
            </div>

            <!-- Formulario de creación -->
            <div v-if="mostrarFormulario" class="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Registrar Nuevo Jugador</h3>
                <form @submit.prevent="handleCrearJugador" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input v-model="formJugador.nombre" type="text" required
                                class="w-full px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                            <input v-model="formJugador.apellido" type="text" required
                                class="w-full px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Nacimiento</label>
                            <input v-model="formJugador.fecha_nacimiento" type="date" required
                                class="w-full px-3 py-2 border rounded-md">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                            <select v-model="formJugador.posicion" required
                                class="w-full px-3 py-2 border rounded-md bg-white">
                                <option value="">Seleccionar...</option>
                                <option value="Base">Base</option>
                                <option value="Escolta">Escolta</option>
                                <option value="Alero">Alero</option>
                                <option value="Ala-pívot">Ala-pívot</option>
                                <option value="Pívot">Pívot</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Estatura (m)</label>
                            <input v-model="formJugador.estatura" type="number" step="0.01" required
                                class="w-full px-3 py-2 border rounded-md">
                        </div>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="mostrarFormulario = false"
                            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="cargando"
                            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                            {{ cargando ? 'Guardando...' : 'Guardar' }}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Tabla de jugadores -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estatura</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="jugador in jugadores" :key="jugador.id_jugador" class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap font-medium">{{ jugador.nombre }} {{ jugador.apellido }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ jugador.posicion }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ jugador.estatura }} m</td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ calcularEdad(jugador.fecha_nacimiento) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span :class="jugador.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                        class="px-2 py-1 text-xs rounded-full">
                                        {{ jugador.activo ? 'Activo' : 'Inactivo' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerJugadoresService, crearJugadorService } from '../services/jugadoresService'

const jugadores = ref([])
const mostrarFormulario = ref(false)
const cargando = ref(false)

const formJugador = ref({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    posicion: '',
    estatura: ''
})

const cargarJugadores = async () => {
    try {
        jugadores.value = await obtenerJugadoresService()
    } catch (error) {
        console.error("Error cargando jugadores:", error)
    }
}

const handleCrearJugador = async () => {
    cargando.value = true
    try {
        await crearJugadorService(formJugador.value)
        await cargarJugadores()
        mostrarFormulario.value = false
        formJugador.value = { nombre: '', apellido: '', fecha_nacimiento: '', posicion: '', estatura: '' }
    } catch (error) {
        console.error("Error creando jugador:", error)
    } finally {
        cargando.value = false
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
    return edad
}

onMounted(() => {
    cargarJugadores()
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