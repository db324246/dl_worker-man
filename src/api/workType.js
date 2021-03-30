import request from '@utils/request.js'

// 工种分类列表接口（无分页）
export function typeList() {
  return request({
    url: '/typeList',
    method: 'get'
  })
}

// 工种分类新增接口
export function addType(data) {
  return request({
    url: '/addType',
    method: 'post',
    data
  })
}

// 工种分类更新接口
export function updateType(data) {
  return request({
    url: '/updateType',
    method: 'post',
    data
  })
}

// 工种分类删除接口
export function deleteType(id) {
  return request({
    url: `/deleteType/${id}`,
    method: 'post'
  })
}
