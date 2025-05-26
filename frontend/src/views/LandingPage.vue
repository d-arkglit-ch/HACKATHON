<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Router instance for programmatic navigation
const router = useRouter();

// State for loading and authentication
const isLoading = ref(true);
const isAuthenticated = ref(false);
const user = ref(null); // Store user details (role, classesJoined)

// Check authentication status on mount
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5001/auth/check-auth', {
      withCredentials: true, // Include session cookies
    });

    if (response.data.isAuthenticated) {
      isAuthenticated.value = true;
      user.value = response.data.user;
    }
  } catch (error) {
    console.error('Failed to check authentication:', error);
  } finally {
    isLoading.value = false;
  }
});

// Login/Enter handler
const logIn = async () => {
  if (isAuthenticated.value && user.value) {
    // If authenticated, redirect to the appropriate dashboard
    const { role, classesJoined } = user.value;
    if (role === 'Student') {
      const hasJoinedClass = classesJoined && classesJoined.length > 0;
      router.push(hasJoinedClass ? '/joined-subjects' : '/student-dashboard');
    } else if (role === 'Teacher') {
      router.push('/teacher-dashboard');
    } else {
      // Fallback for unexpected roles
      console.warn('Unexpected user role:', role);
      router.push('/');
    }
  } else {
    // If not authenticated, trigger Google OAuth
    window.location.href = 'http://localhost:5001/auth/google/login';
  }
};

// Signup handler
const signUp = () => {
  window.location.href = 'http://localhost:5001/auth/google/signup';
};
</script>

<template>
  <div v-if="isLoading"
    class="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <div class="text-white text-lg">Loading...</div>
  </div>
  <div v-else
    class="w-screen h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover">
      <source src="/a.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- Navbar -->
    <header
      class="w-[90%] z-10 h-[8%] sticky m-[2%] flex items-center justify-between px-6 rounded-3xl border border-gray-500 backdrop-blur-lg bg-opacity-30 bg-white/10">
      <div class="flex items-center space-x-3">
        <h1 class="text-3xl font-bold tracking-wide neon-text">Studify</h1>
      </div>

      <div class="w-auto h-[90%] px-1 gap-2 flex items-center rounded-3xl space-x-2">
        <button
  @click="logIn"
  class="relative h-[40px] overflow-hidden backdrop-blur-xs bg-opacity-20 bg-white/15 border-2 border-purple-900 rounded-3xl px-5 py-1 shadow-2xl transition-all
         before:absolute before:left-0 before:right-0 before:top-0 before:h-0 before:w-full 
         before:bg-gradient-to-r before:from-purple-500 before:to-blue-400 before:duration-200
         after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0 after:w-full 
         after:bg-gradient-to-r after:from-purple-500 after:to-blue-400 after:duration-200
         hover:text-white hover:shadow-purple-900 hover:before:h-2/4 hover:after:h-2/4">

 
          <span v-if="isAuthenticated && user" class="block sm:hidden relative z-10">Enter</span>
          <span v-if="isAuthenticated && user" class="hidden sm:block relative z-10">
            Welcome  <b>{{ user.username }}</b>
          
          </span>
          <span v-else class="relative z-10">Login</span>
        </button>
        <button @click="signUp"
          class="relative h-[40px] hidden sm:block overflow-hidden border-2  backdrop-blur-xs bg-opacity-20 bg-white/15 border-purple-900 rounded-3xl px-5 py-1 shadow-2xl transition-all
         before:absolute before:left-0 before:right-0 before:top-0 before:h-0 before:w-full 
         before:bg-gradient-to-r before:from-purple-500 before:to-blue-400 before:duration-500
         after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0 after:w-full 
         after:bg-gradient-to-r after:from-purple-500 after:to-blue-400 after:duration-500
         hover:text-white hover:shadow-purple-900 hover:before:h-2/4 hover:after:h-2/4">
         <span class="relative z-10">Signup</span> 
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="flex flex-col z-10 items-center justify-center text-center text-white flex-1 px-6">
      <h2 class="text-4xl font-bold">Empower Your Teaching with AI</h2>
      <p class="mt-2 text-gray-400 text-lg max-w-2xl">
        Automate grading, feedback, and content analysis effortlessly. Enhance
        productivity with AI-driven tools.
      </p>
      <button @click="logIn" class="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-400">
        {{ isAuthenticated ? 'Enter Now' : 'Get Started' }}
      </button>
    </main>
  </div>
</template>

<style>
.neon-text {
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff9900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(255, 153, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.5);
  animation: glow 1.5s infinite alternate;
}

.hov:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}
</style>
