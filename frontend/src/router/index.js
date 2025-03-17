import { createRouter, createWebHistory } from 'vue-router';
import landingView from '../views/LandingPage.vue';
import AddDetail from '@/views/AddDetail.vue';
import TeacherDashboard from '../views/teacher-dashboard.vue'
import StudentDashboard from '../views/Student-dashboard.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landingView,
    },

    {
      path:'/additional-details',
      name:'signup',
      component:AddDetail,
    }, 

    {
      path:"/student-dashboard",
      component:StudentDashboard,
      name:"student-dashboard",
    },

    {
      path:"/teacher-dashboard",
      component:TeacherDashboard,
      name:"teacher-dashboard",
    }
  ],
})

export default router;
