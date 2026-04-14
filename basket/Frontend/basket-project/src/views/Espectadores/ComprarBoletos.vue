<template>
    <div class="min-h-screen bg-gray-50 py-10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
            
            <button v-if="paso === 1" @click="$router.push('/horarios')" class="text-indigo-600 font-bold flex items-center hover:text-indigo-800 mb-6 transition-colors">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Volver al Calendario
            </button>

            <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                
                <div class="bg-slate-900 px-8 py-6 text-white text-center relative overflow-hidden">
                    <div class="relative z-10">
                        <span class="bg-indigo-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm mb-3 inline-block">Compra de Boletos Oficiales</span>
                        <h2 class="text-3xl font-black mt-2">Asegura tu lugar</h2>
                        <p class="text-gray-400 mt-2 text-sm font-medium">Selecciona tu zona, realiza tu pago seguro y recibe tus entradas por correo.</p>
                    </div>
                    <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-white via-slate-900 to-slate-900"></div>
                </div>

                <div v-if="paso === 1" class="p-8">
                    <h3 class="text-xl font-black text-gray-800 mb-6 flex items-center">
                        <span class="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                        Elige tus asientos
                    </h3>

                    <div v-if="cargandoBoletos" class="text-center py-10">
                        <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p class="text-gray-500 font-medium">Cargando disponibilidad en tiempo real...</p>
                    </div>

                    <div v-else-if="boletosDisponibles.length === 0" class="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
                        <p class="text-lg font-bold text-gray-600">Boletos Agotados o No Disponibles</p>
                        <p class="text-sm text-gray-500">Este partido ya no cuenta con entradas a la venta.</p>
                    </div>

                    <div v-else class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="boleto in boletosDisponibles" :key="boleto.id_boleto" 
                                 @click="seleccionarBoleto(boleto)"
                                 :class="boletoSeleccionado?.id_boleto === boleto.id_boleto ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-300'"
                                 class="border-2 rounded-xl p-5 cursor-pointer transition-all relative overflow-hidden">
                                
                                <div class="flex justify-between items-start">
                                    <div>
                                        <h4 class="font-black text-gray-900 text-lg">{{ boleto.zona }}</h4>
                                        <p class="text-sm font-medium text-gray-500 mt-1">Disponibles: <span class="font-bold text-indigo-600">{{ boleto.disponibles }}</span></p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-black text-green-600">${{ boleto.precio }}</p>
                                        <p class="text-[10px] text-gray-400 font-bold uppercase">USD / c/u</p>
                                    </div>
                                </div>
                                <div v-if="boletoSeleccionado?.id_boleto === boleto.id_boleto" class="absolute top-0 right-0 bg-indigo-600 text-white p-1 rounded-bl-lg">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div v-if="boletoSeleccionado" class="bg-gray-50 p-6 rounded-xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center mt-6 animate-fade-in">
                            <div class="mb-4 sm:mb-0">
                                <label class="block text-sm font-black text-gray-700 uppercase tracking-wide mb-2">Cantidad de boletos</label>
                                <div class="flex items-center">
                                    <button @click="cantidad > 1 ? cantidad-- : null" class="w-10 h-10 rounded-l-lg bg-white border border-gray-300 text-gray-600 font-black hover:bg-gray-100 flex items-center justify-center transition-colors">-</button>
                                    <input type="number" v-model.number="cantidad" readonly class="w-16 h-10 border-y border-gray-300 text-center font-black text-lg text-gray-900 bg-white outline-none">
                                    <button @click="cantidad < boletoSeleccionado.disponibles && cantidad < 10 ? cantidad++ : null" class="w-10 h-10 rounded-r-lg bg-white border border-gray-300 text-gray-600 font-black hover:bg-gray-100 flex items-center justify-center transition-colors">+</button>
                                </div>
                                <p class="text-xs text-gray-500 mt-2 font-medium">Máximo 10 boletos por compra.</p>
                            </div>

                            <div class="text-center sm:text-right">
                                <p class="text-sm text-gray-500 font-bold uppercase tracking-widest">Total a Pagar</p>
                                <p class="text-4xl font-black text-gray-900">${{ (boletoSeleccionado.precio * cantidad).toFixed(2) }}</p>
                            </div>
                        </div>

                        <div v-if="errorReserva" class="bg-red-50 text-red-700 p-4 rounded-lg text-sm font-bold border border-red-200 flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {{ errorReserva }}
                        </div>

                        <button v-if="boletoSeleccionado" @click="iniciarCheckout" :disabled="procesandoReserva" 
                                class="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg flex justify-center items-center disabled:opacity-70 mt-6">
                            <svg v-if="procesandoReserva" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            {{ procesandoReserva ? 'Asegurando tus lugares...' : 'Reservar y Continuar al Pago' }}
                        </button>
                    </div>
                </div>

                <div v-else-if="paso === 2" class="p-8 animate-fade-in">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 pb-6">
                        <h3 class="text-xl font-black text-gray-800 flex items-center">
                            <span class="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                            Pago Seguro
                        </h3>
                        
                        <div class="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg flex items-center mt-4 md:mt-0 shadow-sm" :class="{'animate-pulse bg-red-50 border-red-200': tiempoRestante < 60}">
                            <svg class="w-5 h-5 text-amber-500 mr-2" :class="{'text-red-500': tiempoRestante < 60}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div class="text-sm">
                                <span class="block text-[10px] uppercase font-bold text-gray-500 leading-none">Tiempo para completar</span>
                                <span class="font-black text-lg font-mono text-gray-800" :class="{'text-red-600': tiempoRestante < 60}">{{ tiempoFormateado }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                            <h4 class="font-black text-gray-800 uppercase tracking-widest text-sm mb-4">Resumen de Compra</h4>
                            <div class="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                                <span>Zona:</span>
                                <span class="font-bold text-gray-900">{{ boletoSeleccionado.zona }}</span>
                            </div>
                            <div class="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
                                <span>Cantidad:</span>
                                <span class="font-bold text-gray-900">{{ cantidad }} boleto(s)</span>
                            </div>
                            <div class="flex justify-between items-center mb-4 text-sm font-medium text-gray-600 border-b border-gray-200 pb-4">
                                <span>Precio Unitario:</span>
                                <span class="font-bold text-gray-900">${{ boletoSeleccionado.precio }} USD</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-black text-gray-800 text-lg uppercase">Total:</span>
                                <span class="font-black text-indigo-600 text-2xl">${{ (boletoSeleccionado.precio * cantidad).toFixed(2) }} USD</span>
                            </div>
                        </div>

                        <div>
                            <div class="mb-4 flex items-center justify-between">
                                <label class="block text-sm font-black text-gray-700 uppercase tracking-wide">Datos de Tarjeta</label>
                                <div class="flex space-x-1 opacity-50">
                                    <svg class="w-8 h-8" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#222357"/><path d="M22.099 17H24.81L23.111 7h-2.148c-.417 0-.77.279-.908.673l-4.148 9.948h2.862l.57-1.583h3.493l.268 1.582h-.001zm-2.062-3.663l1.196-3.32 1.144 3.32h-2.34zM12.012 17h2.721L14.734 7h-2.722L12.012 17zm-4.303-9.764c-1.392-.379-2.38-.636-2.38-1.579 0-.85.986-1.22 2.062-1.22 1.644 0 2.585.348 3.332.658l.493-2.27c-.773-.34-1.95-.567-3.238-.567-2.716 0-4.633 1.41-4.633 3.42 0 2.551 3.522 2.659 3.522 3.655 0 1.054-1.393 1.258-2.38 1.258-1.576 0-2.582-.266-3.468-.667l-.508 2.378c.846.387 2.274.704 3.693.704 2.87 0 4.706-1.378 4.706-3.486 0-2.812-3.593-2.92-3.593-3.834h-.001c.001 0 0 0 0 0z" fill="#fff"/><path d="M6.924 7H4.757c-.504 0-.936.289-1.126.738L.001 17h2.862l.573-1.588h3.491l.267 1.588h2.722L6.924 7zm-1.492 6.052l1.196-3.32 1.144 3.32H5.432z" fill="#F79E1B"/></svg>
                                    <svg class="w-8 h-8" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="4" fill="#0061A8"/><path d="M12.927 16.273c.189.043.376.068.563.068 2.244 0 3.735-1.168 3.735-3.344 0-1.89-1.418-2.617-2.64-3.036-1.16-.395-1.473-.687-1.473-1.155 0-.486.536-.93 1.545-.93.698 0 1.205.119 1.62.27l.347-1.597c-.361-.137-1.018-.302-1.865-.302-2.146 0-3.64 1.156-3.64 3.298 0 1.94 1.488 2.656 2.647 3.06 1.196.417 1.52.748 1.52 1.203 0 .49-.553.955-1.626.955-.83 0-1.425-.138-1.921-.336l-.371 1.705c.421.196 1.152.38 1.948.38M23.906 6.368h-1.614c-.452 0-.825.263-.996.657l-3.076 7.42h2.247l.45-1.258h2.746l.216 1.258h2.155l-2.128-8.077zm-1.546 4.764l.872-2.455.834 2.455h-1.706M10.871 6.368H8.71l-2.143 8.077h2.162l2.142-8.077M6.711 6.368H4.218c-.407 0-.726.23-.884.6l-3.32 7.477h2.261l.45-1.258h2.742l.211 1.258h2.157L6.711 6.368zM5.161 11.132l.875-2.455.832 2.455H5.161z" fill="#fff"/></svg>
                                </div>
                            </div>

                            <div ref="cardElementRef" class="p-4 border-2 border-gray-300 rounded-xl bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all mb-2 min-h-12.5"></div>
                            
                            <div v-if="errorPago" class="text-sm font-bold text-red-600 mb-4 bg-red-50 p-2 rounded">
                                {{ errorPago }}
                            </div>

                            <button @click="procesarPago" :disabled="procesandoPago" 
                                    class="w-full py-4 bg-green-600 text-white rounded-xl font-black text-lg hover:bg-green-700 transition-colors shadow-lg flex justify-center items-center disabled:opacity-70 mt-4">
                                <svg v-if="procesandoPago" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                {{ procesandoPago ? 'Procesando encriptado...' : `Pagar $${(boletoSeleccionado.precio * cantidad).toFixed(2)}` }}
                            </button>

                            <button @click="cancelarYRegresar" :disabled="procesandoPago" class="w-full py-3 mt-3 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors">
                                Cancelar y liberar asientos
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else-if="paso === 3" class="p-12 text-center animate-fade-in">
                    <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h3 class="text-3xl font-black text-gray-900 mb-2">¡Compra Exitosa!</h3>
                    <p class="text-gray-600 text-lg mb-8">Tus lugares están asegurados. Hemos enviado un recibo a tu correo electrónico.</p>
                    
                    <button @click="$router.push('/horarios')" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black shadow hover:bg-indigo-700 transition-colors inline-flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Volver a la cartelera
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import { 
    obtenerBoletosPorPartidoService, 
    iniciarReservaService, 
    confirmarPagoService, 
    cancelarReservaService 
} from '../../services/ticketingService'; 

const route = useRoute();
const router = useRouter();

// Variables de Estado
const paso = ref(1);
const cargandoBoletos = ref(true);
const procesandoReserva = ref(false);
const procesandoPago = ref(false);
const errorReserva = ref('');
const errorPago = ref('');

const partidoId = route.params.id_partido; // Asume que la ruta es /comprar-boleto/:id_partido
const boletosDisponibles = ref([]);
const boletoSeleccionado = ref(null);
const cantidad = ref(1);
const idTransaccionLocal = ref(null);

// Variables Stripe
let stripe = null;
let elements = null;
let cardElement = null;
const clientSecretStripe = ref('');
const cardElementRef = ref(null); // Referencia al div del HTML

// Variables Temporizador
const tiempoRestante = ref(600); // 10 minutos = 600 segundos
let timerInterval = null;

// Obtener usuario logueado
const user = computed(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); } 
    catch { return null; }
});

// ==========================================
// 1. CARGA INICIAL
// ==========================================
onMounted(async () => {
    console.log("🎟️ [FRONTEND] Iniciando vista de compra. ID de partido capturado de la ruta:", partidoId);
    
    if (!user.value) {
        console.warn("🎟️ [FRONTEND] Usuario no logueado, redirigiendo a /login");
        router.push('/login');
        return;
    }
    
    try {
        cargandoBoletos.value = true;
        console.log("🎟️ [FRONTEND] Llamando al servicio para obtener boletos...");
        const data = await obtenerBoletosPorPartidoService(partidoId);
        
        console.log("🎟️ [FRONTEND] Datos crudos recibidos del backend:", data);
        boletosDisponibles.value = data;
        
    } catch (error) {
        console.error("🎟️ [FRONTEND ERROR] Falló la petición:", error);
    } finally {
        cargandoBoletos.value = false;
    }
});

onBeforeUnmount(async () => {
    detenerTemporizador();
    if (paso.value === 2 && idTransaccionLocal.value) {
        try { await cancelarReservaService(idTransaccionLocal.value); } catch(e) {}
    }
});

const seleccionarBoleto = (boleto) => {
    if(boleto.disponibles > 0) {
        boletoSeleccionado.value = boleto;
        cantidad.value = 1;
        errorReserva.value = '';
    }
};

const iniciarCheckout = async () => {
    if (!boletoSeleccionado.value) return;

    errorReserva.value = '';
    procesandoReserva.value = true;
    const total = (boletoSeleccionado.value.precio * cantidad.value).toFixed(2);

    try {
        // 1. Hablamos con el Backend para bloquear los asientos y generar la llave de Stripe
        const respuesta = await iniciarReservaService(
            user.value.id_usuario, 
            boletoSeleccionado.value.id_boleto, 
            cantidad.value, 
            total
        );

        idTransaccionLocal.value = respuesta.idTransaccion;
        clientSecretStripe.value = respuesta.clientSecret;

        // 2. Cambiamos de pantalla
        paso.value = 2;
        iniciarTemporizador();

        // 3. Montamos el formulario de Stripe (usamos nextTick para asegurar que el div ya existe en el DOM)
        await nextTick();
        await montarStripe();

    } catch (error) {
        errorReserva.value = error.response?.data?.error || "Error al asegurar los asientos. Es posible que alguien más los haya tomado.";
    } finally {
        procesandoReserva.value = false;
    }
};

const montarStripe = async () => {
    // 🔴 Inicializamos Stripe con la clave pública de tu .env
    stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    
    // Personalizamos el diseño del input de la tarjeta
    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#4f46e5', // indigo-600
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            fontFamily: 'system-ui, sans-serif',
        },
    };

    elements = stripe.elements({ clientSecret: clientSecretStripe.value, appearance });
    
    cardElement = elements.create('payment', { layout: 'tabs' });
    cardElement.mount(cardElementRef.value);
};

const procesarPago = async () => {
    errorPago.value = '';
    procesandoPago.value = true;

    try {
        console.log("💳 [STRIPE] Iniciando confirmación de pago con el banco...");
        
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (error) {
            console.error(" [STRIPE ERROR] Pago rechazado:", error.message);
            errorPago.value = error.message;
            procesandoPago.value = false;
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            console.log(" [STRIPE] Pago exitoso. Procediendo a armar datos para el Backend.");
            
            const rawStorage = localStorage.getItem('usuario');
            console.log(" [VUE DEBUG] String crudo en LocalStorage:", rawStorage);
            
            const userData = rawStorage ? JSON.parse(rawStorage) : null;
            
            if (!userData) {
                throw new Error("No se encontró sesión de usuario en el navegador.");
            }
            const correoExtraido = userData.correo || userData.email;
            const nombreCompleto = `${userData.nombre || ''} ${userData.apellido || ''}`.trim();

            console.log(" [VUE DEBUG] Correo extraído:", correoExtraido);
            console.log(" [VUE DEBUG] Nombre armado:", nombreCompleto);

            if (!correoExtraido) {
                throw new Error("Tu perfil de usuario no tiene un correo registrado.");
            }

            await confirmarPagoService(
                idTransaccionLocal.value,
                correoExtraido, 
                nombreCompleto, 
                {
                    partido: "Partido Oficial",
                    zona: boletoSeleccionado.value.zona,
                    cantidad: cantidad.value,
                    total: (boletoSeleccionado.value.precio * cantidad.value).toFixed(2)
                }
            );

            // 4. Éxito total
            console.log(" [VUE] Todo el proceso terminó con éxito. Cambiando a pantalla final.");
            detenerTemporizador();
            idTransaccionLocal.value = null; 
            paso.value = 3;
        }

    } catch (error) {
        console.error("[VUE ERROR] Fallo general en procesarPago:", error);
        
        // Si el error viene de Axios (Backend), mostramos el mensaje que nos mandó
        if (error.response && error.response.data && error.response.data.error) {
            errorPago.value = "Error del servidor: " + error.response.data.error;
        } else {
            errorPago.value = error.message || "Error al procesar el recibo y guardar en la base de datos.";
        }
    } finally {
        procesandoPago.value = false;
    }
};

// ==========================================
// 4. CANCELACIÓN Y TEMPORIZADOR
// ==========================================
const cancelarYRegresar = async () => {
    if(idTransaccionLocal.value) {
        try { await cancelarReservaService(idTransaccionLocal.value); } catch(e) {}
    }
    detenerTemporizador();
    idTransaccionLocal.value = null;
    errorPago.value = '';
    paso.value = 1; // Volvemos a la selección de asientos
};

const iniciarTemporizador = () => {
    tiempoRestante.value = 600;
    timerInterval = setInterval(() => {
        tiempoRestante.value--;
        if (tiempoRestante.value <= 0) {
            detenerTemporizador();
            alert("El tiempo para completar la compra ha expirado. Los asientos han sido liberados.");
            cancelarYRegresar(); // Forzamos el regreso
        }
    }, 1000);
};

const detenerTemporizador = () => {
    if (timerInterval) clearInterval(timerInterval);
};

const tiempoFormateado = computed(() => {
    const minutos = Math.floor(tiempoRestante.value / 60);
    const segundos = tiempoRestante.value % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
});

</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>