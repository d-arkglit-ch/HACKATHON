<script setup>
import AppNavbar from '@/components/AppNavbar.vue'; // Import Navbar
</script>

<template>
  <AppNavbar/>
  <div class="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center p-6">
    <div class="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
      <h1 class="text-4xl font-bold text-center mb-6 text-blue-400">All Classes</h1>

      <!-- Create Class & Refresh Buttons -->
      <div class="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <router-link to="/create">
          <button class="btn btn-primary">+ Create New Class</button>
        </router-link>
        <button @click="refreshClasses" class="btn btn-success">🔄 Refresh</button>
      </div>

      <!-- Class List -->
      <div v-if="classes.length" class="space-y-4">
        <div
          v-for="classItem in classes"
          :key="classItem.code"
          class="class-card"
        >
          <div>
            <router-link :to="'/assignments/' + classItem._id" class="class-title">
              {{ classItem.name }}
            </router-link>
            <p class="text-sm text-gray-400">Code: <span class="text-blue-400 font-semibold">{{ classItem.code }}</span></p>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="copyClassCode(classItem.code)" class="btn btn-warning">📋 Copy Code</button>
            <button @click="deleteClass(classItem._id)" class="btn btn-danger">🗑 Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-400">No classes available.</div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return { classes: [] };
  },
  async created() {
    await this.fetchClasses();
  },
  methods: {
    async fetchClasses() {
      try {
        const response = await api.get('/classes'); 
        this.classes = response.data;
      } catch (error) {
        console.error('❌ Error fetching classes:', error);
      }
    },
    async deleteClass(classId) {
      if (!confirm('Are you sure you want to delete this class?')) return;
      try {
        await api.delete(`/classes/${classId}`);
        this.classes = this.classes.filter(cls => cls._id !== classId); 
        alert('✅ Class deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting class:', error);
        alert('❌ Failed to delete class.');
      }
    },
    copyClassCode(code) {
      navigator.clipboard.writeText(code);
      alert('✅ Class code copied to clipboard!');
    },
    async refreshClasses() {
      await this.fetchClasses();
    }
  }
};
</script>

<style scoped>
/* Button Styling */
.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

/* Button Hover Effects */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

/* Button Colors */
.btn-primary {
  background: linear-gradient(to right, #4f46e5, #6d28d9);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(to right, #4338ca, #5b21b6);
}

.btn-success {
  background: linear-gradient(to right, #059669, #065f46);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(to right, #047857, #064e3b);
}

.btn-warning {
  background: linear-gradient(to right, #d97706, #b45309);
  color: white;
}

.btn-warning:hover {
  background: linear-gradient(to right, #c2410c, #9a3412);
}

.btn-danger {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(to right, #b91c1c, #991b1b);
}

/* Class Card */
.class-card {
  background: #374151;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, transform 0.2s ease-in-out;
}

.class-card:hover {
  background: #4b5563;
  transform: scale(1.02);
}

/* Class Title */
.class-title {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  transition: color 0.3s ease-in-out;
}

.class-title:hover {
  color: #93c5fd;
}
</style>
