<script setup>
import { RouterLink } from 'vue-router';

  
   const  logIn=()=> {
      window.location.href = "http://localhost:5001/auth/google/login"; // Calls backend login route
    };


   const  signUp=() =>{
      window.location.href = "http://localhost:5001/auth/google/signup";
    };
  

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

<div class="flex items-center space-x-3">
      <h1 class="text-3xl font-bold tracking-wide neon-text">Studify</h1>
</div>
      
      <div class="w-auto h-[90%] px-1  gap-2  flex  items-center rounded-3xl space-x-2">
        <button  @click="logIn"  class="text-white lg:text-lg text-sm rounded-3xl pl-5 pr-5 py-2 px-2 border-2 border-gray-500  bg-gradient-to-r from-purple-500 to-blue-400 ">Login </button>
        <button @click="signUp" class="hidden sm:block text-white lg:text-lg text-sm rounded-3xl pl-5 pr-5 py-2 px-2 border-2 border-gray-500   bg-gradient-to-r from-purple-500 to-blue-400">Signup</button>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex flex-col z-10   items-center justify-center text-center text-white flex-1 px-6">
      <h2 class="text-4xl font-bold">Empower Your Teaching with AI</h2>
      <p class="mt-2 text-gray-400 text-lg max-w-2xl">
        Automate grading, feedback, and content analysis effortlessly. Enhance productivity with AI-driven tools.
      </p>
      <button  @click="logIn" class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400">
        Get Started
      </button>
    </main>
  </div>
</template>

<style>
.neon-text {
  font-family: "Orbitron", sans-serif;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff9900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(255, 153, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.5);
  animation: glow 1.5s infinite alternate;
}
</style>