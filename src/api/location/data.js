import request from '@/utils/request'

// 查询GPS数据列表
export function listData(query) {
  return request({
    url: '/location/data/list',
    method: 'get',
    params: query
  })
}

// 查询GPS数据详细
export function getData(id) {
  return request({
    url: '/location/data/' + id,
    method: 'get'
  })
}

// 新增GPS数据
export function addData(data) {
  return request({
    url: '/location/data',
    method: 'post',
    data: data
  })
}

// 修改GPS数据
export function updateData(data) {
  return request({
    url: '/location/data',
    method: 'put',
    data: data
  })
}

// 删除GPS数据
export function delData(id) {
  return request({
    url: '/location/data/' + id,
    method: 'delete'
  })
}
