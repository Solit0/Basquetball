<template>
    <div class="max-w-3xl mx-auto space-y-6 animate-fade-in">
        
        <div>
            <h2 class="text-3xl font-bold text-gray-900">Mi Perfil Personal</h2>
            <p class="mt-2 text-gray-600">Actualiza tu información y credenciales de acceso al panel de administración.</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div class="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
                <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black uppercase">
                    {{ form.nombre.charAt(0) }}
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-900">{{ form.nombre }}</h3>
                    <p class="text-sm font-medium text-indigo-600 uppercase tracking-widest">Administrador</p>
                </div>
            </div>

            <form @submit.prevent="guardarPerfil" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                        <input type="text" v-model="form.nombre" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
                        <input type="email" v-model="form.email" required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                    </div>

                    <div class="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                        <h4 class="text-md font-bold text-gray-800 mb-1">Cambiar Contraseña (Opcional)</h4>
                        <p class="text-xs text-gray-500 mb-4">Deja este campo en blanco si deseas mantener tu contraseña actual.</p>
                        
                        <label class="block text-sm font-bold text-gray-700 mb-2">Nueva Contraseña</label>
                        <div class="relative">
                            <input :type="mostrarPassword ? 'text' : 'password'" v-model="form.password" minlength="6" placeholder="Escribe tu nueva contraseña..."
                                class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                            <button type="button" @click="mostrarPassword = !mostrarPassword"
                                class="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-indigo-600 transition-colors">
                                
                                <svg v-if="mostrarPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                                
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end pt-6 border-t border-gray-100 mt-6">
                    <button type="submit" :disabled="procesando"
                        class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50 flex items-center">
                        <svg v-if="procesando" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {{ procesando ? 'Guardando cambios...' : 'Actualizar Perfil' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { actualizarPerfilService } from '../../services/usuarioService' 

const emit = defineEmits(['perfil-actualizado'])
const procesando = ref(false)
const mostrarPassword = ref(false)
const form = ref({
    nombre: '',
    email: '',
    password: ''
})

onMounted(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}')
    form.value.nombre = usuarioLocal.nombre || ''
    form.value.email = usuarioLocal.email || usuarioLocal.correo || ''
})

const guardarPerfil = async () => {
    procesando.value = true
    try {
        const idUsuario = localStorage.getItem('usuario_id')
        
        const payload = {
            nombre: form.value.nombre,
            email: form.value.email
        }
        
        if (form.value.password && form.value.password.trim() !== '') {
            payload.password = form.value.password
        }

        await actualizarPerfilService(idUsuario, payload)
        const usuarioLocal = JSON.parse(localStorage.getItem('usuario') || '{}')
        const nuevoUsuario = { ...usuarioLocal, nombre: form.value.nombre, email: form.value.email }
        localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))

        alert(' Perfil actualizado exitosamente.')
        form.value.password = '' 
        emit('perfil-actualizado', nuevoUsuario.nombre)
        
    } catch (error) {
        alert(error.response?.data?.error || 'Ocurrió un error al actualizar el perfil.')
    } finally {
        procesando.value = false
    }
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