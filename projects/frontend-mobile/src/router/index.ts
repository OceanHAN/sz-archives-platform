import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/booking-landing',
      name: 'booking-landing',
      component: () => import('../views/BookingLandingView.vue')
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../views/BookingView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('../views/GuideView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    },
    {
      path: '/course-booking',
      name: 'course-booking',
      component: () => import('../views/CourseBookingView.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue')
    },
    {
      path: '/news-detail/:id',
      name: 'news-detail',
      component: () => import('../views/NewsDetailView.vue')
    },
    {
      path: '/exhibition-list',
      name: 'exhibition-list',
      component: () => import('../views/ExhibitionListView.vue')
    },
    {
      path: '/course-list',
      name: 'course-list',
      component: () => import('../views/CourseListView.vue')
    },
    {
      path: '/exhibition-detail/:id',
      name: 'exhibition-detail',
      component: () => import('../views/ExhibitionDetailView.vue')
    },
    {
      path: '/map-view',
      name: 'map-view',
      component: () => import('../views/MapView.vue')
    },
    {
      path: '/archive-detail/:id',
      name: 'archive-detail',
      component: () => import('../views/ArchiveDetailView.vue')
    },
    {
      path: '/my-appointments',
      name: 'my-appointments',
      component: () => import('../views/MyAppointmentsView.vue')
    },
    {
      path: '/course-player/:id',
      name: 'course-player',
      component: () => import('../views/CoursePlayerView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
