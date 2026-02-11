import { boot } from 'quasar/wrappers'
import axios from 'axios'


const api = axios.create({

  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

export default boot (({ app }) => {
  app.config.globalProperties.$api = api
})

export {api}
