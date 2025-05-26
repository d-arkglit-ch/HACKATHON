<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const subjects = ref([]);

onMounted(async () => {
  const email = localStorage.getItem("studentEmail");
  if (email) {
    try {
      const response = await axios.get(
        `http://localhost:5001/class/joined-classes/${email}`
      );
      subjects.value = response.data; // Store and use this in your template
      console.log(subjects.value);
    } catch (error) {
      console.error("Failed to fetch joined classes", error);
    }
  } else {
    console.warn("Student email not found in localStorage");
  }
});

const getImageForSubject = (subjectName) => {
  const lower = subjectName.toLowerCase();
  if (lower.includes("data structures"))
    return "https://images.unsplash.com/photo-1664526936810-ec0856d31b92?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhdGElMjBzdHJ1Y3R1cmVzfGVufDB8fDB8fHww";
  if (lower.includes("operating"))
    return "https://images.unsplash.com/photo-1729786423717-07716ec501e9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8b3BlcmF0aW5nJTIwc3lzdGVtfGVufDB8fDB8fHww";
  if (lower.includes("database"))
    return "https://images.unsplash.com/photo-1648459776041-cbeab708f17b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRhdGFiYXNlfGVufDB8fDB8fHww";
  if (lower.includes("oops"))
    return "https://1.bp.blogspot.com/-46jbckEga8g/XaZ9iQ4KxTI/AAAAAAAAAHg/p1DE7ZSQ214U4dlDynfqB38gagRR9t3egCLcBGAsYHQ/w1200-h630-p-k-no-nu/new1.png";
  return "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaW5nfGVufDB8fDB8fHww";
};
</script> 

<template>
  <div class="p-6 pt-20 min-h-screen bg-black text-white">
    <h1
      class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400"
    >
      🌙 Learning isn’t a race — it’s the story of you, rediscovered
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <router-link
        v-for="subject in subjects"
        :key="subject._id"
        :to="`/joined-subjects/assignments/${subject._id}`"
        class="block"
      >
        <div
          class="bg-gradient-to-br from-[#141414] to-[#1e1e1e] border border-indigo-700/40 p-5 rounded-2xl shadow-[0_0_18px_#4f46e550] hover:shadow-[0_0_30px_#6d28d9aa] transition-all duration-300 cursor-pointer group"
        >
          <!-- Subject Image -->
          <div class="w-full h-36 rounded-xl mb-4 overflow-hidden">
            <img
              :src="getImageForSubject(subject.subject)"
              alt="Subject"
              class="w-full h-full object-cover rounded-xl border border-indigo-400/20"
            />
          </div>

          <!-- Subject Title -->
          <h2
            class="text-xl font-semibold text-indigo-300 group-hover:text-blue-300 transition duration-300"
          >
            {{ subject.subject.toUpperCase() }}
          </h2>
        </div>
      </router-link>
    </div>
  </div>
</template>
