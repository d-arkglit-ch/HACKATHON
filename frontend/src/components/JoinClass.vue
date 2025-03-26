<script setup>
import { ref, defineProps, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  title: {
    type: String,
    default: "Join the Class",
  },
  steps: {
    type: Array,
    default: () => [
      "Download Class App",
      "Register with Details",
      "Search Class Code",
      "Join and Start Learning",
    ],
  },
});

const joinedClasses = ref([]);
const hasJoined = ref(false);

const fetchJoinedClasses = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/joined-classes");
    joinedClasses.value = response.data;
    hasJoined.value = joinedClasses.value.length > 0;
  } catch (error) {
    console.error("Error fetching joined classes:", error);
  }
};

onMounted(fetchJoinedClasses);
</script>

<template>
  <div class="mt-[10vh] h-full text-white flex flex-col items-center justify-center p-6 pt-6 md:pt-10 lg:pt-12 xl:pt-16">
    <h1 class="text-4xl font-bold mb-2">
      {{ props.title }}
    </h1>
    
    <div  v-if="!hasJoined" class="w-full max-w-3xl">
      <h2 class="text-xl font-semibold mb-4">How to Join</h2>
      <ul class="space-y-4">
        <li v-for="(step, index) in props.steps" :key="index" 
            class="flex items-center bg-gray-800 p-4 rounded-xl shadow-md">
          <span
            class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold mr-4"
          >
            {{ index + 1 }}
          </span>
          <p class="text-lg text-white">{{ step }}</p>
        </li>
      </ul>
    </div>

    <div v-else class="w-full max-w-3xl">
      <h2 class="text-xl font-semibold mb-4">Your Joined Classes</h2>
      <ul class="space-y-4">
        <li v-for="classItem in joinedClasses" :key="classItem._id" 
            class="flex items-center bg-gray-800 p-4 rounded-xl shadow-md">
          <span class="text-lg font-semibold">{{ classItem.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
@media (max-width: 1024px) {
  h1 {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  .w-full.max-w-3xl {
    max-width: 90%;
  }
  ul li {
    flex-direction: column;
    text-align: center;
  }
  ul li span {
    margin-bottom: 8px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  .w-full.max-w-3xl {
    max-width: 100%;
    padding: 1rem;
  }
}
</style>
