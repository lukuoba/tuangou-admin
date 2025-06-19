import { de } from 'element-plus/es/locales.mjs'
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
  // 编辑菜单列表
  editMenu(data) {
    return request({
      url: '/api/sys/menu/updateMenu',  // 接口路径
      method: 'put',    // 请求方式
      data      // 请求参数
    })
  },
  // 删除菜单
  deleteMenu(id) {
    return request({
      url: `/api/sys/menu/deleteMenu?ids=${[id]}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
  // 查询登录日志列表
  getLoginLogList(params) {
    return request({
      url: '/api/sys/loginLog/selectLoginLogList',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 查询登录日志详情
  getLoginLogDetail(id) {
    return request({
      url: `/api/sys/loginLog/selectLoginLogById`,  // 接口路径
      method: 'get',    // 请求方式
      params: {
        id
      }
    })
  },
  // 删除登录日志
  deleteLoginLog(id) {
    return request({
      url: `/api/sys/loginLog/deleteLoginLog?ids=${[id]}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
  // 查询操作日志列表
  getOperationLogList(params) {
    return request({
      url: '/api/sys/operateLog/selectOperateLogList',  // 接口路径
      method: 'get',    // 请求方式
      params      // 请求参数
    })
  },
  // 查询操作日志详情
  getOperationLogDetail(id) {
    return request({
      url: `/api/sys/operateLog/selectOperateLogInfo`,  // 接口路径
      method: 'get',    // 请求方式
      params: {
        id
      }
    })
  },
  // 删除操作日志
  deleteOperationLog(id) {
    return request({
      url: `/api/sys/operateLog/deleteOperateLog?ids=${[id]}`,  // 接口路径
      method: 'delete',    // 请求方式
    })
  },
}