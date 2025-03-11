import { createRouter, createWebHistory } from 'vue-router';
import loginview from '../views/LoginPage.vue';
import landingView from '../views/LandingPage.vue';
import SignupPage from '@/views/SignupPage.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: landingView,
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component:loginview,
    },
    {
      path:'/signup',
      name:'signup',
      component:SignupPage,
    }
  ],
})

export default router;
