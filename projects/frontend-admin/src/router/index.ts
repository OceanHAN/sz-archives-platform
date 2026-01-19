import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layout/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue')
        },
        {
          path: 'archives',
          name: 'archives',
          component: () => import('../views/ArchiveList.vue')
        },
        {
          path: 'exhibitions',
          name: 'exhibitions',
          component: () => import('../views/ExhibitionList.vue')
        },
        {
          path: 'appointments',
          name: 'appointments',
          component: () => import('../views/AppointmentList.vue')
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('../views/CourseList.vue')
        },
        {
          path: 'venues',
          name: 'venues',
          component: () => import('../views/VenueList.vue')
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('../views/NewsList.vue')
        },
        {
          path: 'landmarks',
          name: 'landmarks',
          component: () => import('../views/LandmarkList.vue')
        }
      ]
    }
  ]
});

export default router;