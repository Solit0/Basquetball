<template>
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="shrink-0">
                            <h1 class="text-2xl font-bold text-indigo-600">BasketPro <span class="text-sm text-gray-500 font-normal">| Panel Admin</span></h1>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-center space-x-4">
                            <span class="text-gray-800 text-sm font-medium px-3 py-2">
                                Hola, {{ userName }}
                            </span>
                            <button @click="logout"
                                class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
            <AdminSidebar :activeTab="activeTab" @navigate="navigateTo" />

            <main class="flex-1 overflow-auto bg-gray-50">
                <div class="py-6 px-4 sm:px-6 lg:px-8">
                    
                    <div v-if="activeTab === 'canales'" class="space-y-6 animate-fade-in">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-3xl font-bold text-gray-900">Canales de Transmisión</h2>
                                <p class="mt-2 text-gray-600">Administra los canales donde se transmiten los partidos.</p>
                            </div>
                            <button @click="toggleFormularioCanal" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                                {{ mostrandoFormulario ? 'Ver Lista de Canales' : '+ Nuevo Canal' }}
                            </button>
                        </div>
                        
                        <div v-if="mostrandoFormulario" class="bg-white rounded-lg shadow-md p-6 animate-fade-in">
                            <h3 class="text-xl font-bold text-gray-900 mb-6">Registrar Nuevo Canal</h3>
                            
                            <form @submit.prevent="handleCrearCanal" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Canal <span class="text-red-500">*</span></label>
                                        <input type="text" v-model="formCanal.nombre_canal" required placeholder="Ej: Canal 4"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Transmisión <span class="text-red-500">*</span></label>
                                        <div class="flex space-x-6 mt-2">
                                            <label class="flex items-center cursor-pointer">
                                                <input type="radio" v-model="formCanal.id_tipo" value="1" class="text-indigo-600 focus:ring-indigo-500 border-gray-300">
                                                <span class="ml-2 text-gray-700">Satelital / TV</span>
                                            </label>
                                            <label class="flex items-center cursor-pointer">
                                                <input type="radio" v-model="formCanal.id_tipo" value="2" class="text-indigo-600 focus:ring-indigo-500 border-gray-300">
                                                <span class="ml-2 text-gray-700">Online / Streaming</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div v-if="formCanal.id_tipo == '1'" class="animate-fade-in">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Número de Canal</label>
                                        <input type="text" v-model="formCanal.numero_canal" placeholder="Ej: 4, 6, 21"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                    </div>

                                    <div v-if="formCanal.id_tipo == '2'" class="animate-fade-in">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">URL del Sitio <span class="text-red-500">*</span></label>
                                        <input type="url" v-model="formCanal.url_sitio" placeholder="https://www.ejemplo.com" :required="formCanal.id_tipo == '2'"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Horario Habitual</label>
                                    <textarea v-model="formCanal.horario" rows="2" placeholder="Ej: Fines de semana de 7 PM a 10 PM"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                </div>

                                <div v-if="mensajeError" class="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 animate-fade-in">
                                    {{ mensajeError }}
                                </div>
                                <div v-if="mensajeExito" class="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200 animate-fade-in">
                                    {{ mensajeExito }}
                                </div>

                                <div class="flex justify-end space-x-4 pt-4 border-t">
                                    <button type="button" @click="toggleFormularioCanal" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                                        Cancelar
                                    </button>
                                    <button type="submit" :disabled="cargandoForm" class="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                                        <svg v-if="cargandoForm" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {{ cargandoForm ? 'Guardando...' : 'Guardar Canal' }}
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
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="canal in listaCanales" :key="canal.id_canal" class="hover:bg-gray-50">
                                            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ canal.nombre_canal }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span :class="canal.tipo_canal === 'satelital' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize border">
                                                    {{ canal.tipo_canal }}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span v-if="canal.tipo_canal === 'satelital'" class="font-medium text-gray-900">Canal: {{ canal.numero_canal || 'N/A' }}</span>
                                                <a v-else-if="canal.url_sitio" :href="canal.url_sitio" target="_blank" class="text-indigo-600 hover:text-indigo-900 hover:underline flex items-center">
                                                    Ver link
                                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                </a>
                                                <span v-else>N/A</span>
                                            </td>
                                            <td class="px-6 py-4 text-sm text-gray-500">
                                                <span class="truncate block max-w-xs" :title="canal.horario">{{ canal.horario || 'Sin definir' }}</span>
                                            </td>
                                        </tr>
                                        <tr v-if="listaCanales && listaCanales.length === 0">
                                            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                                <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                No hay canales registrados aún. Comienza agregando uno nuevo.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div v-if="activeTab === 'cuentas'" class="space-y-6 animate-fade-in">
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

                    <div v-if="activeTab === 'torneo'" class="animate-fade-in">
                        <CrearTorneo />
                    </div>

                    <div v-if="activeTab === 'partidos'" class="animate-fade-in">
                        <GestionPartidos />
                    </div>
                    <div v-if="activeTab === 'gestion-torneos'" class="animate-fade-in">
                        <EditarTorneos />
                    </div>
                    <div v-if="activeTab === 'perfil'" class="animate-fade-in">
                        <AdminPerfil @perfil-actualizado="actualizarNombreNavBar" />
                    </div>

                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import CrearTorneo from '../views/Admin/CrearTorneo.vue'
import GestionPartidos from '../views/Admin/GestionPartidos.vue' 
import EditarTorneos from '../views/Admin/EditarTorneos.vue'
import AdminPerfil from '../views/Admin/AdminPerfil.vue'
import { obtenerCanalesService, crearCanalService } from '../services/canalService'
import { obtenerUsuariosService, crearUsuarioService } from '../services/usuarioService'

const router = useRouter()
const activeTab = ref('canales') 
const actualizarNombreNavBar = (nuevoNombre) => {
    userName.value = nuevoNombre;
}
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioGuardado.nombre || 'Administrador')

const mostrandoFormulario = ref(false)
const listaCanales = ref([])
const cargandoForm = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')

const formCanal = ref({
    nombre_canal: '',
    id_tipo: '1', 
    numero_canal: '',
    url_sitio: '',
    horario: ''
})

const cargarCanales = async () => {
    try {
        listaCanales.value = await obtenerCanalesService()
    } catch (error) {
        console.error("Error cargando canales:", error)
    }
}

const toggleFormularioCanal = () => {
    mostrandoFormulario.value = !mostrandoFormulario.value
    mensajeError.value = ''
    mensajeExito.value = ''
    
    if (!mostrandoFormulario.value) {
        formCanal.value = { nombre_canal: '', id_tipo: '1', numero_canal: '', url_sitio: '', horario: '' }
    }
}

const handleCrearCanal = async () => {
    mensajeError.value = ''
    mensajeExito.value = ''
    cargandoForm.value = true

    try {
        const payload = {
            nombre_canal: formCanal.value.nombre_canal,
            id_tipo: parseInt(formCanal.value.id_tipo, 10),
            numero_canal: formCanal.value.id_tipo === '1' ? formCanal.value.numero_canal : null,
            url_sitio: formCanal.value.id_tipo === '2' ? formCanal.value.url_sitio : null,
            horario: formCanal.value.horario
        }

        await crearCanalService(payload)
        
        mensajeExito.value = '¡Canal registrado exitosamente!'
        await cargarCanales() 
        
        setTimeout(() => {
            toggleFormularioCanal()
        }, 1500)

    } catch (error) {
        mensajeError.value = error.response?.data?.error || 'Ocurrió un error al guardar el canal.'
    } finally {
        cargandoForm.value = false
    }
}

const mostrandoFormCuenta = ref(false)
const listaCuentas = ref([])
const cargandoFormCuenta = ref(false)
const mensajeErrorCuenta = ref('')
const mensajeExitoCuenta = ref('')

const formCuenta = ref({
    nombre: '',
    email: '',
    password: '',
    rol: ''
})

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
        await cargarCuentas() // Refrescar la tabla
        
        setTimeout(() => {
            toggleFormularioCuenta()
        }, 1500)
    } catch (error) {
        mensajeErrorCuenta.value = error.response?.data?.error || 'Error al crear la cuenta.'
    } finally {
        cargandoFormCuenta.value = false
    }
}

onMounted(() => {
    cargarCanales()
    cargarCuentas()
})

const navigateTo = (tab) => {
    activeTab.value = tab
    // Si cambiamos de pestaña, nos aseguramos de no dejar los formularios abiertos
    mostrandoFormulario.value = false 
    mostrandoFormCuenta.value = false
}

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('token')
    router.push('/login')
}
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