import request from '@utils/request.js'

// 团队分页接口
export function teamList() {
  return request({
    url: '/teamList',
    method: 'get'
  })
}

// 团队新增
export function addTeam(data) {
  return request({
    url: '/addTeam',
    method: 'post',
    data
  })
}

// 团队更新
export function updateTeam(data) {
  return request({
    url: '/updateTeam',
    method: 'post',
    data
  })
}

// 团队详情信息接口
export function teamInfo(id) {
  return request({
    url: `/teamInfo/${id}`,
    method: 'get'
  })
}

// 团队删除接口
export function deleteTeam(id) {
  return request({
    url: `/deleteTeam/${id}`,
    method: 'post'
  })
}
