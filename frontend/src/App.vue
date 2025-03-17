<script setup>

import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
<div class="bg-black min-h-screen text-white">
  <!-- Router View with transition effect -->
  <Transition name="fade" mode="out-in">
    <RouterView />
  </Transition>
</div>
</template>

<style>
html, body {
margin: 0;
padding: 0;
box-sizing: border-box;
background-color: black; /* Ensures full black background */
}

/* Fade transition effect */
.fade-enter-active, .fade-leave-active {
transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
opacity: 0;
}
</style>

