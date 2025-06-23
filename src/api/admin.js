import { de } from 'element-plus/es/locales.mjs'
import request from '../utils/request'

export default {
  // 添加菜单
  addMune(data) {
    return request({
      url: '/api/sys/menu/addMenu', 
      method: 'post',    
      data      // 请求参数
    })
  },
//   查询菜单列表
  getMenuList(params) {
    return request({
      url: '/api/sys/menu/selectMenuList', 
      method: 'get',    
      params      // 请求参数
    }) 
  },
  // 编辑菜单列表
  editMenu(data) {
    return request({
      url: '/api/sys/menu/updateMenu', 
      method: 'put',    
      data      // 请求参数
    })
  },
  // 删除菜单
  deleteMenu(id) {
    return request({
      url: `/api/sys/menu/deleteMenu?ids=${[id]}`, 
      method: 'delete',    
    })
  },
  // 查询登录日志列表
  getLoginLogList(params) {
    return request({
      url: '/api/sys/loginLog/selectLoginLogList', 
      method: 'get',    
      params      // 请求参数
    })
  },
  // 查询登录日志详情
  getLoginLogDetail(id) {
    return request({
      url: `/api/sys/loginLog/selectLoginLogInfo`, 
      method: 'get',    
      params: {
        id
      }
    })
  },
  // 删除登录日志
  deleteLoginLog(id) {
    return request({
      url: `/api/sys/loginLog/deleteLoginLog`, 
      method: 'delete',    
      params:{ids:id}
    })
  },
  // 查询操作日志列表
  getOperationLogList(params) {
    return request({
      url: '/api/sys/operateLog/selectOperateLogList', 
      method: 'get',    
      params      // 请求参数
    })
  },
  // 查询操作日志详情
  getOperationLogDetail(id) {
    return request({
      url: `/api/sys/operateLog/selectOperateLogInfo`, 
      method: 'get',    
      params: {
        id
      }
    })
  },
  // 删除操作日志
  deleteOperationLog(id) {
    return request({
      url: `/api/sys/operateLog/deleteOperateLog`, 
      method: 'delete',    
      params:{ids:id}
    })
  },
}