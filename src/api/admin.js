import { de } from 'element-plus/es/locales.mjs'
import request from '../utils/request'

export default {
  // 添加菜单
  addMune(data) {
    return request({
      url: '/api/menu/addMenu',
      method: 'post',
      data      // 请求参数
    })
  },
  //   查询菜单列表
  getMenuList(params) {
    return request({
      url: '/api/menu/queryMenuTree',
      method: 'get',
      params      // 请求参数
    })
  },
  // 编辑菜单列表
  editMenu(data) {
    return request({
      url: '/api/menu/updateMenu',
      method: 'put',
      data      // 请求参数
    })
  },
  // 删除菜单
  deleteMenu(id) {
    return request({
      url: `/api/menu/deleteMenu?ids=${[id]}`,
      method: 'delete',
    })
  },
  // 更新菜单状态
  updateMenuStatus(data) {
    return request({
      url: '/api/menu/updateMenuStatus',
      method: 'put',
      data      // 请求参数
    })
  },

  /**
   * 日志管理
   * @param {*} params 
   * @returns 
   */

  // 查询登录日志列表
  getLoginLogList(params) {
    return request({
      url: '/api/loginLog/queryLoginLogList',
      method: 'get',
      params      // 请求参数
    })
  },
  // 查询登录日志详情
  getLoginLogDetail(id) {
    return request({
      url: `/api/loginLog/queryLoginLogInfo`,
      method: 'get',
      params: {
        id
      }
    })
  },
  // 删除登录日志
  deleteLoginLog(id) {
    return request({
      url: `/api/operateLog/deleteOperateLog`,
      method: 'delete',
      params: { ids: id }
    })
  },
  // 查询操作日志列表
  getOperationLogList(params) {
    return request({
      url: '/api/operateLog/queryOperateLogList',
      method: 'get',
      params      // 请求参数
    })
  },
  // 查询操作日志详情
  getOperationLogDetail(id) {
    return request({
      url: `/api/operateLog/queryOperateLogInfo`,
      method: 'get',
      params: {
        id
      }
    })
  },
  // 删除操作日志
  deleteOperationLog(id) {
    return request({
      url: `/api/operateLog/deleteOperateLog`,
      method: 'delete',
      params: { ids: id }
    })
  },

  /***
   * 角色管理
   * @param {*} params 
   * @returns 
   */
  // 添加角色
  addRole(data) {
    return request({
      url: '/api/role/addRole',
      method: 'post',
      data      // 请求参数
    })
  },
  // 查询角色列表
  getRoleList(params) {
    return request({
      url: '/api/role/queryRoleList',
      method: 'get',
      params      // 请求参数
    })
  },
  // 删除角色
  deleteRole(id) {
    return request({
      url: `/api/role/deleteRole`,
      method: 'delete',
      params: { ids: id }
    })
  },
  // 编辑角色
  editRole(data) {
    return request({
      url: '/api/role/updateRole',
      method: 'put',
      data      // 请求参数
    })
  },
  // 查询角色详情
  detailRole(id) {
    return request({
      url: `/api/role/selectRoleInfo`,
      method: 'get',
      params: {
        id
      }
    })
  },
  // 更新角色状态
  updateRoleStatus(data) {
    return request({
      url: `api/role/updateRoleStatus`,
      method: 'put',
      data
    })
  },
  // 查询角色与菜单关联
  getRoleMenuList(id) {
    return request({
      url: `/api/role/selectRoleMenuList`,
      method: 'get',
      params: {
        role_id: id
      }
    })
  },
  // 更新角色菜单
  updateRoleMenu(data) {
    return request({
      url: `/api/role/updateRoleMenuList`,
      method: 'put',
      data
    })
  },




  /*****
   * 路由相关
   * @param {*} params 
   * @returns 
   */
  getRouteList(params) {
    return request({
      url: '/api/route/queryRouteTree',
      method: 'get',
      params      // 请求参数
    })
  },
  // 查询路由详情
  detailRoute(id) {
    return request({
      url: `/api/route/selectRouteInfo`,
      method: 'get',
      params: {
        id
      }
    })
  },
  // 添加路由
  addRoute(data) {
    return request({
      url: '/api/route/addRoute',
      method: 'post',
      data      // 请求参数
    })
  },
  // 编辑路由
  editRoute(data) {
    return request({
      url: '/api/route/updateRoute',
      method: 'put',
      data      // 请求参数
    })
  },
  // 删除路由
  deleteRoute(id) {
    return request({
      url: `/api/route/deleteRoute`,
      method: 'delete',
      params: { ids: id }
    })
  },
  // 更新路由状态
  updateRouteStatus(id, status) {
    return request({
      url: `api/route/updateRouteStatus`,
      method: 'put',
      params: {
        ids: [id],
        route_status
      }
    })
  }

}