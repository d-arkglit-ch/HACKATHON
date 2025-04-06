<script setup>
import { ref, onMounted } from 'vue';
import AppNavbar from '@/components/AppNavbar.vue';
import api from '@/api';

const props = defineProps({
  classId: String,
});

const assignments = ref([]);
const oldAssignments = ref([]);
const newAssignmentTitle = ref('');
const newAssignmentUrl = ref('');
const className = ref('Loading...');
const loading = ref(false);

const fetchAssignments = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/assignments/${props.classId}`);
    assignments.value = response.data.newAssignments || [];
    oldAssignments.value = response.data.oldAssignments || [];
    className.value = response.data.className || 'Unknown Class';
  } catch (error) {
    console.error('❌ Error fetching assignments:', error);
    assignments.value = [];
    oldAssignments.value = [];
    className.value = 'Unknown Class';
  }
  loading.value = false;
};

const createAssignment = async () => {
  if (!newAssignmentTitle.value.trim() || !newAssignmentUrl.value.trim()) {
    alert("❌ Assignment title and URL cannot be empty!");
    return;
  }

  loading.value = true;
  try {
    const response = await api.post('/assignments', {
      title: newAssignmentTitle.value,
      fileUrl: newAssignmentUrl.value,
      classId: props.classId
    });
    assignments.value.push(response.data);
    newAssignmentTitle.value = '';
    newAssignmentUrl.value = '';
    alert("✅ Assignment created successfully!");
  } catch (error) {
    console.error('❌ Error creating assignment:', error);
    alert('❌ Failed to create assignment.');
  }
  loading.value = false;
};

const deleteAssignment = async (assignmentId) => {
  if (!confirm('Are you sure you want to delete this assignment?')) return;

  loading.value = true;
  try {
    await api.delete(`/assignments/${assignmentId}`);
    assignments.value = assignments.value.filter(a => a._id !== assignmentId);
    alert('✅ Assignment deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    alert('❌ Failed to delete assignment.');
  }
  loading.value = false;
};

onMounted(fetchAssignments);
</script>

<template>
  <AppNavbar />
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

      <!-- New Assignments -->
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
          <button @click="deleteAssignment(assignment._id)" :disabled="loading" class="btn btn-danger">
            🗑 Delete
          </button>
        </div>
      </div>

      <!-- Old Assignments -->
      <div v-else-if="oldAssignments.length" class="grid gap-6 mt-8">
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

      <!-- No Assignments -->
      <div v-else class="text-center text-gray-400 mt-6">No assignments found.</div>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  @apply p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full;
}
.btn {
  @apply px-4 py-2 rounded text-white font-semibold transition;
}
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700;
}
.btn-danger {
  @apply bg-red-600 hover:bg-red-700;
}
</style>
