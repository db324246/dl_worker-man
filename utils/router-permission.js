import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whitePathList = ['/', '/login']

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  NProgress.start()

  if (whitePathList.includes(to.path)) {
    next()
    return NProgress.done()
  }

  // 没有token 的情况下先进行项目初始化
  if (!store.state.token) {
    return store.dispatch('APPINIT')
      .then(() => {
        next()
        NProgress.done()
      })
  }

  if (to.query.redirectPath) {
    next(to.query.redirectPath)
    NProgress.done()
  } else {
    next()
    NProgress.done()
  }
})

export default router
