import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import Toast from "vue-toastification";
// 🔴 ¡ESTA ES LA LÍNEA QUE FALTA! 🔴
import "vue-toastification/dist/index.css"; 

const app = createApp(App)

app.use(router)
app.use(Toast, {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
});
app.mount('#app')