import { defineStore } from "pinia";

import {listUsers, getUser, createUser , updateUser, deleteUser } from 'src/services/user.service'


export const useUsersStore = defineStore('users', {

  state: () => ({

    items: [],
    loading: false,
    error: null,
  }),


  actions :{

    async fetchAll(){
      this.loading = true
      this.error = null

      try{

        this.items = await listUsers()
      } catch (err) {
        this.error = err?.message || 'Falha ao carregar usuários'
        throw err
      } finally {
        this.loading =false
      }
      },

    async fetchById(id) {
      this.loading = true
      this.error = null

      try {
        const user = await getUser(id)
        return user
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || 'Falha ao carregar usuário'
        throw err
      } finally {
        this.loading = false
      }
    },

    async add(payload){
      this.loading = true
      this.error = null

      console.log(payload)
      try{

        const created = await createUser(payload)
        this.items.unshift(created)
        return created
        } catch (err) {
          this.error = err?.response?.data?.message || err?.message || 'Falha ao criar usuário'
          throw err
        } finally {
          this.loading= false
        }
      },


    async edit (id, payload){

        this.loading = true
        this.error = null
        try{

          const updated = await updateUser(id, payload)
          const idx = this.items.findIndex((u) => u.id === id)
          if (idx >= 0) {
            this.items[idx] = updated
          }
          return updated
        } catch (err){

          this.error = err?.response?.data?.message || err?.message || 'Falha ao atualizar o usuário'
          throw err

        } finally{
          this.loading =  false
        }

      },

      async remove(id){
        this.loading = true
        this.error= null
        try{
          await deleteUser(id)
          this.items = this.items.filter((u) => u.id !== id)
        }catch (err){
          this.error = err?.response?.data?.message || err?.message || 'Falha ao remover o usuário'
          throw err
      } finally {
        this.loading = false
      }
    },
  },

})

