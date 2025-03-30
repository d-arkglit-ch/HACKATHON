import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/user", { withCredentials: true });
      user.value = res.data;
    } catch (error) {
      console.error("Error fetching user", error);
    }
  };

  return { user, fetchUser };
});
