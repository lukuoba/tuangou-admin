import { createRouter, createWebHistory } from 'vue-router'
import { Avatar, Tickets, Star, Document } from '@element-plus/icons-vue'

// 公共路由（不需要权限）
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue')
  },
  {
    path: '/:pathMatch(.*)*', // 默认404路由
    redirect: '/login'
  },
  {
    path: '/manage',
    name: 'Home',
    component: () => import('@/views/Menumanage.vue'),
    meta: {
      title: '权限管理',
      icon: Star,
      requiresAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes
})

// 图标映射表
const iconMap = {
  'Start': Star,
  'Share': Avatar,
  'Tickets': Tickets,
  'Document': Document
  // 添加更多图标映射
}

// 存储动态路由状态
let isDynamicRoutesAdded = false
let dynamicRouteNames = []

/**
 * 转换后端菜单数据为路由配置
 * @param {Array} menuList 后端返回的菜单列表
 * @returns {Array} 路由配置数组
 */
export function convertMenusToRoutes(menuList) {
  const routes = []
  
  menuList.forEach(menu => {
    // 只处理启用的菜单
    if (menu.menu_status !== 1) return;
    
    const route = {
      path: menu.menu_path,
      name: menu.menu_name.replace(/\s+/g, '_') + '_' + menu.id, // 确保name唯一
      meta: {
        title: menu.menu_name,
        icon: iconMap[menu.menu_icon] || Avatar,
        menuId: menu.id,
        parentId: menu.parent_id,
        isDirectory: menu.menu_component === 'NONE' && menu.children_list?.length > 0
      }
    }
    
    // 处理组件
    if (menu.menu_component && menu.menu_component !== 'NONE') {
      // 动态导入组件
      try {
        route.component = () => import(/* @vite-ignore */ menu.menu_component)
      } catch (e) {
        console.error(`组件加载失败: ${menu.menu_component}`, e)
        route.redirect = '/404'
      }
    } else if (menu.children_list?.length) {
      // 有子菜单的布局组件
      route.component = () => import('@/views/layout/index.vue')
    } else {
      // 默认重定向到404
      route.redirect = '/404'
    }
    
    // 递归处理子菜单
    if (menu.children_list?.length) {
      route.children = convertMenusToRoutes(menu.children_list)
    }
    
    routes.push(route)
  })
  
  return routes
}

/**
 * 添加动态路由
 * @param {Array} dynamicRoutes 动态路由配置
 */
export function addDynamicRoutes(dynamicRoutes) {
  // 先移除之前添加的动态路由
  removeDynamicRoutes()
  
  // 添加新的动态路由
  dynamicRoutes.forEach(route => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
      dynamicRouteNames.push(route.name)
      console.log('已添加路由:', route.name)
    }
  })
  
  isDynamicRoutesAdded = true
}

/**
 * 移除所有动态路由
 */
export function removeDynamicRoutes() {
  if (!isDynamicRoutesAdded) return
  
  dynamicRouteNames.forEach(name => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  
  dynamicRouteNames = []
  isDynamicRoutesAdded = false
  console.log('已移除所有动态路由')
}

/**
 * 初始化动态路由
 */
export async function initDynamicRoutes() {
  // 从localStorage获取菜单数据
  const menuData = localStorage.getItem('menuData')
  if (menuData) {
    try {
      const parsedData = JSON.parse(menuData)
      const dynamicRoutes = convertMenusToRoutes(parsedData)
      addDynamicRoutes(dynamicRoutes)
      return true
    } catch (e) {
      console.error('菜单数据解析失败:', e)
      return false
    }
  }
  return false
}

export default router