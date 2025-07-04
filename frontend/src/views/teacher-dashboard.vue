<script setup>
import AppNavbar from '@/components/AppNavbar.vue'; // Import Navbar
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <AppNavbar />

    <main class="p-6 text-center">
      <h1 class="text-4xl font-bold mb-4 text-blue-400">Welcome to Studify</h1>
      <p class="text-lg text-gray-300 mb-6">
        Manage classes, assignments, and feedback efficiently.
      </p>
      <router-link to="/classes">
        <button class="btn-primary">Get Started</button>
      </router-link>
    </main>
  </div>
</template>

<style scoped>
/* Primary Button */
.btn-primary {
  background: linear-gradient(to right, #4f46e5, #6d28d9);
  padding: 12px 24px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
  color: white;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(to right, #4338ca, #5b21b6);
  transform: scale(1.05);
}
</style>
