import { defined } from '@utils'

const dictMapFilter = {
  sexFilter: {
    0: '未知',
    1: '男',
    2: '女'
  },
  userStatusFilter: {
    0: '空闲',
    1: '工作中'
  },
  identityIdFilter: {
    0: '超管',
    1: '队长',
    2: '副队长',
    3: '工人'
  },
  projectSatusFilter: {
    0: '未开始',
    1: '进行中'
  }
}

export default {
  install(Vue) {
    for (const key in dictMapFilter) {
      const value = dictMapFilter[key]
      Vue.filter(key, val => {
        return defined(val) ? value[val] : ''
      })
    }
  }
}
