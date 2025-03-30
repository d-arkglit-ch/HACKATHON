<script setup>
import AppNavbar from '@/components/AppNavbar.vue'; // Import Navbar
</script>

<template>
  <AppNavbar/>
  <div class="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-6 text-blue-400">Assignment Submissions</h1>

      <!-- Class Selection -->
      <div class="mb-6">
        <label class="text-gray-300">Select Class:</label>
        <select v-model="selectedClass" @change="fetchAssignments" class="input-field w-full">
          <option v-for="cls in classes" :key="cls._id" :value="cls._id">{{ cls.name }}</option>
        </select>
      </div>

      <!-- Assignment Selection -->
      <div v-if="selectedClass" class="mb-6">
        <label class="text-gray-300">Select Assignment:</label>
        <select v-model="selectedAssignment" @change="fetchSubmissions" class="input-field w-full">
          <option v-for="assignment in assignments" :key="assignment._id" :value="assignment._id">{{ assignment.title }}</option>
        </select>
      </div>

      <h2 v-if="selectedAssignment" class="text-xl font-semibold mb-4 text-gray-300">Previous Submissions</h2>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-400">Loading submissions...</div>
      
      <!-- Submissions List -->
      <ul v-else-if="submissions.length" class="space-y-4">
        <li 
          v-for="submission in submissions" 
          :key="submission._id" 
          class="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          <div>
            <strong class="text-white">{{ submission.studentName }}</strong>  
            <a :href="submission.fileUrl" target="_blank" class="text-blue-400 hover:underline ml-2">
              📄 View Submission
            </a>
          </div>

          <div class="flex items-center space-x-3">
            <button @click="giveSelfFeedback(submission)" class="btn btn-primary">📝 Self Feedback</button>
            <button @click="giveAIFeedback(submission)" class="btn btn-secondary">🤖 AI Feedback</button>
            <span v-if="submission.reviewed" class="badge-reviewed">✔ Reviewed</span>
          </div>
        </li>
      </ul>
      
      <!-- No Submissions Message -->
      <p v-else class="text-center text-gray-400">No submissions found for this assignment.</p>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return { 
      classes: [],
      selectedClass: '',
      assignments: [],
      selectedAssignment: '',
      submissions: [],
      loading: false
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
    async fetchAssignments() {
      if (!this.selectedClass) return;
      try {
        const response = await api.get(`/assignments/${this.selectedClass}`);
        this.assignments = response.data;
      } catch (error) {
        console.error('❌ Error fetching assignments:', error);
      }
    },
    async fetchSubmissions() {
      if (!this.selectedAssignment) return;
      this.loading = true;
      try {
        const response = await api.get(`/submissions/${this.selectedAssignment}`);
        this.submissions = response.data;
      } catch (error) {
        console.error('❌ Error fetching submissions:', error);
        alert('Failed to load submissions. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    giveSelfFeedback(submission) {
      const feedback = prompt("Enter your feedback:", submission.feedback || "");
      if (feedback !== null) {
        this.submitFeedback(submission._id, feedback);
      }
    },
    async giveAIFeedback(submission) {
      try {
        const response = await api.post(`/ai-feedback/${submission._id}`);
        this.submitFeedback(submission._id, response.data.feedback);
      } catch (error) {
        console.error('❌ Error generating AI feedback:', error);
        alert('AI feedback generation failed. Try again later.');
      }
    },
    async submitFeedback(submissionId, feedback) {
      try {
        await api.put(`/submissions/feedback/${submissionId}`, { feedback });
        this.submissions = this.submissions.map(sub => 
          sub._id === submissionId ? { ...sub, feedback, reviewed: true } : sub
        );
        alert('✅ Feedback submitted successfully!');
      } catch (error) {
        console.error('❌ Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
/* Buttons */
.btn {
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(to right, #3b82f6, #1e3a8a);
  color: white;
}

.btn-secondary {
  background: linear-gradient(to right, #9333ea, #5b21b6);
  color: white;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: scale(1.05);
}

/* Reviewed Badge */
.badge-reviewed {
  background-color: #16a34a;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  font-size: 0.85rem;
}
</style>
