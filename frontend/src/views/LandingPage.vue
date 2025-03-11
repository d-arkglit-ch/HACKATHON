<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover">
      <source src="/a.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>


    
    <!-- Navbar -->
    <header class="w-[90%] z-10 h-[8%] sticky m-[2%] flex items-center justify-between px-6 
rounded-3xl border border-gray-500 backdrop-blur-lg bg-opacity-30 bg-white/10">

      <h1 class="text-white text-2xl">AI-Teacher-Assistant</h1>
      
      <div class="w-auto h-[90%] px-1  gap-2  flex  items-center rounded-3xl space-x-2">
        <RouterLink to="/login" class="text-white lg:text-lg text-sm rounded-3xl pl-5 pr-5 py-2 px-2 border-2 border-gray-500  bg-gradient-to-r from-purple-500 to-blue-400 ">Login </RouterLink>
        <RouterLink to="/signup" class="hidden sm:block text-white lg:text-lg text-sm rounded-3xl pl-5 pr-5 py-2 px-2 border-2 border-gray-500   bg-gradient-to-r from-purple-500 to-blue-400">Signup</RouterLink>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex flex-col z-10   items-center justify-center text-center text-white flex-1 px-6">
      <h2 class="text-4xl font-bold">Empower Your Teaching with AI</h2>
      <p class="mt-2 text-gray-400 text-lg max-w-2xl">
        Automate grading, feedback, and content analysis effortlessly. Enhance productivity with AI-driven tools.
      </p>
      <RouterLink to="/login" class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400">
        Get Started
      </RouterLink>
    </main>
  </div>
</template>
