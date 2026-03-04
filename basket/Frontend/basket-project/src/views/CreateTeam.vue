<template>
    <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">

        <nav class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <div class="shrink-0">
                            <h1 class="text-2xl font-bold text-indigo-600">BasketPro</h1>
                        </div>
                    </div>
                    <div class="hidden md:block">
                        <button @click="logout"
                            class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-900 mb-4">Crear Equipo</h2>
                    <p class="text-lg text-gray-600">Completa los siguientes pasos para registrar tu equipo en el
                        sistema</p>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <form @submit.prevent="handleCreateTeam" class="space-y-8">
                        <!-- Sección 1: Información Básica del Equipo -->
                        <div class="border-b pb-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-6">Información del Equipo</h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Nombre Oficial del Equipo -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre Oficial del Equipo
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.teamName"
                                        @blur="validateTeamName"
                                        placeholder="Ej: Los Lakers"
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        required />
                                    <p v-if="errors.teamName" class="text-red-500 text-sm mt-2">
                                        {{ errors.teamName }}
                                    </p>
                                    <p v-if="successMessages.teamName" class="text-green-500 text-sm mt-2">
                                        {{ successMessages.teamName }}
                                    </p>
                                </div>

                                <!-- Siglas o Abreviaturas -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                                        Siglas o Abreviaturas
                                        <span class="text-red-500">*</span>
                                    </label>
                                    <input type="text" v-model="form.teamAbbreviation"
                                        @input="form.teamAbbreviation = form.teamAbbreviation.toUpperCase()"
                                        placeholder="Ej: LAL"
                                        maxlength="5"
                                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        required />
                                    <p class="text-gray-500 text-xs mt-2">Máximo 5 caracteres</p>
                                </div>
                            </div>
                        </div>

                        <!-- Sección 2: Clasificación del Equipo -->
                        <div class="border-b pb-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-6">Clasificación</h3>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <label class="relative block cursor-pointer">
                                    <input type="radio" value="varonil" v-model="form.classification"
                                        class="sr-only" required />
                                    <div :class="[
                                        'p-4 border-2 rounded-lg transition',
                                        form.classification === 'varonil'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-300 bg-white hover:border-indigo-300'
                                    ]">
                                        <div class="flex items-center">
                                            <svg class="h-6 w-6"
                                                :class="form.classification === 'varonil' ? 'text-indigo-600' : 'text-gray-400'"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span class="ml-3 text-sm font-semibold text-gray-900">Varonil</span>
                                        </div>
                                    </div>
                                </label>

                                <label class="relative block cursor-pointer">
                                    <input type="radio" value="femenil" v-model="form.classification"
                                        class="sr-only" required />
                                    <div :class="[
                                        'p-4 border-2 rounded-lg transition',
                                        form.classification === 'femenil'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-300 bg-white hover:border-indigo-300'
                                    ]">
                                        <div class="flex items-center">
                                            <svg class="h-6 w-6"
                                                :class="form.classification === 'femenil' ? 'text-indigo-600' : 'text-gray-400'"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M10 1a3 3 0 00-3 3v1H5a3 3 0 00-3 3v8a3 3 0 003 3h10a3 3 0 003-3v-8a3 3 0 00-3-3h-2V4a3 3 0 00-3-3zm0 2a1 1 0 100 2 1 1 0 000-2z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span class="ml-3 text-sm font-semibold text-gray-900">Femenil</span>
                                        </div>
                                    </div>
                                </label>

                                <label class="relative block cursor-pointer">
                                    <input type="radio" value="mixto" v-model="form.classification"
                                        class="sr-only" required />
                                    <div :class="[
                                        'p-4 border-2 rounded-lg transition',
                                        form.classification === 'mixto'
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-gray-300 bg-white hover:border-indigo-300'
                                    ]">
                                        <div class="flex items-center">
                                            <svg class="h-6 w-6"
                                                :class="form.classification === 'mixto' ? 'text-indigo-600' : 'text-gray-400'"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                            <span class="ml-3 text-sm font-semibold text-gray-900">Mixto</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div class="pb-8">
                            <h3 class="text-2xl font-bold text-gray-900 mb-6">Sede Local</h3>

                            <div class="space-y-6">
                                <div class="flex space-x-4 border-b border-gray-200">
                                    <button type="button" @click="courtTab = 'select'"
                                        :class="[
                                            'px-4 py-2 font-medium border-b-2 transition',
                                            courtTab === 'select'
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        ]">
                                        Seleccionar Cancha Existente
                                    </button>
                                    <button type="button" @click="courtTab = 'new'"
                                        :class="[
                                            'px-4 py-2 font-medium border-b-2 transition',
                                            courtTab === 'new'
                                                ? 'border-indigo-600 text-indigo-600'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        ]">
                                        Ingresar Nueva Cancha
                                    </button>
                                </div>

                                <div v-if="courtTab === 'select'" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                                            Buscar Cancha
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <input type="text" v-model="courtSearch"
                                            @input="filterCourts"
                                            placeholder="Busca por nombre o ubicación..."
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
                                    </div>

                                    <div class="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                                        <label v-for="court in filteredCourts" :key="court.id"
                                            class="relative block cursor-pointer">
                                            <input type="radio" :value="court.id" v-model="form.courtId"
                                                class="sr-only" />
                                            <div :class="[
                                                'p-4 border-2 rounded-lg transition',
                                                form.courtId === court.id
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-gray-300 bg-white hover:border-indigo-300'
                                            ]">
                                                <p class="font-semibold text-gray-900">{{ court.name }}</p>
                                                <p class="text-sm text-gray-600">{{ court.address }}</p>
                                                <p class="text-xs text-gray-500 mt-1">Capacidad: {{ court.capacity }}
                                                    personas</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div v-if="courtTab === 'new'" class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre de la Cancha
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <input type="text" v-model="form.newCourtName"
                                            placeholder="Ej: Cancha Municipal"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                            :required="courtTab === 'new'" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                                            Dirección
                                            <span class="text-red-500">*</span>
                                        </label>
                                        <input type="text" v-model="form.newCourtAddress"
                                            placeholder="Ej: Calle Principal 123, San Salvador"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                            :required="courtTab === 'new'" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                                            Capacidad (aproximada)
                                        </label>
                                        <input type="number" v-model.number="form.newCourtCapacity"
                                            placeholder="Ej: 500"
                                            min="1"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="errors.general"
                            class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <svg class="h-5 w-5 text-red-500 mt-0.5 mr-3" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                            <p class="text-red-700">{{ errors.general }}</p>
                        </div>

                        <!-- Botones de acción -->
                        <div class="flex gap-4 pt-6">
                            <button type="submit"
                                class="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition transform hover:scale-105 flex items-center justify-center">
                                <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                                Crear Equipo
                            </button>
                            <button type="button" @click="cancelCreate"
                                class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>

                <div class="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                    <h4 class="font-semibold text-indigo-900 mb-2">¿Necesitas ayuda?</h4>
                    <p class="text-indigo-700 text-sm">Si tienes problemas para crear tu equipo, contacta al
                        administrador del sistema.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { crearEquipoService } from '../services/equiposService'
import { obtenerCanchasService, crearCanchaService } from '../services/canchaService'

const router = useRouter()

const form = ref({
    teamName: '',
    teamAbbreviation: '',
    classification: '',
    courtId: '',
    newCourtName: '',
    newCourtAddress: '',
    newCourtCapacity: null
})
    const successMessages = ref({
    teamName: ''
})
const courtTab = ref('select')
const courtSearch = ref('')

const errors = ref({
    teamName: '',
    general: ''
})

const availableCourts = ref([])
const filteredCourts = ref([])

onMounted(async () => {
    try {
        const canchas = await obtenerCanchasService()
        availableCourts.value = canchas
        filteredCourts.value = canchas
    } catch (error) {
        console.error("Error al cargar las canchas:", error)
    }
})

const filterCourts = () => {
    const search = courtSearch.value.toLowerCase()
    filteredCourts.value = availableCourts.value.filter(court =>
        court.name.toLowerCase().includes(search) ||
        court.address.toLowerCase().includes(search)
    )
}

const handleCreateTeam = async () => {
    errors.value.general = ''

    if (!form.value.teamName.trim() || !form.value.teamAbbreviation.trim() || !form.value.classification) {
        errors.value.general = 'Por favor completa todos los campos obligatorios'
        return
    }

    if (courtTab.value === 'select' && !form.value.courtId) {
        errors.value.general = 'Debes seleccionar una cancha existente'
        return
    }

    if (courtTab.value === 'new' && (!form.value.newCourtName.trim() || !form.value.newCourtAddress.trim())) {
        errors.value.general = 'El nombre y la dirección de la nueva cancha son obligatorios'
        return
    }

    const clasificacionMap = {
        'varonil': 1,
        'femenil': 2,
        'mixto': 3
    }

    try {
        let idCanchaFinal = null;

        if (courtTab.value === 'select') {
            idCanchaFinal = form.value.courtId;
        } else if (courtTab.value === 'new') {
            const nuevaCanchaPayload = {
                nombre_cancha: form.value.newCourtName,
                direccion: form.value.newCourtAddress,
                capacidad: form.value.newCourtCapacity || null
            };
            
            const respuestaCancha = await crearCanchaService(nuevaCanchaPayload);

            idCanchaFinal = respuestaCancha.cancha.id_cancha; 
        }

        const idEntrenador = localStorage.getItem('usuario_id'); 

        const payloadEquipo = {
            nombre_oficial: form.value.teamName,
            siglas: form.value.teamAbbreviation,
            id_clasificacion: clasificacionMap[form.value.classification],
            id_entrenador: idEntrenador,
            id_cancha: idCanchaFinal 
        }
        console.log("Datos que se enviarán al backend:", payloadEquipo);
        await crearEquipoService(payloadEquipo)
        
        router.push('/entrenador')

    } catch (error) {
        console.error("Error en el proceso:", error);
        if (error.response && error.response.data) {
            errors.value.general = error.response.data.error || 'Ocurrió un error en el servidor'
        } else {
            errors.value.general = 'Error de conexión con el servidor'
        }
    }
}

const cancelCreate = () => {
    router.push('/entrenador')
}

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    router.push('/login')
}
</script>

