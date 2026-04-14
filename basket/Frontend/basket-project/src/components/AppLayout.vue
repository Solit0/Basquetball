<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <AppNavbar />

    <div class="flex flex-1 overflow-hidden">
      <AppSidebar 
        :activeTab="activeTab" 
        :hasTeam="hasTeam" 
        @navigate="(tab) => $emit('navigate', tab)" 
      />

      <main class="flex-1 overflow-auto bg-gray-50/50">
        <div class="py-8 px-6 sm:px-8 lg:px-10">
          <slot />
        </div>
      </main>
    </div>

  </div>
</template>

<script setup>
import AppNavbar from './AppNavbar.vue'
import AppSidebar from './AppSidebar.vue'

defineProps({
  activeTab: { type: String, default: 'equipo' },
  hasTeam:   { type: Boolean, default: false }
})

defineEmits(['navigate'])
</script>