import request from '@utils/request.js'

// 工程项目分页接口
export function projectList(params) {
  console.log('params', params)
  return request({
    url: '/projectList',
    method: 'get',
    params
  })
}

// 工程项目新增接口
export function addProject(data) {
  return request({
    url: '/addProject',
    method: 'post',
    data
  })
}

// 工程项目更新接口
export function updateProject(data) {
  return request({
    url: '/updateProject',
    method: 'post',
    data
  })
}

// 工程项目删除接口
export function deleteProject(id) {
  return request({
    url: `/deleteProject/${id}`,
    method: 'post'
  })
}

// 工程项目详情信息
export function projectInfo(id) {
  return request({
    url: `/projectInfo/${id}`,
    method: 'get'
  })
}

// 查询项目下的工人
export function workersInPro(projectId) {
  return request({
    url: `/workersInPro/${projectId}`,
    method: 'get'
  })
}

// 批量添加工人
export function addWorker(data) {
  return request({
    url: `/addWorker`,
    method: 'post',
    data
  })
}

// 批量移除工人
export function removeWorker(data) {
  return request({
    url: `/removeWorker`,
    method: 'post',
    data
  })
}
