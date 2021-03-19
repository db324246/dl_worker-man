import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const menuRoutes = [
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "login" */ '@/views/home/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/index.vue'),
    meta: { title: '用户管理' }
  }
]

const routes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/layout/index.vue'),
    children: menuRoutes
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
  }
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
