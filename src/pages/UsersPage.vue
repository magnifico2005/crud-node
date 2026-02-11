<template>

  <q-page class="q-pa-md">
      <div class="text-h6 q-mb-md">Usuários</div>

  <q-card  class="q-pa-md q-mb-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input  v-model="form.name" label="Nome" outlined dense/>
          </div>
          <div class="col-12 col-md-4 ">
            <q-input  v-model="form.email" label="E-mail" outlined dense/>
          </div>
          <div class="col-12 col-md-4 flex intems-center">
          <q-btn label="Adicionar" color="primary" @click="handledAdd" :loading="store.loading"/>
          <q-btn flat label="Recarregar" class="q-ml-sm" @click="store.fetchAll()" />
          </div>
       </div>

   <div v-if="store.error" class="text-negative q-mt-sm">

      {{ store.error }}

   </div>
 </q-card>

  <q-card>

      <q-card-section>

        <q-table
        title="Lista"
        :rows="store.items"
        :columns="columns"
        row-key="id"
        :loading="store.loading"
        flat
        bordered>

        <template v-slot:body-cell-actions="props">
          <q-td>
          <q-btn
          flat
          color="negative"
          label="Excluir"
          @click="store.remove(props.row.id)"/>

          </q-td>


        </template>

        </q-table>



      </q-card-section>


  </q-card>
  </q-page>

   </template>


   <script>

   import { useUsersStore } from 'src/stores/users.store';


   export default{

    name: 'UsersPage',

    data(){
      return{
        store: useUsersStore(),
        form:{
          name:'',
          email:'',

        },
      columns: [
      {name:'id', label: 'ID' , field:'id' , align:'left'},
      {name:'name', label: 'Nome' , field:'name' , align:'left'},
      {name:'email', label: 'E-mail' , field:'email' , align:'left'},
      {name:'actions', label: 'Ações' , field:'actions' , align:'right'}
      ] ,

      }
    },

  methods: {
      async handledAdd() {

        const name = (this.form.name || '').trim()
        const email = (this.form.email || '').trim()


        if (!name || !email){
          this.$q.notify({ type: 'negative', message: 'Informe nome e e-mail'})
          return
        }

        await this.store.add({name, email})
        this.form.name = ''
        this.form.email= ''

      },
    },

    mounted() {
      this.store.fetchAll()
    },

  }

   </script>
