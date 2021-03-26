import Vue from 'vue'
import App from './App.vue'

// 引入权限拦截处理的路由
import router from '@utils/router-permission'

import store from './store'
import './global.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import globalFilters from '@/filters'
Vue.use(globalFilters)

import DlTitle from '@/components/dl-title'
import DlBacktool from '@/components/dl-backtool'
import DlTablePage from '@/components/dl-tablePage'
Vue.component('dl-title', DlTitle)
Vue.component('dl-backtool', DlBacktool)
Vue.component('dl-tablePage', DlTablePage)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
