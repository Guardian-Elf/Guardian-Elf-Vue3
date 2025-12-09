import request from '@/utils/request'

// 查询运动信息列表
export function listMotion(query) {
  return request({
    url: '/location/motion/list',
    method: 'get',
    params: query
  })
}

// 查询运动信息详细
export function getMotion(id) {
  return request({
    url: '/location/motion/' + id,
    method: 'get'
  })
}

// 新增运动信息
export function addMotion(data) {
  return request({
    url: '/location/motion',
    method: 'post',
    data: data
  })
}

// 修改运动信息
export function updateMotion(data) {
  return request({
    url: '/location/motion',
    method: 'put',
    data: data
  })
}

// 删除运动信息
export function delMotion(id) {
  return request({
    url: '/location/motion/' + id,
    method: 'delete'
  })
}
