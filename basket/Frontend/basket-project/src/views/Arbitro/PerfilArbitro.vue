<template>
    <div class="h-full flex flex-col space-y-6 max-w-3xl mx-auto">
        
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 shrink-0">
            <div>
                <h2 class="text-3xl font-black text-gray-900">Mi Perfil Personal</h2>
                <p class="text-gray-600 mt-1">Actualiza tus datos de contacto e información de la cuenta.</p>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form @submit.prevent="guardarPerfil" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
                        <input type="text" v-model="perfilForm.nombre" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Apellido</label>
                        <input type="text" v-model="perfilForm.apellido" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                    <input type="email" v-model="perfilForm.correo" required
                        class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all bg-gray-50">
                </div>

                <div class="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" :disabled="guardando"
                        class="px-8 py-3 bg-amber-500 text-slate-950 font-black rounded-xl hover:bg-amber-600 transition-all shadow-md disabled:opacity-50 flex items-center">
                        <svg v-if="guardando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {{ guardando ? 'GUARDANDO...' : 'ACTUALIZAR PERFIL' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { actualizarPerfilService } from '../../services/usuarioService.js'

// Emitimos un evento para avisarle al Dashboard que cambie el nombre en el Header
const emit = defineEmits(['perfilActualizado'])

const usuarioData = JSON.parse(localStorage.getItem('usuario') || '{}')
const idUsuario = localStorage.getItem('usuario_id')
const guardando = ref(false)

const perfilForm = ref({
    nombre: usuarioData.nombre || '',
    apellido: usuarioData.apellido || '',
    correo: usuarioData.correo || ''
})

const guardarPerfil = async () => {
    guardando.value = true;
    try {
        const respuesta = await actualizarPerfilService(idUsuario, perfilForm.value);
        const nuevoUsuarioLocal = { ...usuarioData, ...respuesta.usuario };
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuarioLocal));
        
        emit('perfilActualizado', respuesta.usuario.nombre);
        
        alert('Perfil actualizado exitosamente.');
    } catch (error) {
        alert(error.response?.data?.error || 'Error al actualizar el perfil.');
    } finally {
        guardando.value = false;
    }
}
</script>