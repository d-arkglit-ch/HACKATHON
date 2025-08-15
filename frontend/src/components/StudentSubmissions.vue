<script setup>
import AppNavbar from '@/components/AppNavbar.vue';
import { ref, onMounted } from 'vue';
import api from '@/api';



const classes = ref([]);
const selectedClass = ref('');
const assignments = ref([]);
const selectedAssignment = ref('');
const submissions = ref([]);
const loading = ref(false);

const fetchClasses = async () => {
  try {
    const res = await api.get('/classes');
    classes.value = res.data;
  } catch (err) {
    console.error('❌ Error fetching classes:', err);
  }
};


const analyzingSubmissionId = ref(null);

const analyzeSubmission = async (submissionId, index) => {
  try {
    analyzingSubmissionId.value = submissionId;
    const res = await api.post(`/submissions/${submissionId}/analyze`,null,{timeout:60000});
    const summary = res.data?.summary || '⚠ No AI summary returned';
     const marks = res.data?.marks || '⚠ No marks returned';
    submissions.value[index].feedbackText = summary;
    submissions.value[index].marks = marks;
    alert('✅ AI analysis complete. You can now edit the feedback.');
  } catch (err) {
    console.error('❌ Error analyzing submission:', err);
    alert('❌ Failed to analyze with AI');
  } finally {
    analyzingSubmissionId.value = null;
  }
};


const fetchAssignments = async () => {
  try {
    const res = await api.get(`/assignments/${selectedClass.value}`);
    if (Array.isArray(res.data)) {
      assignments.value = res.data;
    } else if (res.data?.newAssignments) {
      assignments.value = [...res.data.newAssignments, ...res.data.oldAssignments];
    } else {
      assignments.value = [];
    }
  } catch (err) {
    console.error('❌ Error fetching assignments:', err);
  }
};
 
const fetchSubmissions = async () => {
  console.log('Fetching submissions for assignment:', selectedAssignment.value);
  try {
    loading.value = true;
    console.log("Step1");
    const res = await api.get(`/submissions/${selectedAssignment.value}`);
    console.log("step2", res.data);
    submissions.value = res.data.map((sub) => ({
      _id: sub._id,
      studentName: sub.studentId ? 'Unknown' : 'Unknown', // Adjust based on studentId population
      reviewed: sub.feedbacks?.length > 0,
      fileUrl: `${import.meta.env.VITE_BACKEND_URL}/api/submissions/${sub._id}/file`,
      feedbackText: ''
    }));
  } catch (err) {
    console.error('❌ Error fetching submissions:', err);
    submissions.value = [];
  } finally {
    console.log("step3");
    console.log("Submissions fetched:", submissions.value);
    loading.value = false;
  }
};
const openPDF = (url) => {
  console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);
  console.log("Opening PDF with URL:", url);
  if (!url) return alert("❌ No file found for this submission");
  window.open(url, '_blank');
};

const submitFeedback = async (submissionId, feedbackText,marks , index) => {
    try {
 

    const res = await api.post(`/submissions/${submissionId}/feedback`, {
      feedbackText,
      score: marks,
      
    });
    submissions.value[index].reviewed = true;
    alert('✅ Feedback submitted');
  } catch (err) {
    console.error('❌ Error submitting feedback:', err);
    alert('❌ Failed to submit feedback');
  }
};

onMounted(() => {
  fetchClasses();
});
</script>

<template>
  <AppNavbar />

  <div class="min-h-screen bg-gray-900 text-white p-6">
    <div class="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold mb-6 text-blue-400 text-center">Assignment Submissions</h1>

      <div class="mb-4">
        <label>Select Class:</label>
        <select v-model="selectedClass" @change="fetchAssignments" class="w-full p-2 rounded">
          <option disabled value="">-- Choose Class --</option>
          <option v-for="cls in classes" :key="cls._id" :value="cls._id">{{ cls.name }}</option>
        </select>
      </div>

      <div class="mb-4" v-if="selectedClass">
        <label>Select Assignment:</label>
        <select v-model="selectedAssignment" @change="fetchSubmissions" class="w-full p-2 rounded">
          <option disabled value="">-- Choose Assignment --</option>
          <option v-for="a in assignments || []" :key="a._id" :value="a._id">{{ a.title }}</option>
        </select>
      </div>

      <div v-if="loading" class="text-center text-gray-400">Loading submissions...</div>

      <ul v-else-if="submissions.length" class="space-y-6">
        <li
          v-for="(sub, index) in submissions"
          :key="sub._id"
          class="bg-gray-700 p-4 rounded shadow hover:bg-gray-600 transition"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">📄 View Assignment</span>
            <button
              @click="openPDF(sub.fileUrl)"
              class="text-blue-400 underline hover:text-blue-300"
            >Open</button>
          </div>

          <div class="mb-2">
            <span v-if="sub.reviewed" class="text-green-400 font-semibold">✔ Reviewed</span>
            <span v-else class="text-yellow-300">⏳ Pending</span>
          </div>

       <div class="mt-3">
  <button
    class="btn btn-secondary bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white"
    @click="analyzeSubmission(sub._id, index)"
    :disabled="analyzingSubmissionId === sub._id"
  >
    <span v-if="analyzingSubmissionId === sub._id">⏳ Analyzing...</span>
    <span v-else>🤖 Analyze with AI</span>
  </button>
</div>

<div class="mt-2">
  <textarea
    v-model="sub.feedbackText"
    class="w-full p-2 rounded bg-gray-600 text-white mt-2"
    placeholder="Write feedback..."
    rows="2"
  ></textarea>
  <div v-if="sub.marks" class="text-sm text-gray-400 mt-1">Marks: {{ sub.marks }}</div>
  <button
    @click="submitFeedback(sub._id, sub.feedbackText, sub.marks, index)"
    class="mt-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
  >Submit Feedback</button>
</div>
        </li>
      </ul>

      <p v-else class="text-center text-gray-400">No submissions found for this assignment.</p>
    </div>
  </div>
</template>

<style scoped>
select {
  background-color: #1f2937;
  color: white;
  border: 1px solid #4b5563;
}
option {
  background-color: #1f2937;
}
</style>
