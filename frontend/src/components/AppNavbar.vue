<!-- ✅ src/components/AppNavbar.vue -->
<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="navbar">
    <div class="nav-links">
      <RouterLink to="/" class="nav-link" active-class="active-link">Home</RouterLink>
      <RouterLink to="/classes" class="nav-link" active-class="active-link">Create Class</RouterLink>
      <RouterLink to="/class-list" class="nav-link" active-class="active-link">Class List</RouterLink>
      <RouterLink to="/upload-assignment/1" class="nav-link" active-class="active-link">Upload Assignment</RouterLink>
      <RouterLink to="/submissions/1" class="nav-link" active-class="active-link">Submissions</RouterLink>
      <RouterLink to="/profile" class="nav-link" active-class="active-link">Profile</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
/* Navbar */
.navbar {
  background: linear-gradient(to right, #1f2937, #111827);
  padding: 14px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

/* Nav Links */
.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  padding: 8px 12px;
  transition: all 0.3s ease-in-out;
  border-radius: 5px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

/* Active Page Indicator */
.active-link {
  background-color: #4f46e5;
  padding: 8px 12px;
  border-radius: 5px;
}
</style>
