<template>
  <div class="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center p-6">
    <div class="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center mb-6 text-blue-400">Assignment Submissions</h1>

      <h2 class="text-xl font-semibold mb-4 text-gray-300">Previous Submissions</h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-gray-400">Loading submissions...</div>

      <!-- Submissions List -->
      <ul v-else-if="submissions.length" class="space-y-4">
        <li 
          v-for="submission in submissions" 
          :key="submission._id" 
          class="bg-gray-700 p-4 rounded-lg flex justify-between items-center shadow-md hover:bg-gray-600 transition"
        >
          <div>
            <strong class="text-white">{{ submission.studentName }}</strong>  
            <a :href="submission.fileUrl" target="_blank" class="text-blue-400 hover:underline ml-2">
              📄 View Submission
            </a>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              v-if="!submission.reviewed" 
              @click="markReviewed(submission._id)" 
              class="btn btn-success"
            >
              ✅ Mark as Reviewed
            </button>
            <span v-else class="badge-reviewed">✔ Reviewed</span>
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
  props: ['assignmentId'],
  data() {
    return { 
      submissions: [],
      loading: true 
    };
  },
  async created() {
    await this.fetchSubmissions();
  },
  methods: {
    async fetchSubmissions() {
      try {
        const response = await api.get(`/submissions/${this.assignmentId}`);
        this.submissions = response.data;
      } catch (error) {
        console.error('❌ Error fetching submissions:', error);
        alert('Failed to load submissions. Please try again.');
      } finally {
        this.loading = false;
      }
    },
    async markReviewed(submissionId) {
      try {
        await api.put(`/submissions/review/${submissionId}`);
        this.submissions = this.submissions.map(submission => 
          submission._id === submissionId ? { ...submission, reviewed: true } : submission
        );
        alert('✅ Submission marked as reviewed!');
      } catch (error) {
        console.error('❌ Error marking submission as reviewed:', error);
        alert('Failed to mark as reviewed. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
/* Buttons */
.btn {
  padding: 8px 16px;
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

.btn-success {
  background: linear-gradient(to right, #059669, #065f46);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(to right, #047857, #064e3b);
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

/* Submission List Item */
.bg-gray-700 {
  transition: background 0.3s, transform 0.2s ease-in-out;
}

.bg-gray-700:hover {
  background: #4b5563;
  transform: scale(1.02);
}
</style>
