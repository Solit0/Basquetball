<template>
    <div v-if="show" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
        
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-fade-in-up">
            
            <div class="bg-indigo-900 px-6 py-4 flex justify-between items-center shrink-0">
                <div>
                    <h3 class="text-xl font-black text-white flex items-center">
                        <svg class="w-6 h-6 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        Armar Roster Oficial
                    </h3>
                    <p class="text-indigo-200 text-sm mt-1">Torneo: <span class="font-bold text-white">{{ torneo?.nombre_torneo }}</span> | Categoría: <span class="font-bold text-white">{{ torneo?.categoria }}</span></p>
                </div>
                <button @click="close" class="text-indigo-200 hover:text-white bg-indigo-800 hover:bg-indigo-700 rounded-lg p-2 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div class="bg-indigo-50 border-b border-indigo-100 px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <div class="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Convocados</p>
                    <p class="text-xl font-black" :class="convocadosCount >= 5 ? 'text-green-600' : 'text-red-500'">{{ convocadosCount }} <span class="text-sm text-gray-400 font-medium">/ min 5</span></p>
                </div>
                <div class="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Titulares (En Cancha)</p>
                    <p class="text-xl font-black" :class="titularesCount === 5 ? 'text-green-600' : 'text-amber-500'">{{ titularesCount }} <span class="text-sm text-gray-400 font-medium">/ 5</span></p>
                </div>
                <div class="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-wider">Capitán Designado</p>
                    <p class="text-xl font-black" :class="capitanDesignado ? 'text-green-600' : 'text-red-500'">
                        {{ capitanDesignado ? 'SÍ' : 'NO' }}
                    </p>
                </div>
                <div class="bg-indigo-600 text-white p-3 rounded-lg shadow-sm text-center flex flex-col justify-center">
                    <p class="text-[10px] font-black text-indigo-200 uppercase tracking-wider">Salto Inicial</p>
                    <p class="text-sm font-black">{{ torneo?.fecha_inicio ? torneo.fecha_inicio.split('T')[0] : 'N/A' }}</p>
                </div>
            </div>

            <div class="p-6 overflow-y-auto bg-gray-50 flex-1">
                
                <div v-if="cargando" class="text-center py-12 text-indigo-500 flex flex-col items-center">
                    <svg class="animate-spin h-8 w-8 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="font-bold">Cargando base de datos del club...</p>
                </div>

                <div v-else-if="jugadores.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p class="text-gray-500 font-medium">Tu club no tiene jugadores registrados. Ve a "Directorio de Jugadores" primero.</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="jugador in jugadores" :key="jugador.id_jugador" 
                         class="bg-white border rounded-xl p-4 transition-all shadow-sm"
                         :class="[
                             jugador.esta_suspendido ? 'border-red-300 bg-red-50 opacity-90' : 
                             jugador.convocado ? 'border-indigo-300 ring-1 ring-indigo-100' : 'border-gray-200 opacity-70 hover:opacity-100'
                         ]">
                        
                        <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
                            
                            <div class="flex items-center flex-1 w-full">
                                <div class="flex items-center h-5 mr-4">
                                    <input type="checkbox" v-model="jugador.convocado" @change="manejarConvocatoria(jugador)"
                                           class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer">
                                </div>
                                <div>
                                    <p class="font-bold text-gray-900 text-lg flex items-center">
                                        <span :class="jugador.esta_suspendido ? 'line-through text-red-800' : ''">
                                            {{ jugador.nombre }} {{ jugador.apellido }}
                                        </span>
                                        
                                        <span v-if="jugador.errorEdad" class="ml-2 bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center" :title="jugador.errorEdad">
                                            Fuera de Edad ({{ jugador.edadCalculada }} años)
                                        </span>
                                        
                                        <span v-else-if="jugador.esta_suspendido" class="ml-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-sm flex items-center">
                                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            SUSPENDIDO POR LA LIGA
                                        </span>

                                        <span v-else class="ml-2 text-xs text-gray-400 font-medium">
                                            {{ jugador.edadCalculada }} años
                                        </span>
                                    </p>
                                    <p class="text-sm font-medium" :class="jugador.esta_suspendido ? 'text-red-600 font-bold' : 'text-gray-500'">
                                        {{ jugador.esta_suspendido ? 'No puede alinear como titular hasta cumplir su sanción.' : (jugador.posicion || 'Posición no definida') + ' | ' + (jugador.estatura ? jugador.estatura + ' m' : 'Estatura N/A') }}
                                    </p>
                                </div>
                            </div>

                            <div v-if="jugador.convocado" class="flex flex-wrap items-center justify-end gap-3 w-full lg:w-auto animate-fade-in bg-gray-50 p-2 rounded-lg border border-gray-100">
                                
                                <div class="flex items-center">
                                    <label class="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wider">Dorsal</label>
                                    <input type="number" v-model="jugador.numero_camiseta" min="0" max="99" placeholder="#" required
                                           class="w-16 px-2 py-1.5 text-center font-black text-indigo-700 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                </div>

                                <div class="flex items-center bg-white border border-gray-300 rounded overflow-hidden">
                                    <button type="button" @click="hacerTitular(jugador)" 
                                            :disabled="jugador.esta_suspendido"
                                            :class="[
                                                jugador.rol_roster === 'Titular' ? 'bg-indigo-600 text-white font-bold' : 'text-gray-500 hover:bg-gray-100',
                                                jugador.esta_suspendido ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400' : ''
                                            ]"
                                            class="px-3 py-1.5 text-xs transition-colors"
                                            :title="jugador.esta_suspendido ? 'El jugador está suspendido' : ''">
                                        Titular
                                    </button>
                                    <button type="button" @click="jugador.rol_roster = 'Suplente'" 
                                            :class="jugador.rol_roster === 'Suplente' ? 'bg-gray-600 text-white font-bold' : 'text-gray-500 hover:bg-gray-100'"
                                            class="px-3 py-1.5 text-xs transition-colors border-l border-gray-300">
                                        Banca
                                    </button>
                                </div>

                                <div class="flex items-center">
                                    <button type="button" @click="asignarCapitan(jugador)"
                                            :class="jugador.es_capitan ? 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-inner' : 'bg-white text-gray-400 border-gray-300 hover:bg-yellow-50 hover:text-yellow-600'"
                                            class="flex items-center px-3 py-1.5 text-xs font-bold border rounded transition-all">
                                        <span v-if="jugador.es_capitan" class="mr-1">©</span> Capitán
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0 mt-6 rounded-xl">
                    <p class="text-xs text-gray-500 italic">* Revisa cuidadosamente tu alineación. Una vez que el torneo inicie, el roster se bloqueará.</p>
                    <div class="flex space-x-3">
                        <button type="button" @click="close" class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                            Cancelar
                        </button>
                        <button type="button" @click="validarYGuardar" :disabled="props.saving"
                                class="px-6 py-2.5 bg-green-500 hover:bg-green-400 disabled:bg-green-300 disabled:text-green-800 disabled:cursor-not-allowed text-green-900 font-black rounded-lg transition-colors shadow-sm flex items-center uppercase tracking-wider text-sm">
                            {{ props.saving ? 'Guardando...' : 'Confirmar Roster' }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { obtenerEquipoDeEntrenadorService } from '../../services/equiposService'
import { obtenerJugadoresPorEquipoService } from '../../services/jugadoresService'

const props = defineProps({
    show: Boolean,
    torneo: { type: Object, required: true },
    saving: { type: Boolean, default: false },
    rosterPrevio: { type: Array, default: () => [] }
})
const emit = defineEmits(['close', 'save'])
const jugadores = ref([])
const cargando = ref(false)

const convocados = computed(() => jugadores.value.filter(j => j.convocado))
const convocadosCount = computed(() => convocados.value.length)
const titularesCount = computed(() => convocados.value.filter(j => j.rol_roster === 'Titular').length)
const capitanDesignado = computed(() => convocados.value.some(j => j.es_capitan))

const calcularEdadEnFecha = (fechaNacimiento, fechaReferencia) => {
    if (!fechaNacimiento || !fechaReferencia) return 0;
    const nacimiento = new Date(fechaNacimiento);
    const referencia = new Date(fechaReferencia);
    let edad = referencia.getFullYear() - nacimiento.getFullYear();
    const mes = referencia.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && referencia.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

const verificarReglasEdad = (edad, categoria) => {
    if (categoria === 'Libre') return null;
    if (categoria === 'Sub-12' && (edad > 12 || edad < 11)) return "Rango permitido: 11 y 12 años";
    if (categoria === 'Sub-15' && (edad > 15 || edad < 14)) return "Rango permitido: 14 y 15 años";
    if (categoria === 'Sub-18' && (edad > 18 || edad < 17)) return "Rango permitido: 17 y 18 años";
    if (categoria === 'U-23' && (edad > 23 || edad < 21)) return "Rango permitido: 21 a 23 años";
    if (categoria === 'Veteranos' && edad < 35) return "Mínimo exigido: 35 años";
    if (categoria === 'Maxi-Baloncesto' && edad < 45) return "Mínimo exigido: 45 años";
    return null;
}

const cargarBaseDatosClub = async () => {
    cargando.value = true;
    try {
        const idEntrenador = localStorage.getItem('usuario_id');
        const equipo = await obtenerEquipoDeEntrenadorService(idEntrenador);
        if (equipo) {
            const dataJugadores = await obtenerJugadoresPorEquipoService(equipo.id_equipo);
            
            jugadores.value = dataJugadores.map(j => {
                const edad = calcularEdadEnFecha(j.fecha_nacimiento, props.torneo.fecha_inicio);
                const errorEdad = verificarReglasEdad(edad, props.torneo.categoria);
                
                const jugadorEnRoster = props.rosterPrevio.find(rp => rp.id_jugador === j.id_jugador);
                
                if (jugadorEnRoster) {
                    return {
                        ...j,
                        convocado: true,
                        numero_camiseta: jugadorEnRoster.numero_camiseta,
                        rol_roster: j.esta_suspendido ? 'Suplente' : jugadorEnRoster.rol_roster, // 🔴 Forzamos suplente si está suspendido
                        es_capitan: jugadorEnRoster.es_capitan,
                        edadCalculada: edad,
                        errorEdad: errorEdad
                    };
                } else {
                    return {
                        ...j,
                        convocado: false,
                        numero_camiseta: '',
                        rol_roster: 'Suplente',
                        es_capitan: false,
                        edadCalculada: edad,
                        errorEdad: errorEdad
                    };
                }
            });
        }
    } catch (error) {
        console.error("Error al cargar jugadores del club:", error);
    } finally {
        cargando.value = false;
    }
}

watch(() => props.show, (newVal) => {
    if (newVal) {
        cargarBaseDatosClub();
    }
}, { immediate: true })

const manejarConvocatoria = (jugador) => {
    if (!jugador.convocado) {
        jugador.rol_roster = 'Suplente';
        jugador.es_capitan = false;
        jugador.numero_camiseta = '';
    }
}

const hacerTitular = (jugador) => {
    if (jugador.rol_roster === 'Titular') return;
    
    // 🔴 Bloqueo principal
    if (jugador.esta_suspendido) {
        return alert(`SANCIÓN DISCIPLINARIA:\nEste jugador no puede alinear como Titular debido a una suspensión vigente dictaminada por la liga.`);
    }

    if (jugador.errorEdad) {
        return alert(`REGLA DE COMPETICIÓN:\nNo puedes alinear de Titular a este jugador porque rompe las reglas de edad del torneo (${jugador.errorEdad}).`);
    }
    if (titularesCount.value >= 5) {
        return alert('Solo puedes tener exactamente 5 jugadores Titulares en la cancha.');
    }
    
    jugador.rol_roster = 'Titular';
}

const asignarCapitan = (jugadorSeleccionado) => {
    if (jugadorSeleccionado.es_capitan) {
        jugadorSeleccionado.es_capitan = false;
        return;
    }
    
    jugadores.value.forEach(j => j.es_capitan = false);
    jugadorSeleccionado.es_capitan = true;
}

const validarYGuardar = () => {
    if (props.saving) return;

    const seleccionados = convocados.value;
    if (seleccionados.length < 5) {
        return alert('Error: Debes convocar al menos a 5 jugadores de tu club para armar el Roster del torneo.');
    }
    if (titularesCount.value !== 5) {
        return alert(`Error: El baloncesto se juega de 5 contra 5. Debes designar exactamente 5 Titulares. Tienes ${titularesCount.value}.`);
    }
    if (!capitanDesignado.value) {
        return alert('Error: Debes designar obligatoriamente a un Capitán (©) para el torneo.');
    }
    if(seleccionados.length > 12) {
        return alert('Error: El roster oficial no puede tener más de 12 jugadores convocados. Elimina algunos para cumplir con el límite máximo permitido.');
    }
    
    const numerosUsados = new Set();
    for (const j of seleccionados) {
        if (j.numero_camiseta === '' || j.numero_camiseta === null) {
            return alert(`Error: El jugador ${j.nombre} ${j.apellido} no tiene un número de dorsal asignado.`);
        }
        
        const numDorsal = parseInt(j.numero_camiseta);
        if (numerosUsados.has(numDorsal)) {
            return alert(`Error: El dorsal #${numDorsal} está repetido. Dos jugadores no pueden usar el mismo número en el torneo.`);
        }
        numerosUsados.add(numDorsal);
    }
    
    const rosterArmado = seleccionados.map(j => ({
        id_jugador: j.id_jugador,
        numero_camiseta: parseInt(j.numero_camiseta),
        rol_roster: j.rol_roster,
        es_capitan: j.es_capitan
    }));
    
    emit('save', rosterArmado);
}

const close = () => {
    emit('close')
}
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>