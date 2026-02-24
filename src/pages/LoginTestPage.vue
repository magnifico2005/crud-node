<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-md" style="width: 420px; max-width: 92vw;">
      <div class="text-h6 q-mb-md">Teste Login</div>

      <q-input v-model="email" label="E-mail" outlined class="q-mb-sm" />
      <q-input v-model="password" label="Senha" type="password" outlined class="q-mb-md" />

      <div class="row q-gutter-sm">
        <q-btn label="Login" color="primary" @click="handleLogin" :loading="loading" />
        <q-btn label="Me (/api/me)" outline @click="handleMe" />
        <q-btn label="Logout" outline color="negative" @click="handleLogout" />
      </div>

      <q-separator class="q-my-md" />

      <div class="text-caption">Resultado:</div>
      <pre style="white-space: pre-wrap">{{ result }}</pre>
      <span> {{ result.user }}</span>
    </q-card>
  </div>
</template>

<script>
import { useAuthStore } from 'src/stores/auth'
import { api } from 'src/boot/api'

export default {
  name: 'LoginTestPage',
  data () {
    return {
      auth: null,
      email: 'mar@marcio.com',
      password: '123456',
      result: '',
      loading: false
    }
  },

  created () {
    this.auth = useAuthStore()
  },

  methods: {
    async handleLogin () {
      this.loading = true
      try {
        await this.auth.login(this.email, this.password)

        this.result = JSON.stringify({
          loggedIn: this.auth.isLoggedin,
          token: this.auth.accessToken,
          user: this.auth.user
        }, null, 2)
        const redirect = this.$route?.query?.redirect || '/'
        this.$router.replace(redirect)
      } catch (e) {
        this.result = JSON.stringify({ error: e?.response?.data || e.message }, null, 2)
      } finally {
        this.loading = false
      }
    },

    async handleMe () {
      try {
        const { data } = await api.get('/api/me')

        this.result = JSON.stringify({
          ok: true,
          data
        }, null, 2)
      } catch (e) {
        this.result = JSON.stringify({
          ok: false,
          status: e?.response?.status,
          error: e?.response?.data || e.message
        }, null, 2)
      }
    },

    async handleLogout () {
      try {
        await this.auth.logout()
        this.result = JSON.stringify({
          loggedIn: this.auth.isLoggedin,
          token: this.auth.accessToken
        }, null, 2)
      } catch (e) {
        this.result = JSON.stringify({ error: e?.response?.data || e.message }, null, 2)
      }
    }
  }
}
</script>
