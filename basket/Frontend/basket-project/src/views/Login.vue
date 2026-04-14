<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Iniciar Sesión
                </h2>
            </div>

            <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {{ error }}
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <input type="hidden" name="remember" value="true" />
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email" class="sr-only">Correo electrónico</label>
                        <input id="email" name="email" type="email" autocomplete="email" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Correo electrónico" v-model="email" />
                    </div>
                    <div class="relative">
                        <label for="password" class="sr-only">Contraseña</label>
                        <input id="password" name="password" :type="mostrarPassword ? 'text' : 'password'" autocomplete="current-password" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Contraseña" v-model="password" />
                        <button type="button" @click="mostrarPassword = !mostrarPassword"
                            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-indigo-600 transition-colors z-10">
                            <svg v-if="mostrarPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                            Recordarme
                        </label>
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="cargando"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </span>
                        {{ cargando ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                    </button>
                </div>

                <div class="text-center mt-4">
                    <p class="text-sm text-gray-600 font-medium">
                        ¿No tienes una cuenta? 
                        <router-link to="/registro" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                            Regístrate aquí
                        </router-link>
                    </p>
                </div>

                <div class="text-center mt-3 border-t border-gray-200 pt-4">
                    <button type="button" @click="router.push('/horarios')"
                        class="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                        ← Volver al sitio público
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginService } from '@/services/usuarioService'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const cargando = ref(false)
const mostrarPassword = ref(false)

const handleLogin = async () => {
    try {
        error.value = ''
        cargando.value = true

        const data = await loginService(email.value, password.value)

        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        localStorage.setItem('usuario_id', data.usuario.id_usuario)
        window.dispatchEvent(new Event('auth-change'));

        const rol = data.usuario.rol
        if (rol === 'administrador') {
            router.push('/admin/dashboard')
        } else if (rol === 'entrenador') {
            router.push('/entrenador')
        } else if (rol === 'arbitro') {
            router.push('/arbitro/dashboard')
        } else if (rol === 'espectador') {
            router.push('/horarios')
        } else {
            error.value = 'Rol de usuario desconocido'
        }

    } catch (err) {
        error.value = err.response?.data?.error || 'Error al iniciar sesión'
    } finally {
        cargando.value = false
    }
}
</script>