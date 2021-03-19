import request from '@utils/request.js'

// 用户分页接口
export function userList(params) {
  return request({
    url: '/userList',
    method: 'get',
    params
  })
}