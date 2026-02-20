import axios from 'axios'


export const api = axios.create({
 baseURL: 'http://localhost:3000',
 withCredentials: true

})


export default ({ app }) => {
  app.config.globalProperties.$api = api
}
