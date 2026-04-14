<template>
    <div class="space-y-6 animate-fade-in">
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-gray-900">Gestión de Cuentas</h2>
                <p class="mt-2 text-gray-600">Registra entrenadores, árbitros y otros administradores.</p>
            </div>
            <button @click="toggleFormularioCuenta" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                {{ mostrandoFormCuenta ? 'Ver Lista de Cuentas' : '+ Nueva Cuenta' }}
            </button>
        </div>

        <div v-if="mostrandoFormCuenta" class="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Registrar Nueva Cuenta</h3>
            
            <form @submit.prevent="handleCrearCuenta" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nombre Completo <span class="text-red-500">*</span></label>
                        <input type="text" v-model="formCuenta.nombre" required placeholder="Ej: Juan Pérez"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico <span class="text-red-500">*</span></label>
                        <input type="email" v-model="formCuenta.email" required placeholder="correo@ejemplo.com"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña Temporal <span class="text-red-500">*</span></label>
                        <input type="password" v-model="formCuenta.password" required placeholder="Mínimo 6 caracteres" minlength="6"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rol del Sistema <span class="text-red-500">*</span></label>
                        <select v-model="formCuenta.rol" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                            <option value="" disabled>Selecciona un rol...</option>
                            <option value="entrenador">Entrenador</option>
                            <option value="arbitro">Árbitro</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                </div>

                <div v-if="mensajeErrorCuenta" class="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 animate-fade-in">{{ mensajeErrorCuenta }}</div>
                <div v-if="mensajeExitoCuenta" class="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200 animate-fade-in">{{ mensajeExitoCuenta }}</div>

                <div class="flex justify-end space-x-4 pt-4 border-t">
                    <button type="button" @click="toggleFormularioCuenta" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Cancelar</button>
                    <button type="submit" :disabled="cargandoFormCuenta" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                        {{ cargandoFormCuenta ? 'Creando...' : 'Crear Cuenta' }}
                    </button>
                </div>
            </form>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="cuenta in listaCuentas" :key="cuenta.id_usuario" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ cuenta.nombre }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ cuenta.email }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'bg-purple-100 text-purple-800 border-purple-200': cuenta.rol === 'administrador',
                                    'bg-blue-100 text-blue-800 border-blue-200': cuenta.rol === 'entrenador',
                                    'bg-orange-100 text-orange-800 border-orange-200': cuenta.rol === 'arbitro'
                                }" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize border">
                                    {{ cuenta.rol }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span class="text-green-600 font-medium flex items-center" v-if="cuenta.activo">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Activo
                                </span>
                                <span class="text-red-600 font-medium flex items-center" v-else>
                                    <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span> Inactivo
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerUsuariosService, crearUsuarioService } from '../../services/usuarioService'

const mostrandoFormCuenta = ref(false)
const listaCuentas = ref([])
const cargandoFormCuenta = ref(false)
const mensajeErrorCuenta = ref('')
const mensajeExitoCuenta = ref('')

const formCuenta = ref({ nombre: '', email: '', password: '', rol: '' })

const cargarCuentas = async () => {
    try {
        listaCuentas.value = await obtenerUsuariosService()
    } catch (error) {
        console.error("Error cargando cuentas:", error)
    }
}

const toggleFormularioCuenta = () => {
    mostrandoFormCuenta.value = !mostrandoFormCuenta.value
    mensajeErrorCuenta.value = ''
    mensajeExitoCuenta.value = ''
    if (!mostrandoFormCuenta.value) {
        formCuenta.value = { nombre: '', email: '', password: '', rol: '' }
    }
}

const handleCrearCuenta = async () => {
    mensajeErrorCuenta.value = ''
    mensajeExitoCuenta.value = ''
    cargandoFormCuenta.value = true

    try {
        await crearUsuarioService(formCuenta.value)
        mensajeExitoCuenta.value = '¡Cuenta creada exitosamente!'
        await cargarCuentas() 
        setTimeout(() => { toggleFormularioCuenta() }, 1500)
    } catch (error) {
        mensajeErrorCuenta.value = error.response?.data?.error || 'Error al crear la cuenta.'
    } finally {
        cargandoFormCuenta.value = false
    }
}

onMounted(() => {
    cargarCuentas()
})
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>