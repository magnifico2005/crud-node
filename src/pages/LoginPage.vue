<template>
  <div class="q-pa-md flex flex-center">
    <q-card class="q-pa-md" style="width: 420px ; max-width: 92vw;">
        <div class="text-h6 q-mb-md"> Entrar </div>

          <q-input v-model="email" label="E mail" outlined class="q-mb-sm"/>
       <q-input v-model="password" label="Senha" type="password" outlined autocomplete="current-password" lazy-rules :rules="[val => !!val || 'Informe a senha']" class="q-mb-sm" />


          <q-btn label="Entrar" color="primary" class="full-width" @click="handledLogin"  :locading="loading "/>

        <div class="q-mt-md text-negative" v-if="error">{{error}}</div>

  </q-card>
  </div>
  </template>

  <script>

  import { useAuthStore } from 'src/stores/auth';


  export default {
name: 'LoginPage',
data(){
  return{
    email: '',
    password: '',
    loading:false,
    error:''
  }
},
methods: {
  async handledLogin (){
    const auth = useAuthStore()
    this.loading = true
    this.error = ''
    try{
      await auth.login(this.email, this.password)
      this.$router.push({name: 'home'})
    } catch (e) {
      this.error = e?.response?.data?.message || 'Falha ao efetuar login'
    } finally {
      this.loading = false
    }
  }
 }
}


  </script>
