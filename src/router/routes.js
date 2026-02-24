
const routes = [
  {

        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { public: true }
      },


  {
    path:'/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
        meta: {requiresAuth: true}
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('pages/UsersPage.vue'),
         meta: {requiresAuth: true}
      },
      {
    path: 'login-test',
    name: 'login-test',
    component: () => import('pages/LoginTestPage.vue'),
     meta: {requiresAuth: true}

     }
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
