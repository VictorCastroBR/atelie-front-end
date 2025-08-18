<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="grey-lighten-4"
      :rail="rail"
      permanent
    >
      <v-list-item
        prepend-avatar="https://ui-avatars.com/api/?name=Admin"
        title="Admin"
        nav
        @click="rail = !rail"
      />

      <v-divider />

      <v-list nav>
        <v-list-item
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          router
          :prepend-icon="item.icon"
          :title="item.title"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat color="white">
      <v-app-bar-title>Painel Administrativo</v-app-bar-title>
      <v-spacer />
      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const drawer = ref(true)
const rail = ref(false)

const items = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/admin' },
  { title: 'Produtos', icon: 'mdi-cart-outline', to: '/admin/produtos' },
]

function logout() {
  auth.logout()
  router.push('/login')
}

onMounted(() => {
  if (auth?.role !== 'admin') {
    router.push('/')
  }
})
</script>
