import request from '@/utils/request'

// 查询运动数据列表
export function listSpeed(query) {
  return request({
    url: '/location/speed/list',
    method: 'get',
    params: query
  })
}

// 查询运动数据详细
export function getSpeed(id) {
  return request({
    url: '/location/speed/' + id,
    method: 'get'
  })
}

// 新增运动数据
export function addSpeed(data) {
  return request({
    url: '/location/speed',
    method: 'post',
    data: data
  })
}

// 修改运动数据
export function updateSpeed(data) {
  return request({
    url: '/location/speed',
    method: 'put',
    data: data
  })
}

// 删除运动数据
export function delSpeed(id) {
  return request({
    url: '/location/speed/' + id,
    method: 'delete'
  })
}
