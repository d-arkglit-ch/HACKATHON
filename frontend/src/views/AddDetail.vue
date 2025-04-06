<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";


const route = useRoute();
const router = useRouter();
const googleId = ref(route.query.googleId || "");
const username = ref("");
const role = ref("");


const submitDetail = async () => {
  if (!username.value || !role.value) {
    alert("please enter detail");
    return;
  }

  try {
    const response = await fetch("http://localhost:5001/auth/set-role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleId: googleId.value,
        username: username.value,
        role: role.value,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Role & username updated", data);

      if (role.value === "Teacher") {
        router.push("/teacher-dashboard");
      } else {
        router.push("/student-dashboard");

      }
    } else {
      console.error("❌ Error:", data.error);
      alert(data.error);
    }
  } catch (error) {
    console.error("🚨 API Error:", error);
    alert("Something went wrong!")
  }


};


</script>



<template>
  <main class="h-screen w-screen flex justify-center items-center ">
    <video autoplay muted loop class="absolute top-0 left-0 w-full h-full object-cover">
      <source src="/a.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <div
      class="h-[70%]  w-[80%] sm:w-[40%] lg:h-[63%]  p-5 rounded-3xl border border-gray-500 backdrop-blur-lg bg-opacity-30 bg-white/10 ">

      <RouterLink to="/"
        class="absolute top-4 left-4 text-gray-400    hover:text-blue-400 transition flex items-center">
        <img src="/back.svg " class=" w-7 h-7 mr-5" alt="">
      </RouterLink>
      <h1 class="text-3xl font-bold text-center text-gray-300 mb-1">Add_Detail</h1>


      <form @submit.prevent="submitDetails" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="text-gray-300 text-sm font-medium">User Name</label>
          <input v-model="username" type="text" placeholder="Enter your name"
            class="w-full mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
        </div>
<!-- 
        Email 
        <div>
          <label class="text-gray-300 text-sm font-medium">Email Address</label>
          <input type="email" placeholder="Enter your email"
            class="w-full mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div> 

     Password
         <div>
          <label class="text-gray-300 text-sm font-medium">Password</label>
          <input type="password" placeholder="Create a password"
            class="w-full mt-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>
        <div> -->
        <div>
          <!--roles-->
          <label for="Role" class="text-gray-300 text-sm font-medium w-[20%]">Select Role</label>
          <select v-model="role" id="Role"
            class="m-1 w-[50%] rounded-lg p-3 bg-gray-800 text-gray-400 border border-gray-700 "
            placeholder="Select Role">
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button type="submit" @click="submitDetail"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
          submit
        </button>
      </form>
      <!-- OR Divider
      <div class="flex items-center justify-center my-4">
        <div class="w-1/3 h-[1px] bg-gray-700"></div>
        <span class="text-gray-400 text-sm mx-3">OR</span>
        <div class="w-1/3 h-[1px] bg-gray-700"></div>
      </div> -->

      <!-- Google Sign-Up Button (Non-functional for now)
      <button
        class="w-full flex items-center justify-center bg-gray-800 text-white font-semibold py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition">
        <img src="https://www.svgrepo.com/show/355037/google.svg" class="w-5 h-5 mr-2" alt="Google Logo">
        Sign Up with Google
      </button>
 -->



      <!-- <p class="text-gray-400 text-center mt-4 text-sm">
        Already have an account?
        <RouterLink to="/login" class="text-blue-400 hover:text-blue-500">Log in</RouterLink>
      </p> -->
    </div>

  </main>

</template>