<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Teste Login</div>

    <q-card class="q-pa-md" style="max-width: 420px">
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
    </q-card>
  </q-page>
</template>

<script>
import { useAuthStore } from 'src/stores/auth'
import { api } from 'src/boot/api'

export default {
  name: 'LoginTestPage',
  data () {
    return {
      email: 'mar@marcio.com',
      password: '123456',
      result: '',
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      const auth = useAuthStore()
      this.loading = true
      try {
        await auth.login(this.email, this.password)

        console.log(this.result , 'token', auth.accessToken)

        this.result = JSON.stringify({ loggedIn: auth.isLoggedIn, user: auth.user }, null, 2)
      } catch (e) {
        this.result = JSON.stringify({ error: e?.response?.data || e.message }, null, 2)
      } finally {
        this.loading = false
      }
    },

    async handleMe () {
      try {
        // Importante: não setamos Authorization aqui.
        // O interceptor deve colocar sozinho.
        const { data } = await api.get('/api/me')
        this.result = JSON.stringify(data, null, 2)
      } catch (e) {
        this.result = JSON.stringify({ error: e?.response?.data || e.message }, null, 2)
      }
    },

    async handleLogout () {
      const auth = useAuthStore()
      try {
        await auth.logout()
        this.result = JSON.stringify({ loggedIn: auth.isLoggedIn }, null, 2)
      } catch (e) {
        this.result = JSON.stringify({ error: e?.response?.data || e.message }, null, 2)
      }
    }
  }
}
</script>
