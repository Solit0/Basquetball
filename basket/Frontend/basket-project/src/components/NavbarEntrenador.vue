<template>
    <nav class="bg-white shadow-md z-10 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="shrink-0">
                        <h1 class="text-2xl font-black text-indigo-600 tracking-tight">BasketPro</h1>
                    </div>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-center space-x-4">
                        <span class="text-gray-900 px-3 py-2 text-sm font-bold bg-gray-50 rounded-lg border border-gray-100">
                            👤 {{ userName }}
                        </span>
                        <button @click="logout"
                            class="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center">
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

const props = defineProps({
    userName: { type: String, required: true }
})

const router = useRouter()

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    router.push('/login')
}
</script>