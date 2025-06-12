import request from '../utils/request'

export default {
  // 添加菜单
  addMune(data) {
    return request({
      url: '/api/sys/menu/addMenu',  // 接口路径
      method: 'post',    // 请求方式
      data      // 请求参数
    })
  },
//   查询菜单列表
  getMenuList(params) {
    return request({
      url: '/api/sys/menu/selectMenuList',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    }) 
  },
  // 删除菜单

  deleteMenu(id) {
    return request({
      url: `/api/sys/menu/deleteMenu?ids=${[id]}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
}