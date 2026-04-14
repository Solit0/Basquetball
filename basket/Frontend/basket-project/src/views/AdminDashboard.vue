<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <NavbarAdmin :userName="userName" />
        <div class="flex flex-1 overflow-hidden">
            <AdminSidebar :activeTab="activeTab" @navigate="navigateTo" />
            <main class="flex-1 overflow-auto bg-gray-50">
                <div class="py-6 px-4 sm:px-6 lg:px-8">
                    <Canales v-if="activeTab === 'canales'" />
                    <Cuentas v-if="activeTab === 'cuentas'" />
                    <CrearTorneo v-if="activeTab === 'torneo'" class="animate-fade-in" />
                    <GestionPartidos v-if="activeTab === 'partidos'" class="animate-fade-in" />
                    <EditarTorneos v-if="activeTab === 'gestion-torneos'" class="animate-fade-in" />
                    <AdminPerfil v-if="activeTab === 'perfil'" @perfil-actualizado="actualizarNombreNavBar" class="animate-fade-in" />
                    <CalendarioPartidos v-if="activeTab === 'calendario'" :esAdmin="true" class="animate-fade-in" />
                    <Resoluciones v-if="activeTab === 'resoluciones'" class="animate-fade-in" />
                    <HistorialResoluciones v-if="activeTab === 'historial-resoluciones'" class="animate-fade-in" />
                    <HistorialTorneos v-if="activeTab === 'historial-torneos'" class="animate-fade-in" />
                    <Estadisticas v-if="activeTab === 'estadisticas'" class="animate-fade-in" />
                    <GestionarTaquilla v-if="activeTab === 'taquilla'" class="animate-fade-in" />
                </div>
            </main>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import NavbarAdmin from '../components/NavbarAdmin.vue'
import AdminSidebar from '../components/AdminSidebar.vue'
import Canales from './Admin/Canales.vue'
import Cuentas from './Admin/Cuentas.vue'
import CrearTorneo from './Admin/CrearTorneo.vue'
import GestionPartidos from './Admin/GestionPartidos.vue' 
import EditarTorneos from './Admin/EditarTorneos.vue'
import AdminPerfil from './Admin/AdminPerfil.vue'
import CalendarioPartidos from './Espectadores/CalendarioPartidos.vue'
import Resoluciones from './Admin/Resoluciones.vue'
import HistorialResoluciones from './Admin/HistorialResoluciones.vue'
import HistorialTorneos from './Admin/HistorialTorneos.vue'
import Estadisticas from './Admin/Estadisticas.vue'
import GestionarTaquilla from './Admin/GestionarTaquilla.vue'
const activeTab = ref('canales') 
const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioGuardado.nombre || 'Administrador')
const navigateTo = (tab) => {
    activeTab.value = tab
}
const actualizarNombreNavBar = (nuevoNombre) => {
    userName.value = nuevoNombre;
    const updatedUser = { ...usuarioGuardado, nombre: nuevoNombre };
    localStorage.setItem('usuario', JSON.stringify(updatedUser));
}
</script>