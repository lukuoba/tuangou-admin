import request from '../utils/request'

export default {
  // 添加门店
  addStores(data) {
    return request({
      url: '/stores',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
//   获取门店列表
  getStoresList(params) {
    return request({
      url: '/store/list',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 编辑门店
  editStores(data) {
    return request({
      url: `/store/edit/${data._id}`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
  // 删除门店
  deleteStores(_id) {
    return request({
      url: `/store/delete/${_id}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
}