<script setup>
import AppNavbar from '@/components/AppNavbar.vue'; // Import Navbar
</script>


<template>
 
<AppNavbar/>
  <div class="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center p-6">
    <div class="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
      <h1 class="text-4xl font-bold text-center mb-6 text-blue-400">
        Assignments for {{ className }}
      </h1>

      <!-- Add Assignment -->
      <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input v-model="newAssignmentTitle" type="text" placeholder="Enter assignment title..." class="input-field" />
        <input v-model="newAssignmentUrl" type="url" placeholder="Enter assignment URL..." class="input-field" />
        <button @click="createAssignment" :disabled="loading" class="btn btn-primary">
          <span v-if="loading">⏳ Adding...</span>
          <span v-else>+ Add Assignment</span>
        </button>
      </div>

      <!-- New Assignments Section -->
      <div v-if="assignments.length" class="grid gap-6">
        <h2 class="text-xl font-semibold text-white">📌 New Assignments</h2>
        <div
          v-for="assignment in assignments"
          :key="assignment._id"
          class="bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-600 transition transform hover:-translate-y-1 flex justify-between items-center"
        >
          <div>
            <p class="text-white font-semibold">{{ assignment.title }}</p>
            <a 
              v-if="assignment.fileUrl || assignment.url"
              :href="assignment.fileUrl || assignment.url"
              target="_blank"
              class="text-blue-400 underline hover:text-blue-300 text-sm"
            >
              📄 View Assignment
            </a>
          </div>
          <button @click="deleteAssignment(assignment._id)" :disabled="loading" class="btn btn-danger">🗑 Delete</button>
        </div>
      </div>

      <!-- Old Assignments Section -->
      <div v-else-if="oldAssignments.length" class="grid gap-6">
        <h2 class="text-xl font-semibold text-gray-400">📂 Old Assignments</h2>
        <div
          v-for="oldAssignment in oldAssignments"
          :key="oldAssignment._id"
          class="bg-gray-600 p-5 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <p class="text-gray-300 font-semibold">{{ oldAssignment.title }}</p>
            <a 
              v-if="oldAssignment.fileUrl || oldAssignment.url"
              :href="oldAssignment.fileUrl || oldAssignment.url"
              target="_blank"
              class="text-blue-400 underline hover:text-blue-300 text-sm"
            >
              📄 View Assignment
            </a>
          </div>
        </div>
      </div>

      <!-- No Assignments Case -->
      <div v-else class="text-center text-gray-400">No assignments found.</div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  props: ['classId'],  
  data() {
    return {
      assignments: [],  
      oldAssignments: [],  
      newAssignmentTitle: '',
      newAssignmentUrl: '',  
      className: 'Loading...',
      loading: false
    };
  },
  async created() {
    await this.fetchAssignments();
  },
  methods: {
    async fetchAssignments() {
      this.loading = true;
      try {
        const response = await api.get(`/assignments/${this.classId}`);
        this.assignments = response.data.newAssignments || [];  
        this.oldAssignments = response.data.oldAssignments || [];  
        this.className = response.data.className || 'Unknown Class';
      } catch (error) {
        console.error('❌ Error fetching assignments:', error);
        this.assignments = [];  
        this.oldAssignments = [];
        this.className = 'Unknown Class';
      }
      this.loading = false;
    },
    async createAssignment() {
      if (!this.newAssignmentTitle.trim() || !this.newAssignmentUrl.trim()) {
        alert("❌ Assignment title and URL cannot be empty!");
        return;
      }

      this.loading = true;
      try {
        const response = await api.post('/assignments', { 
          title: this.newAssignmentTitle, 
          fileUrl: this.newAssignmentUrl,  
          classId: this.classId 
        });
        this.assignments.push(response.data);
        this.newAssignmentTitle = "";
        this.newAssignmentUrl = "";
        alert("✅ Assignment created successfully!");
      } catch (error) {
        console.error('❌ Error creating assignment:', error);
        alert('❌ Failed to create assignment.');
      }
      this.loading = false;
    },
    async deleteAssignment(assignmentId) {
      if (!confirm('Are you sure you want to delete this assignment?')) return;

      this.loading = true;
      try {
        await api.delete(`/assignments/${assignmentId}`);
        this.assignments = this.assignments.filter(a => a._id !== assignmentId);
        alert('✅ Assignment deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting assignment:', error);
        alert('❌ Failed to delete assignment.');
      }
      this.loading = false;
    }
  }
};
</script>
