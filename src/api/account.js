import request from '../utils/request'

export default {
  //  登录
  login(data) {
    return request({
      url: '/login',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
  // 添加账号
  addCounts(data) {
    return request({
      url: '/account',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
  // 获取账号列表
  getUserList(params) {
    return request({
      url: '/accountList',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 编辑账号
  editCounts(data) {
    return request({
      url: `/accounts/${data.id}`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    }) 
  },
  // 删除账号
  deleteCounts(id) {
    return request({
      url: `/account/${id}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
  // 查询账号
  searchUsers(params) {
    return request({
      url: `/accountAll`,  // 接口路径
      method: 'get',    // 请求方式
      params
    })
  },
  // 根据ID查询账号
  getAccountById(id) {
    return request({
      url: `/accountId/${id}`,  // 接口路径
      method: 'get',    // 请求方式
    })  
  },
  // 上传配置
  uploadConfig(params) {
    return request({
      url: '/oss/sign',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    }) 
  }
}
