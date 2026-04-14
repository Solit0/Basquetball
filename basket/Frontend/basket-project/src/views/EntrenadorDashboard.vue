<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <NavbarEntrenador :userName="userName" />

        <div class="flex flex-1 overflow-hidden">
            <Sidebar :activeTab="activeTab" :hasTeam="hasTeam" @navigate="navigateTo" />

            <main class="flex-1 overflow-auto bg-gray-50/50">
                <div class="py-8 px-6 sm:px-8 lg:px-10">
                    
                    <MiEquipo v-if="activeTab === 'equipo'" 
                        :equipo="equipoActual" 
                        :estadisticas="estadisticas" 
                        :hasTeam="hasTeam"
                        @edit="showEditarEquipoModal = true"
                        @toggle="toggleTeamStatus"
                        @leave="abandonarEquipoDirigido"
                    />

                    <Jugadores v-if="activeTab === 'jugadores'" 
                        :equipo="equipoActual" 
                        @cambio-jugadores="cargarEstadisticas" 
                    />

                    <MisTorneos v-if="activeTab === 'torneo'" />
                    <InscribirTorneos v-if="activeTab === 'inscribir-torneos'" />
                    <CalendarioPartidos v-if="activeTab === 'calendario-partidos'" />
                    <HistorialPartidos v-if="activeTab === 'torneos-jugados'" />
                    <ActualizarZona v-if="activeTab === 'actualizar-zona'" :equipo="equipoActual" />
                    <Perfil v-if="activeTab === 'perfil'" @perfil-actualizado="actualizarNombreNavbar" />

                </div>
            </main>
        </div>

        <EditarEquipo 
            :show="showEditarEquipoModal"
            :equipo="equipoActual"
            @close="showEditarEquipoModal = false"
            @save="saveTeam"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../Enviroments/enviroment'
import { obtenerEquipoDeEntrenadorService, actualizarEquipoService } from '../services/equiposService'

import Sidebar from '../components/Sidebar.vue'
import NavbarEntrenador from '../components/NavbarEntrenador.vue' 
import EditarEquipo from '../modals/EditarEquipo.vue'
import ActualizarZona from './Entrenador/ActualizarZona.vue'
import MiEquipo from './Entrenador/MiEquipo.vue' 
import Jugadores from './Entrenador/Jugadores.vue' 
import MisTorneos from './Entrenador/MisTorneos.vue' 
import InscribirTorneos from './Entrenador/InscribirTorneos.vue'
import HistorialPartidos from './Entrenador/HistorialPartidos.vue'
import CalendarioPartidos from './Espectadores/CalendarioPartidos.vue'
import Perfil from './Entrenador/Perfil.vue'

const activeTab = ref('equipo')
const usuarioData = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioData.nombre || 'Entrenador')
const showEditarEquipoModal = ref(false)
const hasTeam = ref(false)
const equipoActual = ref(null)
const estadisticas = ref(null)

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
        if (error.response?.status === 404) hasTeam.value = false;
        else console.error("Error al obtener el equipo:", error);
    }
}

const cargarEstadisticas = async () => {
    if (!equipoActual.value) return;
    try {
        const response = await api.get(`/equipos/${equipoActual.value.id_equipo}/estadisticas`)
        estadisticas.value = response.data
    } catch (error) {
        console.error('Error al cargar estadísticas:', error)
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
    if (confirm(`¿Estás TOTALMENTE seguro de que deseas abandonar el equipo "${equipoActual.value.nombre_oficial}"?`)) {
        try {
            await api.post(`/equipos/${equipoActual.value.id_equipo}/abandonar`);
            alert('Has abandonado el equipo exitosamente.');
            equipoActual.value = null;
            hasTeam.value = false;
            estadisticas.value = null;
            activeTab.value = 'equipo';
        } catch (error) {
            alert(error.response?.data?.error || 'Error al intentar abandonar el equipo.');
        }
    }
}
const saveTeam = async (updatedData) => {
    try {
        await actualizarEquipoService(equipoActual.value.id_equipo, updatedData)
        equipoActual.value = { ...equipoActual.value, ...updatedData }
        alert('Datos actualizados correctamente')
        showEditarEquipoModal.value = false
    } catch (error) {
        alert(error.response?.data?.error || 'Error al actualizar equipo')
    }
}
const navigateTo = (tab) => activeTab.value = tab
const actualizarNombreNavbar = (nuevoNombre) => userName.value = nuevoNombre
onMounted(async () => {
    await obtenerMiEquipo()
})
</script>
<style scoped>
</style>