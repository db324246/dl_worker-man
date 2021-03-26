import request from '@utils/request.js'

// 用户分页接口
export function teamList() {
  return request({
    url: '/teamList',
    method: 'get'
  })
}
