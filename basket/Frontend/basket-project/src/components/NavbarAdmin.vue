<template>
    <nav class="bg-white shadow-md z-10 relative">
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
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
    userName: { type: String, required: true }
})

const router = useRouter()

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    localStorage.removeItem('token')
    router.push('/login')
}
</script>