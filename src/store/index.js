import Vue from 'vue'
import Vuex from 'vuex'
import { menuRoutes } from '@/router'
import { getCurrent } from '@/api/login'

Vue.use(Vuex)

// 递归路由
const recursionRoute = routes => {
  if (!routes || !routes.length) return []

  return routes.map(r => {
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
    userInfo: {}
  },
  mutations: {
    SAVELOGININFO(state, data) {
      state.token = data.token
      state.userInfo = data.userInfo
    },
    INITROUTES(state) {
      state.rootList = recursionRoute(menuRoutes)
    }
  },
  actions: {
    APPINIT({ commit }) {
      commit('INITROUTES')
      getCurrent().then(res => {
        commit('SAVELOGININFO', res)
      })
    }
  }
})
