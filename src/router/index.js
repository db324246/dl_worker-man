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
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/index'),
    meta: { title: '用户管理' }
  },
  {
    path: '/userInfo/:id',
    name: 'userInfo',
    hidden: true,
    component: () => import(/* webpackChunkName: "userInfo" */ '@/views/user/userInfo'),
    meta: { title: '用户信息' }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import(/* webpackChunkName: "projects" */ '@/views/projects/index'),
    meta: { title: '项目管理' }
  },
  {
    path: '/projectInfo/:id',
    name: 'projectInfo',
    hidden: true,
    component: () => import(/* webpackChunkName: "projectInfo" */ '@/views/projects/projectInfo'),
    meta: { title: '项目详情' }
  },
  {
    path: '/team',
    name: 'team',
    component: () => import(/* webpackChunkName: "team" */ '@/views/team/index'),
    meta: { title: '团队管理' }
  },
  {
    path: '/teamForm',
    name: 'teamForm-add',
    hidden: true,
    component: () => import(/* webpackChunkName: "teamForm" */ '@/views/team/teamForm'),
    meta: { title: '团队新增' }
  },
  {
    path: '/teamForm/:id',
    name: 'teamForm-edit',
    hidden: true,
    component: () => import(/* webpackChunkName: "teamForm-edit" */ '@/views/team/teamForm'),
    meta: { title: '团队编辑' }
  },
  {
    path: '/workType',
    name: 'workType',
    component: () => import(/* webpackChunkName: "workType" */ '@/views/workType/index'),
    meta: { title: '工种管理' }
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
