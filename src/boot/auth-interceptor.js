import { api } from './api'
import { useAuthStore } from 'src/stores/auth'


console.log('[auth-interceptor] loaded'  ,"carregouuu")

let isRefreshing = false
let queue = []


function processQueue(error, token = null ){
  queue.forEach(p=> {
    if(error) p.reject(error)
      else p.resolve(token)
  })
  queue = []
}

export default () => {
  //Adiciona tokem em todos os requests
api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  const token = auth.accessToken

  console.log('[REQ]', config.method?.toUpperCase(), config.url, 'token?', !!token)

  if (token) {
    const value = `Bearer ${token}`

    if (!config.headers) config.headers = {}

    // Axios v1 pode usar AxiosHeaders com .set()
    if (typeof config.headers.set === 'function') {
      config.headers.set('Authorization', value)
    } else {
      config.headers['Authorization'] = value
    }

    console.log('[REQ] Authorization set')
  }

  return config
})


//Intercepta 401 e tenta refresh


api.interceptors.response.use(
   response => response,
async error => {
  const auth = useAuthStore()
  const original = error.config

  if( !original ) return  Promise.reject(error)

  if(error.response?.status === 401 && !original._retry)  {
    if(isRefreshing){
      return new Promise((resolve, reject ) => {
        queue.push({
          resolve:(token ) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          },
          reject
        })
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const newToken = await auth.refresh()
      processQueue(null, newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)

    }catch (err){
      processQueue(err, null)
      auth.clearSession()
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(error)
}
)}
