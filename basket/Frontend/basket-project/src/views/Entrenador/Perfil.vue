<template>
    <div class="space-y-6 max-w-3xl mx-auto animate-fade-in">
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

                <div v-if="mensajeExito" class="p-3 bg-green-50 text-green-700 text-sm font-bold rounded-md border border-green-200">
                    {{ mensajeExito }}
                </div>
                
                <div v-if="mensajeError" class="p-3 bg-red-50 text-red-700 text-sm font-bold rounded-md border border-red-200">
                    {{ mensajeError }}
                </div>

                <div class="pt-4 flex justify-end">
                    <button type="submit" :disabled="guardandoPerfil" 
                            class="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center">
                        <svg v-if="guardandoPerfil" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>{{ guardandoPerfil ? 'Guardando...' : 'Actualizar Perfil' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { actualizarPerfilService } from '../../services/usuarioService'

const emit = defineEmits(['perfil-actualizado'])

const usuarioData = JSON.parse(localStorage.getItem('usuario') || '{}')
const guardandoPerfil = ref(false)
const mensajeExito = ref('')
const mensajeError = ref('')

const perfilForm = ref({
    nombre: usuarioData.nombre || '',
    apellido: usuarioData.apellido || '',
    correo: usuarioData.correo || ''
})

const guardarPerfil = async () => {
    guardandoPerfil.value = true;
    mensajeExito.value = '';
    mensajeError.value = '';
    
    try {
        const idUsuario = localStorage.getItem('usuario_id');
        const respuesta = await actualizarPerfilService(idUsuario, perfilForm.value);
        
        const nuevoUsuarioLocal = { ...usuarioData, ...respuesta.usuario };
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuarioLocal));
        
        mensajeExito.value = '¡Perfil actualizado exitosamente!';
        
        emit('perfil-actualizado', respuesta.usuario.nombre);
        
        setTimeout(() => { mensajeExito.value = '' }, 3000);
    } catch (error) {
        mensajeError.value = error.response?.data?.error || 'Error al actualizar el perfil.';
        setTimeout(() => { mensajeError.value = '' }, 4000);
    } finally {
        guardandoPerfil.value = false;
    }
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>