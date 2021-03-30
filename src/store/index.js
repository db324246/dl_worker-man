import Vue from 'vue'
import Vuex from 'vuex'
import { menuRoutes } from '@/router'
import { getCurrent } from '@/api/login'
import { typeList } from '@/api/workType'

Vue.use(Vuex)

// 递归路由
const recursionRoute = routes => {
  if (!routes || !routes.length) return []

  return routes.filter(r => !r.hidden).map(r => {
    return {
      path: r.path,
      name: r.name,
      meta: r.meta,
      children: recursionRoute(r.children)
    }
  })
}

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: {},
    rootList: [],
    workTypes: []
  },
  getters: {
    userId(state) {
      return state.userInfo.id
    },
    identityId(state) {
      return state.userInfo.identityId
    },
    isSuperAdmin(state) { // 用户身份是否是超管
      return state.userInfo.identityId === 0
    },
    isCaptain(state) { // 用户身份是否是队长
      return state.userInfo.identityId === 1
    }
  },
  mutations: {
    // 存储登陆信息
    SAVELOGININFO(state, data) {
      state.token = data.token
      state.userInfo = data.userInfo
    },
    // 清除登陆信息
    CLEARLOGININFO(state) {
      state.token = ''
      state.userInfo = {}
    },
    // 初始化菜单栏路由列表
    INITROUTES(state) {
      state.rootList = recursionRoute(menuRoutes)
    },
    // 存储工种字典
    GETWORKTYPES(state, data) {
      state.workTypes = data
    }
  },
  actions: {
    // 应用初始化
    APPINIT({ commit }) {
      return getCurrent()
        .then(res => {
          commit('INITROUTES')
          commit('SAVELOGININFO', res)
        })
    },
    // 工种字典初始化
    async DICTINIT({ commit }) {
      try {
        const res = await typeList()
        commit('GETWORKTYPES', res)
        return res
      } catch (error) {
        console.log('字典获取失败', error)
        return []
      }
    }
  }
})
