<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const assignments = ref([]);
const subjectName = ref("");
const selectedFiles = ref({});
const submittedStatus = ref({});

onMounted(async () => {
  const classId = route.params.id;
  try {
    const res = await axios.get(`http://localhost:5001/class/${classId}`);
    assignments.value = res.data.assignments;
    subjectName.value = res.data.subject; // updated from subjectName
  } catch (err) {
    console.error("Failed to fetch assignments", err);
  }
});

function handleFileChange(event, assignmentId) {
  selectedFiles.value[assignmentId] = event.target.files[0];
}

async function submitAssignment(assignmentId) {
  const file = selectedFiles.value[assignmentId];
  if (!file) return alert("Please select a file.");

  const formData = new FormData();
  formData.append("pdf", file);
  formData.append("assignmentId", assignmentId);
  const studentEmail = localStorage.getItem("studentEmail"); // or however you're storing it
  formData.append("studentEmail", studentEmail);

  try {
    await axios.post("http://localhost:5001/class/submit-assignment", formData);
    alert("Assignment submitted successfully");

    selectedFiles.value[assignmentId] = null;
    submittedStatus.value[assignmentId] = true;
  } catch (err) {
    console.error("Submission error", err);
    alert("Failed to submit assignment");
  }
}
</script>

<template>
  <div class="p-6 pt-20 min-h-screen bg-black text-white">
    <h1
      class="text-5xl font-bold mb-8 text-center w-full bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-400 to-pink-300 text-transparent bg-clip-text"
    >
      Assignments for {{ subjectName }}
    </h1>

    <div v-if="assignments.length" class="space-y-6">
      <div
        v-for="assignment in assignments"
        :key="assignment._id"
        class="border border-indigo-600/30 bg-[#111] p-5 rounded-xl shadow-[0_0_12px_#6366f1aa] hover:shadow-[0_0_20px_#8b5cf6cc] transition-all"
      >
        <h2 class="text-xl font-semibold text-indigo-300">
          {{ assignment.title }}
        </h2>
        <p class="text-sm text-gray-400 mt-1">{{ assignment.description }}</p>
        <p class="text-xs mt-2 text-pink-300">
          Due: {{ new Date(assignment.dueDate).toLocaleDateString() }}
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-4">
          <label
            class="px-4 py-2 cursor-pointer"
            :class="[
              submittedStatus[assignment._id]
                ? 'bg-green-700 hover:bg-green-800'
                : 'bg-indigo-600 hover:bg-indigo-700',
              'text-white rounded-lg transition',
            ]"
          >
            Choose PDF
            <input
              type="file"
              @change="(e) => handleFileChange(e, assignment._id)"
              accept="application/pdf"
              class="hidden"
            />
          </label>

          <button
            @click="submitAssignment(assignment._id)"
            :class="
              submittedStatus[assignment._id]
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-indigo-700 hover:bg-indigo-800'
            "
            class="px-4 py-2 text-white rounded-lg"
          >
            {{ submittedStatus[assignment._id] ? "Re-submit" : "Submit PDF" }}
          </button>

          <span
            class="text-sm text-gray-300"
            v-if="selectedFiles[assignment._id]"
          >
            {{ selectedFiles[assignment._id].name }}
          </span>

          <span
            class="ml-2 text-green-400 text-sm"
            v-if="submittedStatus[assignment._id]"
          >
            ✅ Submitted
          </span>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-400 text-center mt-10">
      No assignments uploaded yet 📭
    </div>
  </div>
</template>
