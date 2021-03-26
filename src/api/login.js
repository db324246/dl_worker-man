import request from '@utils/request.js'

// 系统登录
export function loginSys(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 注册用户
export function registerUser(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

// 系统退出登录
export function loginOutSys(id) {
  return request({
    url: `/logout/${id}`,
    method: 'get'
  })
}

// 查询当前登陆人
export function getCurrent() {
  return request({
    url: '/current',
    method: 'get'
  })
}
