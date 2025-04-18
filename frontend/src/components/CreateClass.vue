<script setup>
import AppNavbar from '@/components/AppNavbar.vue';
</script>

<template>
  <AppNavbar />
  <div class="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center p-6">
    <div class="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
      <h1 class="text-4xl font-bold text-center mb-6 text-blue-400">All Classes</h1>

      <!-- Form -->
      <div class="grid md:grid-cols-4 gap-4 mb-6">
        <input v-model="newClass.name" placeholder="Class name" class="input-field" />
        <input v-model="newClass.department" placeholder="Department" class="input-field" />
        <input v-model="newClass.subject" placeholder="Subject" class="input-field" />
        <button @click="createClass" class="btn btn-primary">+ Create</button>
      </div>

      <!-- Refresh Button -->
      <div class="mb-4 text-right">
        <button @click="refreshClasses" class="btn btn-success">🔄 Refresh</button>
      </div>

      <!-- Class List -->
      <div v-if="classes.length" class="space-y-4">
        <div
          v-for="classItem in classes"
          :key="classItem.code"
          class="bg-gray-700 p-5 rounded-lg shadow-md hover:bg-gray-600 transition flex justify-between items-center"
        >
          <div>
            <router-link :to="'/assignments/' + classItem._id" class="text-white font-semibold text-lg hover:underline capitalize text-xl">
              {{ classItem.name }}
            </router-link>
            <p class="text-sm text-gray-400">Code: <span class="text-blue-400">{{ classItem.code }}</span></p>
            <p class="text-sm text-gray-400">Dept: {{ classItem.department }} | Subject: {{ classItem.subject }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="copyClassCode(classItem.code)" class="btn btn-warning">📋 Copy Code</button>
            <button @click="deleteClass(classItem._id)" class="btn btn-danger">🗑 Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-400">No classes found.</div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      classes: [],
      newClass: {
        name: '',
        department: '',
        subject: ''
      }
    };
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
    async createClass() {
      const { name, department, subject } = this.newClass;
      if (!name || !department || !subject) {
        alert("❌ Fill in all fields!");
        return;
      }

      try {
        const response = await api.post('/classes', this.newClass);
        this.classes.push(response.data);
        this.newClass = { name: '', department: '', subject: '' };
        this.$router.push(`/assignments/${response.data._id}`);
        alert("✅ Class created!");
      } catch (error) {
        console.error('❌ Error creating class:', error);
        alert('❌ Failed to create class.');
      }
    },
    async deleteClass(id) {
      if (!confirm('Delete this class?')) return;
      try {
        await api.delete(`/classes/${id}`);
        this.classes = this.classes.filter(c => c._id !== id);
        alert('✅ Class deleted!');
      } catch (error) {
        console.error('❌ Error deleting class:', error);
      }
    },
    copyClassCode(code) {
      navigator.clipboard.writeText(code);
      alert('✅ Code copied!');
    },
    async refreshClasses() {
      await this.fetchClasses();
    }
  }
};
</script>

<style scoped>
.input-field {
  padding: 0.75rem;
  border-radius: 10px;
  background-color: #2d3748;
  color: white;
  border: 1px solid #4a5568;
  outline: none;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 120px;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(to right, #4f46e5, #6d28d9);
  color: white;
}

.btn-success {
  background: linear-gradient(to right, #059669, #065f46);
  color: white;
}

.btn-warning {
  background: linear-gradient(to right, #d97706, #b45309);
  color: white;
}

.btn-danger {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  color: white;
}
</style>
