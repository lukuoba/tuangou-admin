import request from '../utils/request'

export default {
  //  登录
  login(data) {
    return request({
      url: '/api/sys/user/backgroundUserLogin',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
  // 添加账号
  addCounts(data) {
    return request({
      url: '/api/sys/user/addUser',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
  // 获取账号列表
  getUserList(params) {
    return request({
      url: '/api/sys/user/selectUserList',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 编辑账号
  editCounts(data) {
    return request({
      url: `/api/sys/user/updateUser`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    }) 
  },
  // 删除账号
  deleteCounts(id) {
    return request({
      url: `/api/sys/user/deleteUser?ids=${[id]}`,  // 接口路径
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
  // 更新用户状态
  updateUserStatus(data) {
    return request({
      url: `/api/sys/user/updateUserStatus`,  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
  // 上传配置
  uploadConfig(params) {
    return request({
      url: '/api/com/oss/generatePreSignUrl',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    }) 
  }
}
