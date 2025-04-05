<template>
  <div class="min-h-screen bg-black text-white p-6 flex items-center justify-center">
    <div class="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-6 text-blue-400">Upload Assignment</h1>

      <!-- Select Class Dropdown -->
      <div class="mb-6">
        <label for="classSelect" class="block text-lg mb-2">Select Class:</label>
        <select v-model="selectedClassId" id="classSelect" class="input-field" @change="fetchAssignments">
          <option value="" disabled>Select a Class</option>
          <option v-for="classItem in classes" :key="classItem._id" :value="classItem._id">
            {{ classItem.name }} (Code: {{ classItem.code }})
          </option>
        </select>
      </div>

      <!-- Assignment Upload Form -->
      <form @submit.prevent="uploadAssignment" class="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4" v-if="selectedClassId">
        <input v-model="title" type="text" placeholder="Assignment Title" class="input-field" required />
        <textarea v-model="description" placeholder="Assignment Description" class="input-field h-24" required></textarea>
        <input v-model="fileUrl" type="text" placeholder="File URL" class="input-field" required />
        <input v-model="dueDate" type="date" class="input-field" required />

        <button type="submit" class="btn-primary w-full">📤 Upload Assignment</button>
      </form>

      <!-- Success Message -->
      <p v-if="successMessage" class="text-green-400 text-center mt-4">{{ successMessage }}</p>

      <!-- Existing Assignments -->
      <h2 class="text-2xl font-semibold mt-6 text-gray-300" v-if="selectedClassId">Assignments</h2>
      <ul class="mt-4 space-y-2" v-if="assignments.length">
        <li v-for="assign in assignments" :key="assign._id" class="p-3 bg-gray-700 rounded-lg shadow-md">
          <strong class="text-white">{{ assign.title }}</strong>  
          <p class="text-gray-400">Due: {{ new Date(assign.dueDate).toLocaleDateString() }}</p>
        </li>
      </ul>
      <p v-else class="text-gray-400 text-center mt-4">No assignments uploaded yet.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return { 
      title: '', 
      description: '', 
      fileUrl: '', 
      dueDate: '', 
      assignments: [], 
      classes: [],
      selectedClassId: '', // Store selected class
      successMessage: '' // Success message for confirmation
    };
  },
  methods: {
    async fetchClasses() {
      try {
        const res = await axios.get('http://localhost:5000/api/classes');
        this.classes = res.data;
      } catch (error) {
        console.error('❌ Error fetching classes:', error);
      }
    },
    async fetchAssignments() {
      if (!this.selectedClassId) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/assignments/${this.selectedClassId}`);
        this.assignments = res.data;
      } catch (error) {
        console.error('❌ Error fetching assignments:', error);
      }
    },
    async uploadAssignment() {
      if (!this.selectedClassId) {
        alert('⚠ Please select a class before uploading.');
        return;
      }
      try {
        const res = await axios.post('http://localhost:5000/api/assignments', {
          classId: this.selectedClassId,
          title: this.title,
          description: this.description,
          fileUrl: this.fileUrl,
          dueDate: this.dueDate,
        });
        this.assignments.push(res.data);
        this.title = this.description = this.fileUrl = this.dueDate = ''; // Reset fields

        // Show success message
        this.successMessage = '✅ Assignment uploaded successfully!';
        setTimeout(() => (this.successMessage = ''), 3000); // Hide after 3 seconds
      } catch (error) {
        console.error('❌ Error uploading assignment:', error);
      }
    }
  },
  mounted() {
    this.fetchClasses();
  }
};
</script>

<style scoped>
/* Input Field */
.input-field {
  width: 100%;
  padding: 10px;
  margin-top: 8px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
  transition: border 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 8px rgba(79, 70, 229, 0.5);
}

/* Primary Button */
.btn-primary {
  margin-top: 10px;
  background: linear-gradient(to right, #4f46e5, #6d28d9);
  padding: 12px 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  color: white;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
}

.btn-primary:hover {
  background: linear-gradient(to right, #4338ca, #5b21b6);
  transform: scale(1.05);
}

/* Assignments List */
.bg-gray-700 {
  transition: background 0.3s, transform 0.2s ease-in-out;
}

.bg-gray-700:hover {
  background: #4b5563;
  transform: scale(1.02);
}
</style>
