<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
// import axios from 'axios';

// const route = useRoute();
// const classId = route.params.classId;

// const assignments = ref([]);

// onMounted(async () => {
//   try {
//     const res = await axios.get(`http://localhost:5000/class/${classId}`);
//     assignments.value = res.data.assignments;
//   } catch (err) {
//     console.error("Error fetching assignments", err);
//   }
// });

const assignments = ref([]);

const dummyAssignments = [
  {
    _id: "1",
    title: "DBMS Assignment 1",
    description: "Write SQL queries for normalization examples.",
    dueDate: "2025-04-10T23:59:59Z",
  },
  {
    _id: "2",
    title: "OS Assignment 2",
    description: "Explain process scheduling algorithms with examples.",
    dueDate: "2025-04-14T23:59:59Z",
  },
  {
    _id: "3",
    title: "AI Assignment",
    description: "Submit research on AI applications in disaster response.",
    dueDate: "2025-04-20T23:59:59Z",
  },
];

onMounted(() => {
  assignments.value = dummyAssignments;
});
</script>

<template>
  <div class="p-6 pt-20 text-white">
    <h1 class="text-3xl font-bold mb-6">Assignments</h1>
    <div v-if="assignments.length">
      <div
        v-for="a in assignments"
        :key="a._id"
        class="bg-gray-800 p-4 rounded-lg mb-4"
      >
        <h2 class="text-xl font-semibold">{{ a.title }}</h2>
        <p class="text-sm text-gray-300">{{ a.description }}</p>
        <p class="text-sm text-gray-400 mt-1">
          Due: {{ new Date(a.dueDate).toLocaleDateString() }}
        </p>
        <div class="mt-4 flex gap-4">
          <router-link
            :to="`/assignment/${a._id}`"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Show Assignment
          </router-link>

          <router-link
            :to="`/assignment/${a._id}/submit`"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Submit Assignment
          </router-link>
        </div>
      </div>
    </div>
    <p v-else>No assignments found.</p>
  </div>
</template>
