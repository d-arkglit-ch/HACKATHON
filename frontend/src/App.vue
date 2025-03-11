<script setup>
  import Navbar from "./components/Navbar.vue";
  import joinClass from "./components/JoinClass.vue"; 
</script>

<template>
  <div class="bg-black min-h-screen text-white">
    <Navbar />
    <joinClass />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: black; /* Ensures full black background */
}
</style>


