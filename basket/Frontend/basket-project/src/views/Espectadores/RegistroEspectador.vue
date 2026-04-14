<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="text-center mb-8 cursor-pointer" @click="$router.push('/')">
                <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform transition hover:scale-105">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h2 class="text-center text-3xl font-black text-gray-900 tracking-tight">
                    Basket<span class="text-amber-500">Pro</span>
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600 font-medium">
                    Crea tu cuenta oficial de espectador
                </p>
            </div>

            <div class="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
                <form class="space-y-6" @submit.prevent="handleRegistro">
                    
                    <div>
                        <label for="nombre" class="block text-sm font-bold text-gray-700">Nombre Completo</label>
                        <div class="mt-1">
                            <input id="nombre" type="text" v-model="form.nombre" required placeholder="Ej: Juan Pérez"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                        </div>
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-bold text-gray-700">Correo Electrónico</label>
                        <div class="mt-1">
                            <input id="email" type="email" v-model="form.email" required placeholder="tu@correo.com"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-bold text-gray-700">Contraseña</label>
                        <div class="mt-1 relative">
                            <input id="password" :type="mostrarPassword ? 'text' : 'password'" v-model="form.password" required minlength="6"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors">
                            <button type="button" @click="mostrarPassword = !mostrarPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-500">
                                <svg v-if="!mostrarPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            </button>
                        </div>
                        <p class="mt-1 text-xs text-gray-500">Mínimo 6 caracteres.</p>
                    </div>

                    <div v-if="mensajeError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {{ mensajeError }}
                    </div>

                    <div>
                        <button type="submit" :disabled="procesando"
                            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70">
                            <svg v-if="procesando" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {{ procesando ? 'Creando cuenta...' : 'Crear Cuenta' }}
                        </button>
                    </div>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600 font-medium">
                        ¿Ya tienes una cuenta? 
                        <router-link to="/login" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Inicia sesión aquí</router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Importamos la misma función que el administrador usa, ¡DRY!
import { crearUsuarioService } from '../../services/usuarioService';

const router = useRouter();

const form = ref({
    nombre: '',
    email: '',
    password: ''
});

const procesando = ref(false);
const mensajeError = ref('');
const mostrarPassword = ref(false);

const handleRegistro = async () => {
    mensajeError.value = '';
    procesando.value = true;

    try {
        // 🔴 ENVIAMOS EL PAYLOAD FORZANDO EL ROL "espectador"
        await crearUsuarioService({
            nombre: form.value.nombre,
            email: form.value.email,
            password: form.value.password,
            rol: 'espectador' 
        });

        // Opcional: Mostrar un Toast de éxito aquí
        alert("¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.");
        router.push('/login');

    } catch (error) {
        mensajeError.value = error.response?.data?.error || "Ocurrió un error al intentar crear tu cuenta.";
    } finally {
        procesando.value = false;
    }
};
</script>