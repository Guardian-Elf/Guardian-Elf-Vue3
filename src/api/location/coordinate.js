import request from '@/utils/request'

// 查询坐标信息列表
export function listCoordinate(query) {
  return request({
    url: '/location/coordinate/list',
    method: 'get',
    params: query
  })
}

// 查询坐标信息详细
export function getCoordinate(id) {
  return request({
    url: '/location/coordinate/' + id,
    method: 'get'
  })
}

// 新增坐标信息
export function addCoordinate(data) {
  return request({
    url: '/location/coordinate',
    method: 'post',
    data: data
  })
}

// 修改坐标信息
export function updateCoordinate(data) {
  return request({
    url: '/location/coordinate',
    method: 'put',
    data: data
  })
}

// 删除坐标信息
export function delCoordinate(id) {
  return request({
    url: '/location/coordinate/' + id,
    method: 'delete'
  })
}
