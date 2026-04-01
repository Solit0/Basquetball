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
                                <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                                    <button v-if="modoCanales !== 'lista'" @click="modoCanales = 'lista'" class="mr-3 text-indigo-600 hover:text-indigo-800 transition-colors">
                                        &larr;
                                    </button>
                                    Canales de Transmisión
                                </h2>
                                <p class="mt-2 text-gray-600">Administra los canales y asigna partidos a la parrilla de programación.</p>
                            </div>
                            <button v-if="modoCanales === 'lista'" @click="modoCanales = 'crear'" class="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition">
                                + Nuevo Canal
                            </button>
                        </div>
                        
                        <div v-if="modoCanales === 'crear'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
                            <h3 class="text-xl font-bold text-gray-900 mb-6">Registrar Nuevo Canal</h3>
                            
                            <form @submit.prevent="handleCrearCanal" class="space-y-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Canal <span class="text-red-500">*</span></label>
                                        <input type="text" v-model="formCanal.nombre_canal" required placeholder="Ej: Fox Sports"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Transmisión <span class="text-red-500">*</span></label>
                                        <select v-model="formCanal.id_tipo" required class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                                            <option value="" disabled>Seleccione un tipo...</option>
                                            <option value="Online">Online</option>
                                            <option value="TV">TV</option>
                                            <option value="Radio">Radio</option>
                                            <option value="Streaming">Streaming</option>
                                            <option value="Satelital">Satelital</option>
                                        </select>
                                    </div>

                                    <div v-if="['TV', 'Satelital'].includes(formCanal.id_tipo)" class="animate-fade-in">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Número de Canal</label>
                                        <input type="text" v-model="formCanal.numero_canal" placeholder="Ej: 4, 6, 21"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                    </div>

                                    <div v-if="['Online', 'Streaming', 'Radio'].includes(formCanal.id_tipo)" class="animate-fade-in">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">URL del Sitio <span class="text-red-500">*</span></label>
                                        <input type="url" v-model="formCanal.url_sitio" placeholder="https://www.ejemplo.com" required
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Horario Habitual</label>
                                    <textarea v-model="formCanal.horario" rows="2" placeholder="Ej: Fines de semana de 7 PM a 10 PM"
                                        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
                                </div>

                                <div v-if="mensajeError" class="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 animate-fade-in">
                                    {{ mensajeError }}
                                </div>
                                <div v-if="mensajeExito" class="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200 animate-fade-in">
                                    {{ mensajeExito }}
                                </div>

                                <div class="flex justify-end space-x-4 pt-4 border-t">
                                    <button type="button" @click="modoCanales = 'lista'" class="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-md hover:bg-gray-300 transition">
                                        Cancelar
                                    </button>
                                    <button type="submit" :disabled="cargandoForm" class="flex items-center px-6 py-2 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                                        <svg v-if="cargandoForm" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {{ cargandoForm ? 'Guardando...' : 'Guardar Canal' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div v-else-if="modoCanales === 'asignar'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 animate-fade-in">
                            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                                <div>
                                    <h3 class="text-xl font-black text-gray-900">Parrilla de Programación</h3>
                                    <p class="text-sm font-bold text-indigo-600 mt-1 uppercase tracking-widest">{{ canalParaAsignar.nombre_canal }} ({{ canalParaAsignar.tipo_canal }})</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                
                                <div class="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                                    <h4 class="font-black text-indigo-900 uppercase tracking-widest text-xs mb-4">Añadir Partido a Transmisión</h4>
                                    
                                    <div class="space-y-5">
                                        <div>
                                            <label class="block text-xs font-bold text-gray-700 mb-1">Paso 1: Torneo</label>
                                            <select v-model="torneoAsignacionId" @change="cargarPartidosDelTorneo" class="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                                <option value="">Seleccione un torneo...</option>
                                                <option v-for="t in torneosDisponibles" :key="t.id_torneo" :value="t.id_torneo">{{ t.nombre_torneo }}</option>
                                            </select>
                                        </div>

                                        <div v-if="torneoAsignacionId">
                                            <label class="block text-xs font-bold text-gray-700 mb-1">Paso 2: Partido Programado</label>
                                            <select v-model="partidoAsignacionId" class="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                                <option value="">Seleccione un encuentro...</option>
                                                <option v-for="p in partidosDelTorneo" :key="p.id_partido" :value="p.id_partido">
                                                    {{ p.fecha.split('T')[0] }} ({{ p.hora }}) | {{ p.local_nombre }} vs {{ p.visitante_nombre }}
                                                </option>
                                            </select>
                                        </div>

                                        <div v-if="partidoSeleccionadoPreview" class="bg-white p-5 rounded-xl border border-indigo-200 shadow-sm mt-4 relative overflow-hidden">
                                            <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                                            <p class="text-[10px] text-gray-500 font-black uppercase mb-3 ml-2">Previa de Emisión</p>
                                            
                                            <div class="flex justify-between items-center mb-2 ml-2">
                                                <span class="text-sm font-medium text-gray-600">Salto Inicial Oficial:</span>
                                                <span class="font-black text-gray-900">{{ partidoSeleccionadoPreview.hora }}</span>
                                            </div>
                                            <div class="flex justify-between items-center bg-amber-50 p-2 rounded ml-2 border border-amber-100">
                                                <span class="text-sm font-bold text-amber-800">Inicio Transmisión (-20m):</span>
                                                <span class="font-black text-amber-600">{{ calcularHoraTransmision(partidoSeleccionadoPreview.hora) }}</span>
                                            </div>
                                            
                                            <button @click="handleAsignarTransmision" class="w-full ml-2 mt-4 py-3 bg-indigo-600 text-white font-black uppercase text-sm tracking-widest rounded-lg hover:bg-indigo-700 transition shadow-sm">
                                                Confirmar Asignación
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 class="font-black text-gray-800 uppercase tracking-widest text-xs mb-4">Cartelera Actual</h4>
                                    
                                    <div v-if="carteleraCanal.length === 0" class="text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm italic">
                                        No hay partidos programados para transmitir.
                                    </div>
                                    
                                    <div v-else class="space-y-4">
                                        <div v-for="t in carteleraCanal" :key="t.id_transmision" class="bg-white border border-gray-200 p-4 rounded-xl shadow-sm flex justify-between items-center">
                                            <div>
                                                <p class="text-[10px] font-black text-indigo-500 uppercase">{{ t.torneo_nombre }}</p>
                                                <p class="font-bold text-gray-900 text-sm mt-0.5">{{ t.encuentro }}</p>
                                                <div class="flex items-center text-xs text-gray-600 mt-2 font-medium">
                                                    <span class="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 mr-2">{{ t.fecha.split('T')[0] }}</span>
                                                    <span>AL AIRE: <strong class="text-red-600 ml-1">{{ t.hora_transmision.substring(0,5) }}</strong></span>
                                                </div>
                                            </div>
                                            <button @click="quitarTransmision(t.id_transmision)" class="text-gray-400 hover:text-red-600 p-2 bg-gray-50 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-200">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            <div v-for="canal in listaCanales" :key="canal.id_canal" 
                                 class="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-indigo-400 transition-all hover:shadow-lg flex flex-col justify-between">
                                
                                <div>
                                    <div class="flex justify-between items-start mb-4">
                                        <h4 class="text-xl font-black text-gray-900">{{ canal.nombre_canal }}</h4>
                                        <span :class="{
                                            'bg-blue-100 text-blue-800': ['TV', 'Satelital'].includes(canal.tipo_canal),
                                            'bg-green-100 text-green-800': ['Online', 'Streaming'].includes(canal.tipo_canal),
                                            'bg-yellow-100 text-yellow-800': canal.tipo_canal === 'Radio'
                                        }" class="px-2 py-1 text-[10px] font-black rounded uppercase">
                                            {{ canal.tipo_canal }}
                                        </span>
                                    </div>
                                    
                                    <div class="text-sm text-gray-600 font-medium space-y-2 mb-6">
                                        <p v-if="['TV', 'Satelital'].includes(canal.tipo_canal) && canal.numero_canal" class="flex items-center">
                                            <span class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200 mr-2 text-xs">CH</span>
                                            {{ canal.numero_canal }}
                                        </p>
                                        <a v-if="canal.url_sitio" :href="canal.url_sitio" target="_blank" class="text-indigo-600 hover:underline block truncate" title="Abrir URL">
                                            {{ canal.url_sitio }}
                                        </a>
                                        <p class="text-xs text-gray-500 italic mt-2 border-t pt-2">{{ canal.horario || 'Horario no definido' }}</p>
                                    </div>
                                </div>

                                <button @click="abrirAsignacionPartidos(canal)" class="w-full mt-auto py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center border border-indigo-100">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                    Programar Partidos
                                </button>
                            </div>

                            <div v-if="listaCanales.length === 0" class="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                                No hay canales registrados.
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

                    <div v-if="activeTab === 'torneo'" class="animate-fade-in"><CrearTorneo /></div>
                    <div v-if="activeTab === 'partidos'" class="animate-fade-in"><GestionPartidos /></div>
                    <div v-if="activeTab === 'gestion-torneos'" class="animate-fade-in"><EditarTorneos /></div>
                    <div v-if="activeTab === 'perfil'" class="animate-fade-in"><AdminPerfil @perfil-actualizado="actualizarNombreNavBar" /></div>

                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '../components/AdminSidebar.vue'
import CrearTorneo from '../views/Admin/CrearTorneo.vue'
import GestionPartidos from '../views/Admin/GestionPartidos.vue' 
import EditarTorneos from '../views/Admin/EditarTorneos.vue'
import AdminPerfil from '../views/Admin/AdminPerfil.vue'
import CalendarioPartidos from '../views/Espectadores/CalendarioPartidos.vue'

import { 
    obtenerCanalesService, 
    crearCanalService,
    asignarTransmisionService,
    obtenerTransmisionesPorCanalService,
    eliminarTransmisionService
} from '../services/canalService'

import { obtenerUsuariosService, crearUsuarioService } from '../services/usuarioService'
import { obtenerTorneosActivosService } from '../services/torneosService'
import { obtenerPartidosPorTorneo } from '../services/partidosService'

const router = useRouter()
const activeTab = ref('canales') 
const actualizarNombreNavBar = (nuevoNombre) => {
    userName.value = nuevoNombre;
}
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioGuardado.nombre || 'Administrador')

const modoCanales = ref('lista') 
const listaCanales = ref([])
const cargandoForm = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')
const formCanal = ref({
    nombre_canal: '', id_tipo: '', numero_canal: '', url_sitio: '', horario: ''
})

const canalParaAsignar = ref(null)
const torneosDisponibles = ref([])
const torneoAsignacionId = ref('')
const partidosDelTorneo = ref([])
const partidoAsignacionId = ref('')
const carteleraCanal = ref([]) 

const cargarCanales = async () => {
    try {
        const data = await obtenerCanalesService()
        listaCanales.value = [...data] 
    } catch (error) {
        console.error("Error cargando canales:", error)
    }
}

const handleCrearCanal = async () => {
    mensajeError.value = ''
    mensajeExito.value = ''
    cargandoForm.value = true

    try {
        const payload = {
            nombre_canal: formCanal.value.nombre_canal,
            id_tipo: formCanal.value.id_tipo, 
            numero_canal: ['TV', 'Satelital'].includes(formCanal.value.id_tipo) ? formCanal.value.numero_canal : null,
            url_sitio: ['Online', 'Streaming', 'Radio'].includes(formCanal.value.id_tipo) ? formCanal.value.url_sitio : null,
            horario: formCanal.value.horario
        }
        
        await crearCanalService(payload)
        mensajeExito.value = '¡Canal registrado exitosamente!'
        
        await cargarCanales() 
        
        formCanal.value = { nombre_canal: '', id_tipo: '', numero_canal: '', url_sitio: '', horario: '' }
        
        setTimeout(() => { 
            modoCanales.value = 'lista' 
        }, 1500)
    } catch (error) {
        mensajeError.value = error.response?.data?.error || 'Ocurrió un error al guardar el canal.'
    } finally {
        cargandoForm.value = false
    }
}

const abrirAsignacionPartidos = async (canal) => {
    canalParaAsignar.value = canal
    modoCanales.value = 'asignar'
    torneoAsignacionId.value = ''
    partidoAsignacionId.value = ''
    partidosDelTorneo.value = []
    
    try {
        const torneosRaw = await obtenerTorneosActivosService();
        torneosDisponibles.value = torneosRaw.filter(t => t.estado === 'En curso');
        carteleraCanal.value = await obtenerTransmisionesPorCanalService(canal.id_canal);
    } catch(e) {
        console.error("Error obteniendo datos de asignación", e);
    }
}

const cargarPartidosDelTorneo = async () => {
    partidoAsignacionId.value = '';
    if (!torneoAsignacionId.value) return;
    try {
        const partidos = await obtenerPartidosPorTorneo(torneoAsignacionId.value);
        partidosDelTorneo.value = partidos.filter(p => p.estado !== 'Finalizado');
    } catch(e) {
        console.error("Error obteniendo partidos", e);
    }
}

const partidoSeleccionadoPreview = computed(() => {
    if (!partidoAsignacionId.value) return null;
    return partidosDelTorneo.value.find(p => p.id_partido === partidoAsignacionId.value);
})

const calcularHoraTransmision = (horaPartido) => {
    if (!horaPartido) return '';
    const [h, m] = horaPartido.split(':').map(Number);
    let date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() - 20); 
    return date.toTimeString().substring(0, 5); 
}

const handleAsignarTransmision = async () => {
    const partido = partidoSeleccionadoPreview.value;
    if (!partido) return;

    const fechaPartido = partido.fecha.split('T')[0];
    const horaTrans = calcularHoraTransmision(partido.hora);

    const asignacionesDelDia = carteleraCanal.value.filter(t => t.fecha.split('T')[0] === fechaPartido);
    
    if (asignacionesDelDia.length >= 3) {
        return alert(`REGLA DE NEGOCIO: Este canal ya superó el límite de 3 transmisiones para el día ${fechaPartido}.`);
    }

    const [hNueva, mNueva] = horaTrans.split(':').map(Number);
    const minutosNuevaTrans = (hNueva * 60) + mNueva;

    for (const t of asignacionesDelDia) {
        const [hExistente, mExistente] = t.hora_transmision.split(':').map(Number);
        const minutosExistente = (hExistente * 60) + mExistente;
        const diferenciaMinutos = Math.abs(minutosNuevaTrans - minutosExistente);

        if (diferenciaMinutos < 240) {
            const horasFaltantes = (240 - diferenciaMinutos) / 60;
            return alert(`CRUCE DE HORARIOS: Ya hay un partido programado a las ${t.hora_transmision.substring(0, 5)}.\n\nDebe haber al menos 4 horas de diferencia entre cada evento para evitar cortes. (Faltan ${horasFaltantes.toFixed(1)} horas).`);
        }
    }

    try {
        await asignarTransmisionService(canalParaAsignar.value.id_canal, {
            id_partido: partido.id_partido,
            hora_transmision: horaTrans
        });
        
        alert("¡Partido asignado a la parrilla de programación exitosamente!");
        partidoAsignacionId.value = '';
        carteleraCanal.value = await obtenerTransmisionesPorCanalService(canalParaAsignar.value.id_canal);
    } catch (error) {
        alert(error.response?.data?.error || "Error al asignar el partido.");
    }
}

const quitarTransmision = async (idTransmision) => {
    if(!confirm("¿Estás seguro de quitar este partido de la programación del canal?")) return;
    
    try {
        await eliminarTransmisionService(idTransmision);
        carteleraCanal.value = carteleraCanal.value.filter(t => t.id_transmision !== idTransmision);
    } catch (error) {
        alert("Ocurrió un error al intentar eliminar la transmisión.");
    }
}

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
    cargarCanales()
    cargarCuentas()
})

const navigateTo = (tab) => {
    activeTab.value = tab
    modoCanales.value = 'lista'
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
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>