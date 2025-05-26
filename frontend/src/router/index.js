import { createRouter, createWebHistory } from 'vue-router';

// Import Components
import HomePage from '@/components/HomePage.vue';
import CreateClass from '@/components/CreateClass.vue';
import ClassList from '@/components/ClassList.vue';
import UploadAssignment from '@/components/UploadAssignment.vue';
import AssignmentsPage from '@/components/AssignmentsPage.vue';
//import FeedbackPage from '@/components/FeedbackPage.vue';
import StudentSubmissions from '@/components/StudentSubmissions.vue';
import LandingView from '@/views/LandingPage.vue';
import AddDetail from '@/views/AddDetail.vue';
import TeacherDashboard from '../views/teacher-dashboard.vue';
import StudentDashboard from '../views/Student-dashboard.vue';
import JoinedSubjectsView from '../views/JoinedSubjectsView.vue';
import AssignmentsByClass from '@/components/AssignmentsByClass.vue';
import profile from '../views/Profile.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/home', name: 'home', component: HomePage },
    { path: '/create', name: 'create', component: CreateClass },
    { path: '/classes', name: 'classes', component: CreateClass },
    { path: '/class-list', name: 'class-list', component: ClassList },
    { path: '/assignments/:classId', name: 'assignments', component: AssignmentsPage, props: true },
    { path: '/upload-assignment/:classId', name: 'upload-assignment', component: UploadAssignment, props: true },
   // { path: '/feedback/:submissionId', name: 'feedback', component: FeedbackPage, props: true },
    { path: '/submissions/:assignmentId', name: 'submissions', component: StudentSubmissions, props: true },
    { path: '/additional-details', name: 'signup', component: AddDetail },
    { path: '/student-dashboard', component: StudentDashboard, name: 'student-dashboard' },
    { path: '/teacher-dashboard', component: TeacherDashboard, name: 'teacher-dashboard' },
    { path: '/joined-subjects', name: 'JoinedSubjects', component: JoinedSubjectsView},
    { path: '/joined-subjects/assignments/:id', name: 'AssignmentsByClass', component: AssignmentsByClass},
    { path: '/profile', component: profile},
  ]
});

export default router;
