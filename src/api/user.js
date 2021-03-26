import request from '@utils/request.js'

// 用户分页接口
export function userList(params) {
  return request({
    url: '/userList',
    method: 'get',
    params
  })
}

// 更新用户信息接口
export function updateUser(data) {
  return request({
    url: '/updateUser',
    method: 'post',
    data
  })
}

// 删除用户接口
export function deleteUser(id) {
  return request({
    url: `/deleteUser/${id}`,
    method: 'get'
  })
}

// 查询用户信息
export function userInfo(id) {
  return request({
    url: `/userInfo/${id}`,
    method: 'get'
  })
}
