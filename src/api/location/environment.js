import request from '@/utils/request'

// 查询环境数据列表
export function listEnvironment(query) {
  return request({
    url: '/location/environment/list',
    method: 'get',
    params: query
  })
}

// 查询环境数据详细
export function getEnvironment(id) {
  return request({
    url: '/location/environment/' + id,
    method: 'get'
  })
}

// 新增环境数据
export function addEnvironment(data) {
  return request({
    url: '/location/environment',
    method: 'post',
    data: data
  })
}

// 修改环境数据
export function updateEnvironment(data) {
  return request({
    url: '/location/environment',
    method: 'put',
    data: data
  })
}

// 删除环境数据
export function delEnvironment(id) {
  return request({
    url: '/location/environment/' + id,
    method: 'delete'
  })
}
