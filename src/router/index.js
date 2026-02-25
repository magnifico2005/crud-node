import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

import { useAuthStore } from 'src/stores/auth'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // 1) Rotas públicas
  if (to.meta?.public) {
    // se já está logado e tenta abrir /login, manda para home
    if (to.name === 'login' && auth.isLoggedIn) {
      return { name: 'home' }
    }
    return true
  }

  // 2) Rotas protegidas
  if (to.meta?.requiresAuth) {
    const ok = await auth.initSession()

    if (!ok) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // 3) RBAC por role
    const roles = to.meta?.roles
    if (roles && roles.length) {
      const userRole = auth.user?.role
      if (!userRole || !roles.includes(userRole)) {
        return { name: 'home' }
      }
    }
  }

  return true
})


  return Router
})
