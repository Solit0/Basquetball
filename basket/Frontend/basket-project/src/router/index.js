import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Entrenador from '../views/EntrenadorDashboard.vue'
import CreateTeam from '../views/CreateTeam.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import Espectadores from '../views/Espectadores.vue'
import ArbitroDashboard from '../views/ArbitroDashboard.vue' // ← Agregar esta vista
import EquiposLibres from '../views/EquiposLibres.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', 
      name: 'Inicio',
      component: Espectadores,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/equipos-libres',
      name: 'EquiposLibres',
      component: EquiposLibres,
      meta: { requiresAuth: true, rolAceptado: 'entrenador' }
    },
    {
      path: '/crear-equipo',
      name: 'CreateTeam',
      component: CreateTeam,
      meta: { requiresAuth: true, rolAceptado: 'entrenador' }
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true, rolAceptado: 'administrador' }
    },
    {
      path: '/entrenador',
      name: 'Entrenador',
      component: Entrenador,
      meta: { requiresAuth: true, rolAceptado: 'entrenador' }
    },
    {
      path: '/arbitro/dashboard', 
      name: 'ArbitroDashboard',
      component: ArbitroDashboard,
      meta: { requiresAuth: true, rolAceptado: 'arbitro' }
    }
  ],
})

router.beforeEach((to, from, next) => {
    
    const estaLogueado = localStorage.getItem('usuario_id') !== null
    
    // Mejor manejo del parseo de JSON
    let usuario = {}
    try {
        usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    } catch (e) {
        console.error('Error al parsear usuario:', e)
    }

    if (to.meta.requiresAuth && !estaLogueado) {
        next('/login')
    } 
    else if (to.meta.requiresAuth && to.meta.rolAceptado && to.meta.rolAceptado !== usuario.rol) {
        // Redirigir a su dashboard correspondiente si no tiene permiso
        if (usuario.rol === 'entrenador') {
            next('/entrenador')
        } else if (usuario.rol === 'administrador') {
            next('/admin/dashboard')
        } else if (usuario.rol === 'arbitro') {
            next('/arbitro/dashboard')
        } else {
            next('/')
        }
    }
    else if (to.path === '/login' && estaLogueado) {
        if (usuario.rol === 'entrenador') {
            next('/entrenador')
        } else if (usuario.rol === 'administrador') {
            next('/admin/dashboard')
        } else if (usuario.rol === 'arbitro') {
            next('/arbitro/dashboard')
        } else {
            next('/')
        }
    } 
    else {
        next()
    }
})

export default router
