<!--ruta: /views/EntrenadorDashboard.vue-->
<template>
    
    <div>
        <div class="min-h-screen bg-gray-50">
            <nav class="bg-white shadow-md">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="shrink-0">
                                <h1 class="text-2xl font-bold text-indigo-600">BasketPro</h1>
                            </div>
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-center space-x-4">
                                <span class="text-gray-900 px-3 py-2 text-sm font-medium">
                                    {{ userName }}
                                </span>
                                <button @click="logout"
                                    class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                
                <Sidebar :activeTab="activeTab" :hasTeam="hasTeam" @navigate="navigateTo" />

                <main class="flex-1 overflow-auto">
                    <div class="py-6 px-4 sm:px-6 lg:px-8">
                        
                        <div v-if="activeTab === 'equipo'" class="space-y-6">
                            <div v-if="hasTeam" class="space-y-6">
                                <div class="flex justify-between items-end bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div>
                                        <h2 class="text-3xl font-bold text-gray-900">
                                            {{ equipoActual ? equipoActual.nombre_oficial : 'Mi Equipo' }} 
                                            <span class="text-lg text-gray-500 font-normal ml-2">({{ equipoActual?.siglas }})</span>
                                            <span v-if="!equipoActual?.activo" 
                                                class="ml-3 px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                                                Inactivo
                                            </span>
                                        </h2>
                                        <p class="mt-2 text-gray-600">
                                            Sede: {{ equipoActual?.direccion_cancha || 'No definida' }} | 
                                            Categoría: <span class="capitalize">{{ equipoActual?.clasificacion || 'General' }}</span>
                                        </p>
                                    </div>
                                    <div class="flex space-x-3">
                                        <button @click="openEditTeamModal" 
                                            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
                                            Editar Datos
                                        </button>
                                        <button @click="toggleTeamStatus" 
                                            :class="[
                                                'px-4 py-2 rounded-md transition-colors shadow-sm font-medium',
                                                equipoActual?.activo 
                                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300' 
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                                            ]">
                                            {{ equipoActual?.activo ? 'Pausar Equipo' : 'Reactivar Equipo' }}
                                        </button>
                                        <button @click="abandonarEquipoDirigido" 
                                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors shadow-sm flex items-center">
                                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Abandonar
                                        </button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                        <p class="text-gray-600 text-sm">Jugadores Activos</p>
                                        <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.jugadores_activos || 0 }}</p>
                                    </div>
                                    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                        <p class="text-gray-600 text-sm">Partidos Jugados</p>
                                        <p class="text-3xl font-bold text-gray-900">{{ estadisticas?.partidos_jugados || 0 }}</p>
                                    </div>
                                    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                        <p class="text-gray-600 text-sm">Victorias</p>
                                        <p class="text-3xl font-bold text-green-600">{{ estadisticas?.victorias || 0 }}</p>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-200">
                                <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <svg class="h-12 w-12 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-900 mb-2">Aún no diriges ningún equipo</h2>
                                <p class="text-gray-600 mb-8 text-center max-w-md">Crea un equipo nuevo o únete a uno que no tenga entrenador.</p>
                                
                                <div class="flex space-x-4">
                                    <button @click="$router.push('/crear-equipo')" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center">
                                        Crear Equipo Nuevo
                                    </button>
                                    <button @click="irAEquiposLibres" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center">
                                        Unirme a un Equipo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="activeTab === 'jugadores'" class="space-y-6">
                            <div v-if="hasTeam">
                                <div class="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 class="text-3xl font-bold text-gray-900">Plantilla de Jugadores</h2>
                                        <p class="mt-2 text-gray-600">Gestiona los jugadores activos de tu equipo</p>
                                    </div>
                                    <button @click="openAddPlayerModal"
                                        class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm font-medium">
                                        + Fichar Jugador
                                    </button>
                                </div>

                                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    <div v-if="players.length === 0" class="text-center py-12">
                                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <h3 class="mt-2 text-sm font-medium text-gray-900">Plantilla vacía</h3>
                                        <p class="mt-1 text-sm text-gray-500">Comienza agregando jugadores a tu equipo.</p>
                                    </div>

                                    <table v-else class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol de Equipo</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capitán</th>
                                                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            <tr v-for="player in players" :key="player.id_jugador" class="hover:bg-gray-50">
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                                    {{ player.numero_camiseta }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="text-sm font-medium text-gray-900">{{ player.nombre }} {{ player.apellido }}</div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {{ player.posicion }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <span :class="player.rol_equipo === 'Titular' ? 'text-indigo-600' : 'text-gray-500'">
                                                        {{ player.rol_equipo || 'Suplente' }}
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span v-if="player.es_capitan" class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-200">
                                                        Capitán
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                                    <button @click="editPlayer(player)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                                                        Editar
                                                    </button>
                                                    <button @click="confirmDeletePlayer(player)" class="text-red-600 hover:text-red-900">
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
                                <p class="text-gray-600 mb-8 text-center max-w-md">Para gestionar jugadores, primero debes tener un equipo asignado.</p>
                                <div class="flex space-x-4">
                                    <button @click="$router.push('/crear-equipo')" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm">
                                        Crear Equipo
                                    </button>
                                    <button @click="irAEquiposLibres" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition shadow-sm">
                                        Unirme a Equipo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="activeTab === 'alineacion'" class="space-y-6">
                            
                            <div v-if="hasTeam" class="space-y-6">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h2 class="text-3xl font-bold text-gray-900">Alineación Base (Quinteto)</h2>
                                        <p class="mt-2 text-gray-600">Define los 5 titulares que iniciarán por defecto los partidos.</p>
                                    </div>
                                    <div :class="titularesCount === 5 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'" 
                                         class="px-4 py-2 rounded-md font-bold shadow-sm border">
                                        Titulares: {{ titularesCount }} / 5
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                                            <svg class="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            Titulares (En Cancha)
                                        </h3>
                                        <ul class="space-y-3">
                                            <li v-for="player in titulares" :key="player.id_jugador" 
                                                class="flex justify-between items-center p-3 bg-indigo-50 border border-indigo-100 rounded-lg transition-all hover:shadow-md">
                                                <div class="flex items-center">
                                                    <span class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm mr-3">
                                                        {{ player.numero_camiseta }}
                                                    </span>
                                                    <div>
                                                        <p class="font-bold text-indigo-900 leading-tight">
                                                            {{ player.nombre }} {{ player.apellido }}
                                                            <span v-if="player.es_capitan" class="ml-1 text-xs px-1.5 py-0.5 bg-yellow-400 text-yellow-900 rounded-sm">C</span>
                                                        </p>
                                                        <p class="text-xs text-indigo-600 font-medium">{{ player.posicion }}</p>
                                                    </div>
                                                </div>
                                                <button @click="cambiarRol(player, 'Suplente')" 
                                                        class="px-3 py-1 text-xs font-bold bg-white text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors">
                                                    Mover a Banca
                                                </button>
                                            </li>
                                            <li v-if="titulares.length === 0" class="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                                Tu cancha está vacía. Añade titulares desde la banca.
                                            </li>
                                        </ul>
                                    </div>

                                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                        <h3 class="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
                                            <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                            Suplentes (Banquillo)
                                        </h3>
                                        <ul class="space-y-3">
                                            <li v-for="player in suplentes" :key="player.id_jugador" 
                                                class="flex justify-between items-center p-3 bg-gray-50 border border-gray-200 rounded-lg transition-all hover:bg-gray-100">
                                                <div class="flex items-center">
                                                    <span class="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-bold text-sm mr-3">
                                                        {{ player.numero_camiseta }}
                                                    </span>
                                                    <div>
                                                        <p class="font-bold text-gray-900 leading-tight">
                                                            {{ player.nombre }} {{ player.apellido }}
                                                            <span v-if="player.es_capitan" class="ml-1 text-xs px-1.5 py-0.5 bg-yellow-400 text-yellow-900 rounded-sm">C</span>
                                                        </p>
                                                        <p class="text-xs text-gray-500 font-medium">{{ player.posicion }}</p>
                                                    </div>
                                                </div>
                                                <button @click="cambiarRol(player, 'Titular')" 
                                                        :disabled="titularesCount >= 5"
                                                        :class="titularesCount >= 5 ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors">
                                                    Hacer Titular
                                                </button>
                                            </li>
                                            <li v-if="suplentes.length === 0" class="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                                                No tienes jugadores en el banquillo.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-200">
                                <div class="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                                    <svg class="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-900 mb-2">Sección Bloqueada</h2>
                                <p class="text-gray-600 mb-8 text-center max-w-md">Para gestionar tu alineación titular, primero debes tener un equipo asignado.</p>
                                
                                <div class="flex space-x-4">
                                    <button @click="$router.push('/crear-equipo')" class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm">
                                        Crear Equipo
                                    </button>
                                    <button @click="irAEquiposLibres" class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition shadow-sm">
                                        Unirme a Equipo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div v-if="activeTab === 'torneo'" class="space-y-6">
                            <div>
                                <h2 class="text-3xl font-bold text-gray-900">Torneo Actual</h2>
                                <p class="mt-2 text-gray-600">Información del torneo y clasificaciones (Próximamente)</p>
                            </div>
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
                                <p class="text-gray-500">Aún no hay datos de torneos disponibles.</p>
                            </div>
                        </div>

                        <div v-if="activeTab === 'perfil'" class="space-y-6 max-w-3xl mx-auto">
                            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <svg class="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    Mi Perfil Personal
                                </h2>
                                
                                <form @submit.prevent="guardarPerfil" class="space-y-5">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                            <input type="text" v-model="perfilForm.nombre" required
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                            <input type="text" v-model="perfilForm.apellido" required
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                        <input type="email" v-model="perfilForm.correo" required
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50">
                                    </div>

                                    <div class="pt-4 flex justify-end">
                                        <button type="submit" :disabled="guardandoPerfil"
                                            class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center">
                                            <span v-if="guardandoPerfil">Guardando...</span>
                                            <span v-else>Actualizar Perfil</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>

        <ModalAgregarJugador 
            :show="showPlayerModal"
            :jugador="selectedPlayer"
            :jugadoresLibres="jugadoresLibres"
            @close="closePlayerModal"
            @save="savePlayer"
        />
        <EditarEquipo 
            :show="showEditarEquipoModal"
            :equipo="equipoActual"
            @close="showEditarEquipoModal = false"
            @save="saveTeam"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import EditarEquipo from '../modals/EditarEquipo.vue'
import ModalAgregarJugador from '../views/ModalAgregarJugador.vue'

import { api } from '../Enviroments/enviroment'
import { obtenerEquipoDeEntrenadorService, actualizarEquipoService } from '../services/equiposService'
import { 
    obtenerJugadoresPorEquipoService, 
    crearJugadorService, 
    actualizarJugadorService, 
    eliminarJugadorService,
    obtenerJugadoresLibresService,
    vincularJugadorService
} from '../services/jugadoresService'
import {actualizarPerfilService} from '../services/usuarioService'

const router = useRouter()
const activeTab = ref('equipo')
const jugadoresLibres = ref([])
const usuarioData = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioData.nombre || 'Entrenador')
const showEditarEquipoModal = ref(false)
const hasTeam = ref(false)
const equipoActual = ref(null)
const estadisticas = ref(null)
const guardandoPerfil = ref(false)
const players = ref([])
const showPlayerModal = ref(false)
const selectedPlayer = ref(null)
const perfilForm = ref({
    nombre: usuarioData.nombre || '',
    apellido: usuarioData.apellido || '',
    correo: usuarioData.correo || ''
})
const titulares = computed(() => players.value.filter(p => p.rol_equipo === 'Titular'))
const suplentes = computed(() => players.value.filter(p => p.rol_equipo !== 'Titular'))
const titularesCount = computed(() => titulares.value.length)

const obtenerMiEquipo = async () => {
    try {
        const idEntrenador = localStorage.getItem('usuario_id')
        const data = await obtenerEquipoDeEntrenadorService(idEntrenador)
        
        if (data) {
            hasTeam.value = true
            equipoActual.value = data
            await cargarEstadisticas()
        }
    } catch (error) {
        if (error.response?.status === 404) {
            hasTeam.value = false
        } else {
            console.error("Error al obtener el equipo:", error)
        }
    }
}
const guardarPerfil = async () => {
    guardandoPerfil.value = true;
    try {
        const idUsuario = localStorage.getItem('usuario_id');
        
        const respuesta = await actualizarPerfilService(idUsuario, perfilForm.value);
        
        const nuevoUsuarioLocal = { ...usuarioData, ...respuesta.usuario };
        
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuarioLocal));
        
        userName.value = respuesta.usuario.nombre;
        
        alert('Perfil actualizado exitosamente.');
    } catch (error) {
        
        alert(error.response?.data?.error || 'Error al actualizar el perfil.');
    } finally {
        guardandoPerfil.value = false;
    }
}
const cargarEstadisticas = async () => {
    if (equipoActual.value) {
        try {
            const response = await api.get(`/equipos/${equipoActual.value.id_equipo}/estadisticas`)
            estadisticas.value = response.data
        } catch (error) {
            console.error('Error al cargar estadísticas:', error)
        }
    }
}

const toggleTeamStatus = async () => {
    try {
        const endpoint = equipoActual.value.activo ? 'deshabilitar' : 'habilitar'
        await api.patch(`/equipos/${equipoActual.value.id_equipo}/${endpoint}`)
        equipoActual.value.activo = !equipoActual.value.activo
        alert(equipoActual.value.activo ? 'Equipo habilitado correctamente' : 'Equipo deshabilitado correctamente')
    } catch (error) {
        alert('Error al cambiar el estado del equipo')
    }
}

const abandonarEquipoDirigido = async () => {
    if (!equipoActual.value) return;
    const confirmacion = confirm(`¿Estás TOTALMENTE seguro de que deseas abandonar el equipo "${equipoActual.value.nombre_oficial}"?`);
    
    if (confirmacion) {
        try {
            await api.post(`/equipos/${equipoActual.value.id_equipo}/abandonar`);
            alert('Has abandonado el equipo exitosamente.');
            equipoActual.value = null;
            hasTeam.value = false;
            players.value = [];
            estadisticas.value = null;
        } catch (error) {
            alert(error.response?.data?.error || 'Ocurrió un error al intentar abandonar el equipo.');
        }
    }
}

const openEditTeamModal = () => {
    showEditarEquipoModal.value = true
}
const closeEditTeamModal = () => {
    showEditarEquipoModal.value = false
}
const saveTeam = async (updatedData) => {
    try {
        await actualizarEquipoService(equipoActual.value.id_equipo, updatedData)
        equipoActual.value = { ...equipoActual.value, ...updatedData }
        alert('Datos del equipo actualizados correctamente')
        closeEditTeamModal()
    } catch (error) {
        alert(error.response?.data?.error || 'Error al actualizar los datos del equipo')
    }
}
const cargarJugadores = async () => {
    if (equipoActual.value) {
        try {
            const data = await obtenerJugadoresPorEquipoService(equipoActual.value.id_equipo)
            players.value = data
        } catch (error) {
            console.error('Error al cargar jugadores:', error)
        }
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
                id_equipo: equipoActual.value.id_equipo 
            })
            alert('Jugador actualizado correctamente')
        } else if (payload.isAgenteLibre) {
            await vincularJugadorService(payload.data.id_jugador, {
                numero_camiseta: payload.data.numero_camiseta,
                es_capitan: payload.data.es_capitan,
                id_equipo: equipoActual.value.id_equipo
            })
            alert('Agente libre fichado correctamente')
        } else {
            await crearJugadorService({
                ...payload.data,
                id_equipo: equipoActual.value.id_equipo
            })
            alert('Nuevo jugador registrado correctamente')
        }
        await cargarJugadores()
        await cargarEstadisticas()
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
        await eliminarJugadorService(player.id_jugador, equipoActual.value.id_equipo)
        alert('Jugador dado de baja exitosamente')
        await cargarJugadores()
        await cargarEstadisticas()
    } catch (error) {
        alert('Error al dar de baja al jugador')
    }
}

const cambiarRol = async (player, nuevoRol) => {
    if (nuevoRol === 'Titular' && titularesCount.value >= 5) {
        alert('REGLA BALONCESTO: Tu equipo ya tiene 5 jugadores titulares asignados.');
        return;
    }
    try {
        await actualizarJugadorService(player.id_jugador, {
            ...player,
            fecha_nacimiento: player.fecha_nacimiento ? player.fecha_nacimiento.split('T')[0] : null,
            id_equipo: equipoActual.value.id_equipo,
            rol_equipo: nuevoRol 
        });
        await cargarJugadores();
    } catch (error) {
        alert(error.response?.data?.error || 'Ocurrió un error al intentar cambiar la alineación.');
    }
}

const navigateTo = (tab) => {
    activeTab.value = tab
}

const irAEquiposLibres = () => {
    router.push('/equipos-libres');
}

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    router.push('/login')
}

onMounted(async () => {
    await obtenerMiEquipo()
    if (equipoActual.value) {
        await cargarJugadores()
    }
})
</script>