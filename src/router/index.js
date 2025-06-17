// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { Avatar, Tickets, Star, Document } from '@element-plus/icons-vue'
import { checkLoginStatus } from "@/utils/auth";

// 公共路由（不需要权限）
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
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
  'Document': Document,
  'User': Avatar,
  'Building': Avatar
}

// 存储动态路由状态
let isDynamicRoutesAdded = false

/**
 * 转换后端菜单数据为路由配置
 * @param {Array} menuList 后端返回的菜单列表
 * @returns {Array} 路由配置数组
 */
export function convertMenusToRoutes(menuList) {
  const routes = []
  
  menuList.forEach(menu => {
    // 只处理启用的菜单
    if (menu.menu_status !== 1) return
    
    // 处理特殊路径
    let normalizedPath = menu.menu_path;
    if (normalizedPath === '/') {
      normalizedPath = '/home'; // 根路径转换为/home
    }
    
    // 创建路由对象
    const route = {
      path: menu.menu_path === 'no' ? '' : normalizedPath, // 目录菜单使用空路径
      name: `${menu.menu_name.replace(/\s+/g, '_')}_${menu.id}`,
      meta: {
        title: menu.menu_name,
        icon: iconMap[menu.menu_icon] || Avatar,
        menuId: menu.id,
        parentId: menu.parent_id,
        isDirectory: menu.menu_path === 'no',
        hideMenu: menu.is_hide_menu === 1
      }
    }

    // 处理组件
    if (menu.menu_path === 'no') {
      // 目录菜单使用布局组件
      route.component = () => import('@/views/layout/index.vue')
    } else if (menu.menu_component !== 'NONE') {
      // 动态导入组件
      try {
        let componentPath = menu.menu_component.replace('@/', '/src/')
        if (!componentPath.endsWith('.vue')) {
          componentPath += '.vue'
        }
        route.component = () => import(/* @vite-ignore */ componentPath)
      } catch (e) {
        console.error(`组件加载失败: ${menu.menu_component}`, e)
        route.redirect = '/404'
      }
    } else {
      route.redirect = '/404'
    }

    // 递归处理子菜单
    if (menu.children_list?.length) {
      const childRoutes = convertMenusToRoutes(menu.children_list)
      
      if (menu.menu_path === 'no') {
        route.children = childRoutes
        
        // 设置重定向到第一个有效子路由
        if (childRoutes.length > 0 && childRoutes[0].path) {
          route.redirect = childRoutes[0].path
        }
      } else {
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
  
  // 创建布局路由
  const layoutRoute = {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    meta: { requiresAuth: true },
    children: []
  }
  
  // 添加布局路由
  router.addRoute(layoutRoute)
  
  // 添加子路由
  dynamicRoutes.forEach(route => {
    router.addRoute('layoutRoute', route)
  })
  
  isDynamicRoutesAdded = true
  console.log('动态路由添加完成')
}

/**
 * 移除所有动态路由
 */
export function removeDynamicRoutes() {
  // 移除布局路由及其所有子路由
  if (router.hasRoute('layoutRoute')) {
    router.removeRoute('layoutRoute')
  }
  
  isDynamicRoutesAdded = false
  console.log('已移除所有动态路由')
}

/**
 * 初始化动态路由
 */
export async function initDynamicRoutes() {
  try {
    // 从localStorage获取菜单数据
    const menuData = localStorage.getItem('menuData')
    if (!menuData) {
      console.warn('菜单数据不存在')
      return false
    }
    
    const parsedData = JSON.parse(menuData)
    console.log('解析后的菜单数据:', parsedData)
    
    // 处理可能的list嵌套
    const menuList = Array.isArray(parsedData) ? parsedData : (parsedData.list || [])
    
    const dynamicRoutes = convertMenusToRoutes(menuList)
    console.log('转换后的动态路由:', dynamicRoutes)
    
    addDynamicRoutes(dynamicRoutes)
    return true
  } catch (e) {
    console.error('菜单数据解析失败:', e)
    return false
  }
}

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = checkLoginStatus()
  
  // 不需要认证的页面直接放行
  if (!requiresAuth) {
    next()
    return
  }
  
  // 需要认证但未登录
  if (!isAuthenticated) {
    next('/login')
    return
  }
  
  // 已登录但动态路由未加载
  if (!isDynamicRoutesAdded) {
    try {
      const success = await initDynamicRoutes()
      if (success) {
        // 动态路由添加完成后重定向到目标页面
        next(to.fullPath)
      } else {
        next('/login')
      }
      return
    } catch (e) {
      console.error('路由初始化失败', e)
      next('/login')
      return
    }
  }
  
  next()
})

export default router