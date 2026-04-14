<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>
        
        <div class="relative bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl transform transition-all">
            
            <div class="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                <h3 class="text-2xl font-bold text-gray-900 flex items-center">
                    <svg class="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    Editar Información del Equipo
                </h3>
                <button @click="close" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-4">Detalles de la Franquicia</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre Oficial *</label>
                        <input type="text" v-model="form.nombre_oficial" required placeholder="Ej: Los Angeles Lakers"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Siglas (Máx 10) *</label>
                        <input type="text" v-model="form.siglas" required maxlength="10" placeholder="Ej: LAL"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none uppercase">
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Categoría *</label>
                        <select v-model="form.id_clasificacion" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                            <option value="" disabled>Seleccionar...</option>
                            <option value="1">Varonil</option>
                            <option value="2">Femenil</option>
                            <option value="3">Mixto</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 class="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-4">Sede / Cancha Local</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Cancha *</label>
                        <input type="text" v-model="form.nombre_cancha" required placeholder="Ej: Staples Center"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                    
                    <div class="md:col-span-2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Dirección Exacta *</label>
                        <input type="text" v-model="form.direccion_cancha" required placeholder="Calle, Número, Ciudad..."
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                        <p class="text-xs text-gray-500 mt-1">La dirección debe ser única en el sistema.</p>
                    </div>
                    </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" @click="close"
                class="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancelar
                </button>
                <button type="submit"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md">
                Guardar Cambios
                </button>
            </div>
            </form>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    show: Boolean,
    equipo: {
        type: Object,
        default: null
    }
})

const emit = defineEmits(['close', 'save'])

const form = ref({
    nombre_oficial: '',
    siglas: '',
    id_clasificacion: '',
    id_cancha: null,
    nombre_cancha: '',
    direccion_cancha: ''
})

watch(() => props.show, (isVisible) => {
    if (isVisible && props.equipo) {
        form.value = {
            nombre_oficial: props.equipo.nombre_oficial || '',
            siglas: props.equipo.siglas || '',
            id_clasificacion: props.equipo.id_clasificacion || '',
            id_cancha: props.equipo.id_cancha || null,
            nombre_cancha: props.equipo.nombre_cancha || '',
            direccion_cancha: props.equipo.direccion_cancha || ''
        }
    }
})

const handleSubmit = () => {
    // Forzamos que capacidad_cancha se vaya como null para respetar la nueva normalización
    const dataToSave = { 
        ...form.value,
        capacidad_cancha: null 
    }
    
    emit('save', dataToSave)
}

const close = () => {
    emit('close')
}
</script>