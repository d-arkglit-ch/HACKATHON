<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <div>
  <Transition name="fade" mode="out-in">
  <RouterView />
  </Transition>
</div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>