import { defineStore } from 'pinia'
import { login as doLogin, logout as doLogout } from '@/services/authService'
import { storage } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: storage.access as string | null,
    refreshToken: storage.refresh as string | null,
    loading: false as boolean,
    error: '' as string,
  }),
  getters: {
    isAuthenticated: (s) => !!s.accessToken,
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = ''
      try {
        const res = await doLogin({ email, password })
        this.accessToken = res.access_token
        this.refreshToken = res.refresh_token
      } catch (e: any) {
        this.error = e?.response?.data?.detail || 'Falha no login'
        throw e
      } finally {
        this.loading = false
      }
    },
    logout() {
      doLogout()
      this.accessToken = null
      this.refreshToken = null
    },
  },
})
