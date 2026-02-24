import { defineStore } from "pinia";
import { api } from "src/boot/axios";



export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    user: null,
    loading: false
  }),

  getters: {
    isLoggedin: (state) => state.accessToken
  },

  actions: {
    setSession({ accessToken, user }) {
      this.accessToken = accessToken
      this.user = user
    },

    clearSession() {
      this.accessToken = null
      this.user = null
    },

    async login(email, password) {
      this.loading = true
      try {
        const { data } = await api.post('/api/auth/login', {
          email,
          password
        })
        this.setSession(data)
      } finally {
        this.loading = false
      }
    },

    async refresh() {
      const { data } = await api.post('/api/auth/refresh')
      this.setSession(data)
      return data.accessToken
    },

    async logout() {
      await api.post('/api/auth/logout')
      this.clearSession()
    },

    async initSession(){
      if (this.accessToken) return true


      // Tenta recuperar sessão via refresh cookie


      try{
        await this.refresh()
        return true
      }catch (e) {
        this.clearSession()
        console.log(e)
        return false
      }
    }
  }
})
