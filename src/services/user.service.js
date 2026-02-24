import {api} from 'boot/axios'

export async function listUsers() {

  const {data} = await api.get('/api/users')
  return data;

}

export async function getUser(id) {
  const { data } = await api.get(`/api/users/${id}`)
  return data
}

export async function createUser(payload) {

  const { data } = await api.post(`/api/users/`,payload)
  return data

}

export async function updateUser(id, payload) {
  const { data } = await api.patch(`/api/users/${id}`, payload)
  return data
}

export async function deleteUser(id) {

  await api.delete(`/api/users/${id}`)

}
