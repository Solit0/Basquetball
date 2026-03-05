<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 flex flex-col">
            
            <div class="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
                <h3 class="text-lg font-black uppercase tracking-wider">Evaluar Desempeño Arbitral</h3>
                <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="p-6 bg-gray-50 overflow-y-auto">
                <div class="mb-6 bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
                    <p class="text-xs text-gray-500 font-bold uppercase mb-1">Partido Evaluado</p>
                    <p class="text-lg font-black text-indigo-900">{{ partido.local_nombre }} vs {{ partido.visitante_nombre }}</p>
                </div>

                <div v-if="errorBloqueo" class="bg-red-50 border border-red-200 p-5 rounded-xl text-center mb-4">
                    <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h4 class="font-bold text-red-800 mb-1">Evaluación No Disponible</h4>
                    <p class="text-sm text-red-600">{{ errorBloqueo }}</p>
                    
                    <button @click="$emit('close')" class="mt-4 px-6 py-2 bg-white border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-50 transition">
                        Entendido
                    </button>
                </div>

                <form v-else @submit.prevent="enviarEvaluacion" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Calificación General (1 al 10)</label>
                        <div class="flex items-center space-x-4">
                            <input type="range" v-model="form.puntuacion" min="1" max="10" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
                            <div class="w-12 h-12 flex items-center justify-center bg-indigo-100 text-indigo-800 font-black text-xl rounded-xl border-2 border-indigo-200 shadow-inner shrink-0">
                                {{ form.puntuacion }}
                            </div>
                        </div>
                        <div class="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2">
                            <span>Deficiente (1)</span>
                            <span>Excelente (10)</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Comentarios y Observaciones</label>
                        <textarea v-model="form.comentarios" required rows="4" placeholder="Describe detalladamente el desempeño del árbitro. Mantén un lenguaje profesional..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white resize-none"></textarea>
                    </div>

                    <div class="pt-4 flex justify-end space-x-3">
                        <button type="button" @click="$emit('close')" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition">
                            Cancelar
                        </button>
                        <button type="submit" :disabled="procesando" 
                                class="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50">
                            {{ procesando ? 'Enviando...' : 'Enviar Evaluación' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    partido: Object
})
const emit = defineEmits(['close', 'save'])

const procesando = ref(false)
const errorBloqueo = ref(null)

const form = ref({
    id_informe: null,
    id_arbitro: null,
    puntuacion: 10,
    comentarios: ''
})

onMounted(() => {
    
    if (!props.partido.id_informe) {
        errorBloqueo.value = "El administrador aún no ha publicado el informe oficial de este partido. No se puede evaluar al árbitro hasta que el informe esté disponible.";
    } else if (!props.partido.id_arbitro_principal) {
        errorBloqueo.value = "No hay un árbitro principal registrado en el sistema para este encuentro.";
    } else {
        form.value.id_informe = props.partido.id_informe;
        form.value.id_arbitro = props.partido.id_arbitro_principal;
    }
})

const enviarEvaluacion = async () => {
    procesando.value = true;
    emit('save', form.value); 
}
</script>