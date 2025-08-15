<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(true);
const isAuthenticated = ref(false);
const user = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5001/auth/check-auth', { withCredentials: true });
    if (response.data.isAuthenticated) {
      isAuthenticated.value = true;
      user.value = response.data.user;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const logIn = () => {
  if (isAuthenticated.value && user.value) {
    const { role, classesJoined } = user.value;
    if (role === 'Student') {
      router.push(classesJoined?.length ? '/joined-subjects' : '/student-dashboard');
    } else if (role === 'Teacher') {
      router.push('/teacher-dashboard');
    }
  } else {
    window.location.href = 'http://localhost:5001/auth/google/login';
  }
};

const signUp = () => {
  window.location.href = 'http://localhost:5001/auth/google/signup';
};
</script>

<template>
  <div v-if="isLoading" class="w-screen h-screen flex items-center justify-center bg-black">
    <p class="text-white text-lg">Loading...</p>
  </div>

  <div v-else class="relative w-screen h-screen overflow-hidden text-white">
    <!-- Video Background -->
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover z-0">
      <source src="/a.mp4" type="video/mp4" />
    </video>
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 z-0"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col h-full px-6">
      <!-- Navbar -->
      <header class="flex justify-between items-center py-4">
        <h1 class="text-3xl font-bold neon-text">Studify</h1>
        <div class="space-x-4">
          <button @click="logIn" class="btn-glow">{{ isAuthenticated ? 'Enter' : 'Login' }}</button>
          <button @click="signUp" class="btn-outline hidden sm:inline">Signup</button>
        </div>
      </header>

      <!-- Hero Section -->
      <main class="flex-1 flex flex-col justify-center items-center text-center">
        <h2 class="text-5xl font-extrabold mb-4 drop-shadow-md">Empower Your Teaching with AI</h2>
        <p class="text-lg text-gray-300 max-w-xl">
          AI-powered assignment review with diagram detection, text extraction, and verified feedback by educators.
        </p>
        <button @click="logIn" class="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold">
          {{ isAuthenticated ? 'Enter Now' : 'Get Started Free' }}
        </button>
      </main>

      <!-- Footer -->
      <footer class="text-center text-sm text-gray-400 py-4">
        © 2025 Studify • Built with passion by the Studify Team •
      </footer>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.neon-text {
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff9900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 6px #0ff, 0 0 12px #0ff;
}

.btn-glow {
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #7e22ce;
  border-radius: 9999px;
  color: white;
  transition: all 0.3s ease;
}
.btn-glow:hover {
  background: linear-gradient(to right, #8b5cf6, #38bdf8);
  color: white;
  box-shadow: 0 0 10px #7e22ce;
}

.btn-outline {
  padding: 0.6rem 1.2rem;
  border: 1px solid #7e22ce;
  border-radius: 9999px;
  color: #d1d5db;
  background: transparent;
  transition: all 0.3s ease;
}
.btn-outline:hover {
  background: #7e22ce;
  color: white;
}
</style>
