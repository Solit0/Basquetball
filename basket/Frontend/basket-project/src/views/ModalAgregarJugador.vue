<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>
      
      <div class="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div class="absolute top-4 right-4">
          <button @click="close" class="text-gray-400 hover:text-red-500 transition-colors">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg class="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ isEditing ? 'Editar Jugador' : 'Fichar Jugador al Club' }}
        </h3>

        <div v-if="!isEditing" class="flex p-1 bg-gray-100 rounded-lg mb-6">
            <button @click="modoAgenteLibre = false; resetForm()" :class="!modoAgenteLibre ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-1.5 text-sm font-bold rounded-md transition-all">
                Crear Nuevo
            </button>
            <button @click="modoAgenteLibre = true; resetForm()" :class="modoAgenteLibre ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'" class="flex-1 py-1.5 text-sm font-bold rounded-md transition-all">
                Agente Libre
            </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            
            <div v-if="modoAgenteLibre && !isEditing">
              <label class="block text-sm font-medium text-gray-700 mb-1">Seleccionar Jugador Libre *</label>
              <select v-model="jugadorSeleccionado" required @change="llenarDatosLibre"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="" disabled>Seleccione de la lista...</option>
                <option v-for="libre in jugadoresLibres" :key="libre.id_jugador" :value="libre">
                    {{ libre.nombre }} {{ libre.apellido }} ({{ libre.posicion }})
                </option>
              </select>
              <p v-if="jugadoresLibres.length === 0" class="text-xs text-red-500 mt-1">No hay jugadores libres disponibles.</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input type="text" v-model="form.nombre" required :disabled="modoAgenteLibre"
                  :class="modoAgenteLibre ? 'bg-gray-100 text-gray-500' : ''"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
                <input type="text" v-model="form.apellido" required :disabled="modoAgenteLibre"
                  :class="modoAgenteLibre ? 'bg-gray-100 text-gray-500' : ''"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Estatura (m)</label>
                <input type="number" step="0.01" v-model="form.estatura" min="1.40" max="2.50" :disabled="modoAgenteLibre"
                  :class="modoAgenteLibre ? 'bg-gray-100 text-gray-500' : ''"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Posición *</label>
                <select v-model="form.posicion" required :disabled="modoAgenteLibre"
                  :class="modoAgenteLibre ? 'bg-gray-100 text-gray-500' : 'bg-white'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
                  <option value="" disabled>Seleccionar...</option>
                  <option value="Base">Base</option>
                  <option value="Escolta">Escolta</option>
                  <option value="Alero">Alero</option>
                  <option value="Ala-pívot">Ala-pívot</option>
                  <option value="Pívot">Pívot</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input type="date" v-model="form.fecha_nacimiento" :disabled="modoAgenteLibre"
                :class="modoAgenteLibre ? 'bg-gray-100 text-gray-500' : ''"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-colors">
            </div>

          </div>

          <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" @click="close"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="modoAgenteLibre && !jugadorSeleccionado"
              :class="(modoAgenteLibre && !jugadorSeleccionado) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
              {{ isEditing ? 'Guardar Cambios' : 'Confirmar Fichaje' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  jugador: { type: Object, default: null },
  jugadoresLibres: { type: Array, default: () => [] } 
})

const emit = defineEmits(['close', 'save'])

const isEditing = computed(() => !!props.jugador)
const modoAgenteLibre = ref(false)
const jugadorSeleccionado = ref('')

const form = ref({
  id_jugador: null,
  nombre: '',
  apellido: '',
  posicion: '',
  estatura: '',
  fecha_nacimiento: ''
})

const resetForm = () => {
  form.value = {
    id_jugador: null,
    nombre: '',
    apellido: '',
    posicion: '',
    estatura: '',
    fecha_nacimiento: ''
  }
  jugadorSeleccionado.value = ''
}

const llenarDatosLibre = () => {
    if (jugadorSeleccionado.value) {
        const j = jugadorSeleccionado.value;
        form.value.id_jugador = j.id_jugador || j.idJugador;
        form.value.nombre = j.nombre;
        form.value.apellido = j.apellido;
        form.value.posicion = j.posicion;
        form.value.estatura = j.estatura;
        
        const fechaNac = j.fecha_nacimiento || j.fechaNacimiento;
        form.value.fecha_nacimiento = fechaNac ? fechaNac.split('T')[0] : '';
    }
}
watch(() => props.jugador, (newVal) => {
  if (newVal) {
    modoAgenteLibre.value = false;
    const fechaNac = newVal.fecha_nacimiento || newVal.fechaNacimiento;
    
    form.value = {
      id_jugador: newVal.id_jugador || newVal.idJugador,
      nombre: newVal.nombre || '',
      apellido: newVal.apellido || '',
      posicion: newVal.posicion || '',
      estatura: newVal.estatura || '',
      fecha_nacimiento: fechaNac ? fechaNac.split('T')[0] : ''
    }
  } else {
    resetForm()
    modoAgenteLibre.value = false;
  }
}, { immediate: true })

const calcularEdad = (fecha) => {
    if (!fecha) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

const handleSubmit = () => {
  if (form.value.fecha_nacimiento) {
      const edad = calcularEdad(form.value.fecha_nacimiento);
      if (edad < 12) {
          alert(`REGLA DEL CLUB: El jugador tiene ${edad} años. Por normativas del sistema, debe tener al menos 12 años cumplidos para ser registrado en la base de datos.`);
          return; // Detenemos la ejecución, no se envía el emit
      }
  }

  const data = {
    ...form.value,
    estatura: form.value.estatura ? parseFloat(form.value.estatura) : null,
    fecha_nacimiento: form.value.fecha_nacimiento || null
  }
  
  emit('save', {
      data: data,
      isEditing: isEditing.value,
      isAgenteLibre: modoAgenteLibre.value
  })
}

const close = () => {
  resetForm()
  emit('close')
}
</script>