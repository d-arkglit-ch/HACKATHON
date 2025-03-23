<template>
  <div class="min-h-screen bg-black text-gray-300 flex items-center justify-center p-6">
    <div class="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
      <h1 class="text-3xl font-bold text-center mb-6 text-blue-400">Provide Feedback</h1>

      <!-- Feedback Form -->
      <form @submit.prevent="giveFeedback" class="space-y-4">
        <textarea 
          v-model="feedback" 
          placeholder="Write feedback..." 
          required 
          class="input-field h-32"
        ></textarea>

        <input 
          v-model="grade" 
          type="text" 
          placeholder="Grade (e.g., A, B+)" 
          required 
          class="input-field"
        />

        <button type="submit" class="btn-primary w-full">Submit Feedback</button>
      </form>

      <!-- Confirmation Message -->
      <transition name="fade">
        <p v-if="submitted" class="text-green-400 text-center mt-4">
          ✅ Feedback submitted successfully!
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  props: ['submissionId'],
  data() {
    return { feedback: '', grade: '', submitted: false };
  },
  methods: {
    async giveFeedback() {
      try {
        await api.post(`/submissions/${this.submissionId}/feedback`, {
          feedback: this.feedback,
          grade: this.grade
        });
        this.submitted = true; // Show confirmation message
        this.feedback = ''; // Clear input
        this.grade = '';
        setTimeout(() => (this.submitted = false), 3000); // Hide message after 3 seconds
      } catch (error) {
        console.error('❌ Error submitting feedback:', error);
        alert('❌ Failed to submit feedback. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
/* Input Fields */
.input-field {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 8px rgba(79, 70, 229, 0.5);
}

/* Primary Button */
.btn-primary {
  background: linear-gradient(to right, #4f46e5, #6d28d9);
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(to right, #4338ca, #5b21b6);
  transform: scale(1.03);
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
