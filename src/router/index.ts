import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/auth/LoginView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import ListProductsView from '@/views/admin/ListProductsView.vue'
import EditProductView from '@/views/admin/EditProductView.vue'
import ProductFormView from '@/views/admin/ProductFormView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
    { path: '/', name: 'home', component: LoginView },

    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', name: 'admin-dashboard', component: DashboardView },
        { path: 'produtos', children: [
          { path: '', component: ListProductsView },
          { path: 'novo', component: ProductFormView },
          { path: ':id/editar', component: ProductFormView }
        ]}
      ],
    }
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta?.public && !auth.isAuthenticated)
    return { name: 'login' }

  if (to.meta?.role && auth.role !== to.meta.role)
    return { name: 'login' }
})

export default router
