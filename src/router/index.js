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
    // 处理目录菜单（menu_path 为 "no" 的情况）
    const isDirectory = menu.menu_path.toLowerCase() === 'no' &&
      menu.menu_component === 'NONE' &&
      menu.children_list?.length > 0;

    // 确保路径以斜杠开头，特殊处理目录菜单
    let normalizedPath = menu.menu_path;
    // if (!isDirectory) {
    //   if (normalizedPath === '/') {
    //     normalizedPath = '/home'; // 根路径改为/home
    //   } else if (!normalizedPath.startsWith('/')) {
    //     normalizedPath = '/' + normalizedPath;
    //   }
    // }

    // 确保路由名称有效
    const routeName = menu.menu_name
      ? `${menu.menu_name.replace(/\s+/g, '_')}_${menu.id}`
      : `route_${menu.id}`;

    const route = {
      path: isDirectory ? undefined : '/' + normalizedPath, // 目录菜单不设置路径
      name: routeName, // 目录菜单不需要名称
      meta: {
        title: menu.menu_name,
        icon: iconMap[menu.menu_icon] || Avatar,
        menuId: menu.id,
        parentId: menu.parent_id,
        isDirectory // 标记是否为目录菜单
      }
    }

    // 处理组件
    if (isDirectory) {
      // 目录菜单使用布局组件
      // route.component = () => import('@/views/layout/index.vue')
      console.log('目录菜单:', menu)
    } else if (menu.menu_component !== 'NONE') {
      // 动态导入组件
      try {
        const componentPath = menu.menu_component.replace('@/', '/src/')
        route.component = () => import(/* @vite-ignore */ componentPath)
      } catch (e) {
        console.error(`组件加载失败: ${menu.menu_component}`, e)
        route.redirect = '/404'
      }
    } else {
      // 默认重定向到404
      route.redirect = '/404'
    }

    // 递归处理子菜单
    if (menu.children_list?.length) {
      const childRoutes = convertMenusToRoutes(menu.children_list)

      if (isDirectory) {
        // 目录菜单的子路由
        route.children = childRoutes

        // 为目录菜单设置默认重定向到第一个子路由
        if (childRoutes.length > 0 && childRoutes[0].path) {
          route.redirect = childRoutes[0].path
        }
      } else {
        // 普通菜单的子路由
        route.children = childRoutes
      }
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
  console.log('动态路由配置11111:', dynamicRoutes)
  // 添加新的动态路由
  dynamicRoutes.forEach(route => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
      dynamicRouteNames.push(route.name)
      console.log('动态路由配置:', dynamicRouteNames)
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
  console.log('从localStorage获取的菜单数据:', menuData)
  if (menuData) {
    try {
      const parsedData = JSON.parse(menuData)
      const dynamicRoutes = convertMenusToRoutes(parsedData)
      console.log('转换后的动态路由:', dynamicRoutes)
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