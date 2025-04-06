
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
  <div class="min-h-screen flex items-center justify-center p-6 bg-gradient">
    <div v-if="user" class="profile-container">
      <h1 class="neon-text">Profile</h1>

      <button @click="goBack" class="back-btn"><img src="/back1.png" class="h-[40px] w-[40px]" alt=""></button>

      <!-- Profile Image -->
      <div class="profile-pic   bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500">
        <img class="scale-150" src="/user.png" alt="User Profile">
      </div>

      <!-- User Details -->
      <div class="user-info">
        <div class="info-item"><p class="label">Name:</p> <p class="value">{{ user.username }}</p></div>
        <div class="info-item"><p class="label">Role:</p> <p class="value">{{ user.role }}</p></div>
        <div class="info-item"><p class="label">Email: </p> <p class="value">{{ user.email }}</p></div>
      </div>

    

      <!-- Logout Button -->
      <button @click="logout" class="logout-btn">Logout</button>
    </div>

    <p v-else class="loading-text">Loading...</p>
  </div>
</template>

<style scoped>
/* 🌌 Dark Gradient Background */
.bg-gradient {
  background: linear-gradient(135deg, #08060a, #020102, #0e1516);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🧊 Frosted Glass Profile Container */
.profile-container {
  max-width: 500px;
  width: 90%;
  background: rgba(70, 66, 66, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 6px 12px rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 🏷️ Neon Text */
.neon-text {
  font-family: "Orbitron", sans-serif;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff9900);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.8), 0 0 10px rgba(0, 255, 255, 0.8),
               0 0 20px rgba(255, 153, 0, 0.8), 0 0 40px rgba(255, 0, 255, 0.5);
  font-size: 22px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 15px;
  opacity: 0.8;
}

/* 👤 Profile Image */
.profile-pic {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  margin-bottom: 20px;
}
.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 📌 User Info */
.user-info {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-size: 24px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}
.value {
  font-size: 20px;
  /* font-weight: bold; */
  color: white;
}

/* 🔘 Logout Button */
.logout-btn {
  background: white;
  color: black;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: 0.3s ease;
}
.logout-btn:hover {
  background: rgb(200, 200, 200);
  transform: scale(1.05);
}

/* ⏳ Loading Text */
.loading-text {
  color: white;
  font-size: 16px;
}

/* 📱 Responsive Design */
@media (max-width: 600px) {
  .profile-container {
    padding: 15px;
  }
  .neon-text {
    font-size: 18px;
  }
  .label, .value {
    font-size: 16px;
  }
}



.back-btn {
  background: #00000000;
  color: white;
  font-weight: bold;
  /* padding: 10px 20px; */
  border: none;
  border-radius: 8px;
  margin-top: 1px;
  cursor: pointer;
  transition: 0.3s ease;
  position: absolute;
  top: 10px;
  right: 15px;
  border-radius: 50%;

  
}
.back-btn:hover {
  background: #3a3a3a;
  transform: scale(1.25);
}
</style>
