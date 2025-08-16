import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/', name: 'home', component: LoginView },
    { path: '/admin', name: 'admin', component: LoginView },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta?.public && !auth.isAuthenticated) return { name: 'login' }
})

export default router
