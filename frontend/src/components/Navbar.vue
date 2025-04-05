<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import modal from "./modal.vue";

const router = useRouter();

const username = ref("Guest User");
const email = ref("guest@example.com");
const profilePicture = ref("https://randomuser.me/api/portraits/women/45.jpg");
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const showModal = ref(false);
const classCode = ref("");
const studentEmail = ref(""); 
const joinedClasses = ref([]);


const toggleDropDown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const logout = () => {
  alert("Logging out...");
};

const joinClass = async () => {
  if (!classCode.value.trim()) {
    alert("Please enter a class code.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/class/join-class", {
      classCode: classCode.value,
      studentEmail: studentEmail.value,
    });

    if (response.data) {
      alert("Class joined successfully!");
      joinedClasses.value.push(response.data.classData);
      console.log(joinedClasses.value);
      showModal.value = false; // Close modal after joining

      router.push({ name: 'JoinedSubjects' });
    }
  } catch (error) {
    console.log(error);
   alert(error.response?.data?.message || "Error joining class.");
  }
};
</script>

<template>
  <nav
    class="bg-black fixed w-full top-0 shadow-md py-4 px-6 flex justify-between items-center text-white z-50"
  >
    <!-- App Name -->
    <div class="flex items-center space-x-3">
      <h1 class="text-3xl font-bold tracking-wide neon-text">Studify</h1>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-6">
      <button
        @click="showModal = true;"
        class="relative px-6 py-2 text-white font-semibold rounded-lg transition-all bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:scale-105 hover:shadow-[0px_0px_15px_rgba(255,255,255,0.8)] before:absolute before:inset-0 before:bg-white before:opacity-10 before:rounded-lg before:blur-md overflow-hidden animate-pulse"
      >
        Join Class
      </button>

      <!-- Profile Dropdown -->
      <div class="relative">
        <button @click="toggleDropDown" class="flex items-center">
          <img
            :src="profilePicture"
            alt="Profile"
            class="w-10 h-10 rounded-full border border-gray-300 shadow-lg hover:shadow-[0px_0px_10px_rgba(255,255,255,0.6)]"
          />
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 space-y-2"
        >
          <div class="border-b border-gray-700 pb-2">
            <h2 class="text-lg font-semibold text-white">{{ username }}</h2>
            <p class="text-sm text-gray-400">{{ email }}</p>
          </div>

          <ul class="py-2">
            <li>
              <a
                href="#"
                class="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                >Profile</a
              >
            </li>
            <li>
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="toggleMobileMenu" class="md:hidden focus:outline-none">
      <svg
        class="w-8 h-8 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path v-if="!isMobileMenuOpen" d="M4 6h16M4 12h16m-7 6h7" />
        <path v-else d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Mobile Menu -->
    <div
      v-if="isMobileMenuOpen"
      class="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 shadow-lg md:hidden"
    >
      <button
        @click="isMobileMenuOpen = false; showModal = true"
        class="block w-full text-center py-2 mb-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-lg"
      >
        Join Class
      </button>

      <div class="border-b border-gray-700 pb-2 text-center">
        <h2 class="text-lg font-semibold">{{ username }}</h2>
        <p class="text-sm text-gray-400">{{ email }}</p>
      </div>

      <ul class="mt-4">
        <li>
          <a href="#" class="block px-4 py-2 text-gray-200 hover:bg-gray-700"
            >Profile</a
          >
        </li>
        <li>
          <button @click="logout" class="text-red-400 text-center w-full py-2">
            Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <!-- Modal -->
  <modal
      v-if="showModal"
      :isVisible="showModal"
      title="Join Class"
      @close="showModal = false"
      @confirm="joinClass"
    >
      <template #body>
        <input
          v-model="classCode"
          placeholder="Enter class code"
          class="input-field"
        />
        <input
          v-model="studentEmail"
          placeholder="Enter your gmail"
          class="input-field"
        />
      </template>
   </modal>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap");

.neon-text {
  font-family: "Orbitron", sans-serif;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff9900);
  background-clip: text; /* Standard */
  -webkit-background-clip: text; /* Webkit for Safari/Chrome */
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(255, 153, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.5);
  animation: glow 1.5s infinite alternate;
}

@keyframes glow {
  0% {
    text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(255, 153, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.5);
  }
  100% {
    text-shadow: 0 0 10px rgba(255, 0, 255, 1), 0 0 20px rgba(0, 255, 255, 1),
      0 0 30px rgba(255, 153, 0, 1), 0 0 50px rgba(255, 0, 255, 0.7);
  }
}

.bg-black {
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
}

.min-h-screen {
  min-height: 100vh;
}

/* Input Field */
.input-field {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  background: #2a2a3a;
  border: none;
  color: white;
  text-align: center;
  font-size: 1rem;
  outline: none;
  margin-bottom: 15px;
}
</style>