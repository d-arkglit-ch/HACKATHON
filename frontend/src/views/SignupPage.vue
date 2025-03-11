<script setup>
import { RouterLink } from 'vue-router';
</script>



<template>
<main class="h-screen w-screen flex justify-center items-center ">
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover">
      <source src="/a.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div class="h-[90%]  w-[80%] sm:w-[40%] lg:h-[63%]  p-5 rounded-3xl border border-gray-500 backdrop-blur-lg bg-opacity-30 bg-white/10 ">

      <RouterLink to="/" class="absolute top-4 left-4 text-gray-400    hover:text-blue-400 transition flex items-center">
        <img src="/back.svg "  class=" w-7 h-7 mr-5" alt="">
      </RouterLink>
        <h1 class="text-3xl font-bold text-center text-gray-300 mb-1">Signup</h1>
        <form class="space-y-4">
        <!-- Name -->
        <div>
          <label class="text-gray-300 text-sm font-medium">Full Name</label>
          <input type="text" placeholder="Enter your name"
            class="w-full mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <!-- Email -->
        <div>
          <label class="text-gray-300 text-sm font-medium">Email Address</label>
          <input type="email" placeholder="Enter your email"
            class="w-full mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <!-- Password -->
        <div>
          <label class="text-gray-300 text-sm font-medium">Password</label>
          <input type="password" placeholder="Create a password"
            class="w-full mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>
        <div>

          <!--roles-->
          <label for="Role" class="text-gray-300 text-sm font-medium w-[20%]">Select Role</label>
          <select id="Role" class="m-1 w-[50%] rounded-lg p-3 bg-gray-800 text-gray-400 border border-gray-700 " placeholder="Select Role">
            <option value="techer">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
          Create Account
        </button>
      </form>
 <!-- OR Divider -->
      <div class="flex items-center justify-center my-4">
        <div class="w-1/3 h-[1px] bg-gray-700"></div>
        <span class="text-gray-400 text-sm mx-3">OR</span>
        <div class="w-1/3 h-[1px] bg-gray-700"></div>
      </div>

      <!-- Google Sign-Up Button (Non-functional for now) -->
      <button class="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition">
        <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-5 h-5 mr-2" alt="Google Logo">
        Sign Up with Google
      </button>

  


      <p class="text-gray-400 text-center mt-4 text-sm">
        Already have an account?
        <RouterLink to="/login" class="text-blue-400 hover:text-blue-500">Log in</RouterLink>
      </p>
    </div>

</main>
    
</template>