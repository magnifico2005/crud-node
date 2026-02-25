
const routes = [
{
  path: '/login',
  name: 'login',
  component: () => import('pages/LoginPage.vue'),
  meta: { public: true }
},
{
  path: '/',
  component: () => import('layouts/MainLayout.vue'),
  children: [
    { path: '/home', name: 'home', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
    { path: '/cadastro', name: 'cadastro', component: () => import('pages/UsersPage.vue'), meta: { requiresAuth: true } }
  ]
},
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
