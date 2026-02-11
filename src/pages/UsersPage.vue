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
          color="primary"
          label="Editar"
          @click="openEdit(props.row)"/>
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
  <q-dialog v-model="editDialog">
    <q-card style="min-width: 320px">
      <q-card-section class="text-h6">Editar usuário</q-card-section>
      <q-card-section>
        <q-input v-model="editForm.name" label="Nome" outlined dense/>
        <q-input v-model="editForm.email" label="E-mail" outlined dense class="q-mt-sm"/>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn label="Salvar" color="primary" @click="handleSaveEdit" :loading="editLoading || store.loading"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
         editDialog: false,
         editLoading: false,
         editForm: {
           id: null,
           name: '',
           email: '',
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
      openEdit(row) {
        this.editForm.id = row?.id ?? null
        this.editForm.name = row?.name || ''
        this.editForm.email = row?.email || ''
        this.editDialog = true
      },
      async handleSaveEdit() {
        const name = (this.editForm.name || '').trim()
        const email = (this.editForm.email || '').trim()

        if (!name || !email){
          this.$q.notify({ type: 'negative', message: 'Informe nome e e-mail'})
          return
        }

        this.editLoading = true
        try {
          await this.store.edit(this.editForm.id, { name, email })
          this.editDialog = false
        } finally {
          this.editLoading = false
        }
      },
    },

    mounted() {
      this.store.fetchAll()
    },

  }

   </script>

