<script setup>
const dummySubjects = [
  {
    _id: "1",
    subject: "Data Structures",
    teacher: "Prof. Anjali Sharma",
    semester: "Semester 4",
  },
  {
    _id: "2",
    subject: "Operating Systems",
    teacher: "Dr. Manish Verma",
    semester: "Semester 4",
  },
  {
    _id: "3",
    subject: "Database Management",
    teacher: "Ms. Ritu Chauhan",
    semester: "Semester 4",
  },
];

const getImageForSubject = (subjectName) => {
  const lower = subjectName.toLowerCase();
  if (lower.includes("data structures")) return "https://images.unsplash.com/photo-1664526936810-ec0856d31b92?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRhdGElMjBzdHJ1Y3R1cmVzfGVufDB8fDB8fHww";
  if (lower.includes("operating")) return "https://images.unsplash.com/photo-1729786423717-07716ec501e9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8b3BlcmF0aW5nJTIwc3lzdGVtfGVufDB8fDB8fHww";
  if (lower.includes("database")) return "https://images.unsplash.com/photo-1648459776041-cbeab708f17b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRhdGFiYXNlfGVufDB8fDB8fHww";
  return "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaW5nfGVufDB8fDB8fHww";
};
</script>

<template>
  <div class="p-6 min-h-screen bg-black text-white">
    <h1
      class="text-4xl font-semibold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400"
    >
      🌙 Learning isn’t a race — it’s the story of you, rediscovered
    </h1>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div
        v-for="subject in dummySubjects"
        :key="subject._id"
        class="bg-gradient-to-br from-[#141414] to-[#1e1e1e] border border-indigo-700/40 p-5 rounded-2xl shadow-[0_0_18px_#4f46e550] hover:shadow-[0_0_30px_#6d28d9aa] transition-all duration-300 cursor-pointer group"
      >
        <!-- Image Placeholder (for future use) -->
        <div
          class="w-full h-36 bg-[#101010] rounded-xl mb-4 flex items-center justify-center text-indigo-400 font-medium group-hover:text-blue-400 transition-all duration-300"
        >
          <img
            :src="getImageForSubject(subject.subject)"
            alt="Subject"
            class="w-full h-36 object-cover rounded-xl mb-4 border border-indigo-400/20"
          />
        </div>

        <!-- Subject Info -->
        <h2
          class="text-xl font-semibold text-indigo-300 group-hover:text-blue-300 transition duration-300"
        >
          {{ subject.subject }}
        </h2>
        <p class="text-sm text-gray-400 mt-1"> {{ subject.teacher }}</p>
        <p class="text-sm text-gray-500 mt-1">
          📘 Semester: {{ subject.semester }}
        </p>
      </div>
    </div>
  </div>
</template>
