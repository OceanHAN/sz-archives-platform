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
        }
      ]
    }
  ]
});

export default router;