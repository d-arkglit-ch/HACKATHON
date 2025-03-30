<script setup>
import { RouterView } from 'vue-router';
//import AppNavbar from '@/components/AppNavbar.vue'; // ✅ Imported Navbar Component
</script>

<template>
  <div class="bg-black min-h-screen text-white overflow-x-hidden">
    <!-- Include Navbar -->
    <AppNavbar />

    <!-- Page Content with Transition Effect -->
    <Transition name="fade" mode="out-in">
      <RouterView />
    </Transition>
  </div>
</template>

<style scoped>
/* Fade transition effect */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
