import request from '@/utils/request'

// 查询卫星信息列表
export function listSatellitte(query) {
  return request({
    url: '/location/satellitte/list',
    method: 'get',
    params: query
  })
}

// 查询卫星信息详细
export function getSatellitte(id) {
  return request({
    url: '/location/satellitte/' + id,
    method: 'get'
  })
}

// 新增卫星信息
export function addSatellitte(data) {
  return request({
    url: '/location/satellitte',
    method: 'post',
    data: data
  })
}

// 修改卫星信息
export function updateSatellitte(data) {
  return request({
    url: '/location/satellitte',
    method: 'put',
    data: data
  })
}

// 删除卫星信息
export function delSatellitte(id) {
  return request({
    url: '/location/satellitte/' + id,
    method: 'delete'
  })
}
