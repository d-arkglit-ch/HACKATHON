<template>
    <div class="min-h-screen bg-gray-900 text-gray-300 flex items-center justify-center p-6">
      <div class="w-full max-w-3xl bg-gray-800 p-8 rounded-lg shadow-xl">
        <h1 class="text-4xl font-bold text-center mb-6 text-blue-400">All Classes</h1>
  
        <!-- Create & Refresh Section -->
        <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input v-model="newClassName" type="text" placeholder="Enter class name..." class="input-field" />
          <button @click="createClass" class="btn btn-primary">+ Create Class</button>
          <button @click="refreshClasses" class="btn btn-success">🔄 Refresh</button>
        </div>
  
        <!-- Class List -->
        <div v-if="classes.length" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            v-for="classItem in classes"
            :key="classItem.code"
            class="bg-gray-700 p-6 rounded-lg shadow-md hover:bg-gray-600 transition transform hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <router-link :to="'/assignments/' + classItem._id" class="text-white font-semibold text-xl hover:underline capitalize block mb-2">
                {{ classItem.name }}
              </router-link>
              <p class="text-sm text-gray-400">Code: <span class="text-blue-400 font-semibold">{{ classItem.code }}</span></p>
            </div>
            <div class="flex items-center justify-between mt-4">
              <button @click="copyClassCode(classItem.code)" class="btn btn-warning">📋 Copy Code</button>
              <button @click="deleteClass(classItem._id)" class="btn btn-danger">🗑 Delete</button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-400">No classes found.</div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../../../../classroom-system/src/api';
  
  export default {
    data() {
      return { 
        classes: [],
        newClassName: ''
      };
    },
    async created() {
      await this.fetchClasses();
    },
    methods: {
      async fetchClasses() {
        try {
          const response = await api.get('/classes');
          this.classes = response.data;
        } catch (error) {
          console.error('❌ Error fetching classes:', error);
        }
      },
      async createClass() {
        if (!this.newClassName.trim()) {
          alert("❌ Class name cannot be empty!");
          return;
        }
  
        try {
          const response = await api.post('/classes', { name: this.newClassName });
          response.data.name = response.data.name.charAt(0).toUpperCase() + response.data.name.slice(1); // Capitalize first letter
          this.classes.push(response.data);
          this.newClassName = "";
          alert("✅ Class created successfully!");
        } catch (error) {
          console.error('❌ Error creating class:', error);
          alert('❌ Failed to create class.');
        }
      },
      async deleteClass(classId) {
        if (!confirm('Are you sure you want to delete this class?')) return;
        try {
          await api.delete(`/classes/${classId}`);
          this.classes = this.classes.filter(cls => cls._id !== classId);
          alert('✅ Class deleted successfully!');
        } catch (error) {
          console.error('❌ Error deleting class:', error);
          alert('❌ Failed to delete class.');
        }
      },
      copyClassCode(code) {
        navigator.clipboard.writeText(code);
        alert('✅ Class code copied to clipboard!');
      },
      async refreshClasses() {
        await this.fetchClasses();
      }
    }
  };
  </script>
  
  <style scoped>
  /* Input Field */
  .input-field {
    padding: 0.75rem;
    border-radius: 10px;
    background-color: #2d3748;
    color: white;
    border: 1px solid #4a5568;
    outline: none;
    transition: border-color 0.3s ease;
  }
  
  .input-field:focus {
    border-color: #63b3ed;
    box-shadow: 0px 0px 8px rgba(99, 179, 237, 0.7);
  }
  
  /* Button Base */
  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Button Hover & Active Effects */
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  .btn:active {
    transform: translateY(0px);
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  /* Primary Button */
  .btn-primary {
    background: linear-gradient(to right, #4f46e5, #6d28d9);
    color: white;
  }
  
  .btn-primary:hover {
    background: linear-gradient(to right, #4338ca, #5b21b6);
  }
  
  /* Success Button */
  .btn-success {
    background: linear-gradient(to right, #059669, #065f46);
    color: white;
  }
  
  .btn-success:hover {
    background: linear-gradient(to right, #047857, #064e3b);
  }
  
  /* Warning Button */
  .btn-warning {
    background: linear-gradient(to right, #d97706, #b45309);
    color: white;
  }
  
  .btn-warning:hover {
    background: linear-gradient(to right, #c2410c, #9a3412);
  }
  
  /* Danger Button */
  .btn-danger {
    background: linear-gradient(to right, #dc2626, #b91c1c);
    color: white;
  }
  
  .btn-danger:hover {
    background: linear-gradient(to right, #b91c1c, #991b1b);
  }
  </style>
  