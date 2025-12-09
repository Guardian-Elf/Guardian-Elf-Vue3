import request from '@/utils/request'

// 查询卫星信息列表
export function listSatellite(query) {
  return request({
    url: '/location/satellite/list',
    method: 'get',
    params: query
  })
}

// 查询卫星信息详细
export function getSatellite(id) {
  return request({
    url: '/location/satellite/' + id,
    method: 'get'
  })
}

// 新增卫星信息
export function addSatellite(data) {
  return request({
    url: '/location/satellite',
    method: 'post',
    data: data
  })
}

// 修改卫星信息
export function updateSatellite(data) {
  return request({
    url: '/location/satellite',
    method: 'put',
    data: data
  })
}

// 删除卫星信息
export function delSatellite(id) {
  return request({
    url: '/location/satellite/' + id,
    method: 'delete'
  })
}
