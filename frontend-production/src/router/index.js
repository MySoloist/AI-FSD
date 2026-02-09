import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: () => import('../views/UserForm.vue')
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('../views/UserDetail.vue')
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: () => import('../views/UserForm.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router