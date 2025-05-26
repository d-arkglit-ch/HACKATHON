
<script setup>
import{ ref,  onMounted} from 'vue'
import axios from 'axios';
import {useRouter} from 'vue-router';
const user =ref(null);
const router = useRouter();



const fetchProfile = async()=>{
  try{
    const{data}=await axios.get("http://localhost:5001/auth/profile" , {withCredentials:true,});
    console.log("🔍 Profile Data:", data);

    user.value=data;
  }catch(error){
    console.error("failed to fetch data", error);

        // Debugging - check the actual error response
        if (error.response) {
      console.log("🔍 Error Response:", error.response.data);
    }
    router.push("/"); // 🔹 Redirect to login if unauthorized

  }
};


const logout=async()=>{
try{
  await axios.post("http://localhost:5001/auth/logout" , {} ,{withCredentials:true,});
  router.push("/");
}catch(error){
  console.error("failed to logout", error);
}
};

const goBack = () => {
  if (user.value?.role === "Teacher") {
    router.push("/teacher-dashboard");
  } else if (user.value?.role === "Student") {
    router.push("/student-dashboard");
  } else {
    router.push("/"); // Default route
  }
};




onMounted(fetchProfile);
</script>


<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center justify-center p-4 sm:p-6"
  >
    <h1 class="text-2xl sm:text-3xl font-bold tracking-wide neon-text mb-6">Profile</h1>

    <div v-if="user" class="profile-card space-y-6 animate-fade-in">
      <div class="flex justify-between items-center w-full">
        <button @click="goBack" class="back-btn">
          <svg
            class="w-8 h-8 sm:w-10 sm:h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div class="profile-image-container">
        <div
          class="profile-image bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 animate-pulse-neon"
        >
          <img
                src="/user.png" alt="User Profile"

            class="profile-img"
          />
        </div>
        
      </div>

      <div class="info-grid">
        <div class="info-item neon-info">
          <span class="label">Name:</span>
          <span class="value">{{ user.username }}</span>
        </div>
        <div class="info-item neon-info">
          <span class="label">Role:</span>
          <span class="value">{{ user.role }}</span>
        </div>
        <div class="info-item neon-info">
          <span class="label">Email:</span>
          <span class="value">{{ user.email }}</span>
        </div>
      </div>

      <button @click="logout" class="logout-btn neon-button">Logout</button>
    </div>

    <div v-else class="flex items-center gap-2 text-gray-300 text-lg">
      <svg class="animate-spin h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Loading...
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay" @click="cancelUpload">
      <div class="modal-content" @click.stop>
        <h2 class="text-lg font-bold neon-text mb-4">Is this picture correct?</h2>
        <img v-if="previewImage" :src="previewImage" alt="Preview" class="preview-img" />
        <div class="modal-buttons">
          <button v-if="isUploading" disabled class="confirm-btn neon-button">
            <svg class="animate-spin h-5 w-5 inline" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            Uploading...
          </button>
          <button v-else @click="confirmUpload" class="confirm-btn neon-button">Yes</button>
          <button @click="cancelUpload" class="cancel-btn neon-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Neon Text */
.neon-text {
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff9900);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(255, 153, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.5);
  animation: glow 1.5s infinite alternate;
}

/* Profile Card */
.profile-card {
  background: rgba(17, 24, 39, 0.9);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.2);
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1rem;
  padding: 2px;
  background: linear-gradient(45deg, #ff00ff, #00ffff, #ff9900);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
}

/* Profile Image */
.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.profile-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 320px;
  width: 90%;
  text-align: center;
  border: 1px solid rgba(0, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-btn {
  background: linear-gradient(90deg, #00ff99, #00ffff);
}

.cancel-btn {
  background: linear-gradient(90deg, #ff0066, #ff9900);
}

/* Buttons */
.neon-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(to right, #6366f1, #ec4899);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
}

.neon-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(255, 0, 255, 0.5);
}

.neon-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.neon-button:hover::before {
  left: 100%;
}

.edit-btn {
  background: linear-gradient(90deg, #00ffff, #ff00ff);
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
}

.back-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

/* Info Grid */
.info-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  background: #1f2937;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.label {
  font-weight: 600;
  color: #a5b4fc;
}

.value {
  color: #f9fafb;
  font-size: 0.9rem;
}

/* Animations */
@keyframes glow {
  from {
    text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
      0 0 20px rgba(255, 153, 0, 0.8);
  }
  to {
    text-shadow: 0 0 10px rgba(255, 0, 255, 1), 0 0 20px rgba(0, 255, 255, 1),
      0 0 30px rgba(255, 153, 0, 1);
  }
}

@keyframes pulse-neon {
  0% {
    box-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8);
  }
  50% {
    box-shadow: 0 0 10px rgba(255, 0, 255, 1), 0 0 20px rgba(0, 255, 255, 1);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

.animate-pulse-neon {
  animation: pulse-neon 2s infinite;
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .profile-card {
    padding: 1rem;
    max-width: 300px;
  }

  .profile-image {
    width: 60px;
    height: 60px;
  }

  .edit-btn {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }

  .info-item {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .modal-content {
    padding: 1rem;
    max-width: 260px;
  }

  .preview-img {
    max-height: 150px;
  }
}
</style>