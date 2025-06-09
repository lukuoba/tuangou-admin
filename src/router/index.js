import { createRouter, createWebHistory } from 'vue-router'
import { Avatar}  from '@element-plus/icons-vue'

// 公共路由（不需要权限）
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      fullScreen: true,  // 添加全屏标记
      requiresAuth: false // 需要登录
    }
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue')
  },
  {
    path:'/accounts',
    name:'Accounts',
    component:()=>import('../views/Accounts.vue'),
    meta: {
      title: '账号管理', // 路由中文名
      icon: Avatar,  // 路由图标
      roles: ['admin']
    }
  },
  {
    path:'/stores',
    name:'Stores',
    component:()=>import('../views/Stores.vue'),
    meta: {
      title: '店铺管理', // 路由中文名
      icon: Avatar,  // 路由图标
      
    }
  }
]

// 动态路由（需要权限）
const asyncRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'home'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于',
      icon: 'document',
    }
  },
  // {
  //   path:'/accounts',
  //   name:'Accounts',
  //   component:()=>import('../views/Accounts.vue'),
  //   meta: {
  //     title: '账号管理', // 路由中文名
  //     icon: Avatar,  // 路由图标
  //     roles: ['admin']
  //   }
  // },
  {
    path:'/stores',
    name:'Stores',
    component:()=>import('../views/Stores.vue'),
    meta: {
      title: '店铺管理', // 路由中文名
      icon: Avatar,  // 路由图标
      roles: ['admin']
    }
  }
]


// ...（前面的路由配置）

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes // 初始只加载公共路由
})

// 默认路由meta配置
const DEFAULT_META = {
  requiresAuth: true,
  roles: ['admin', 'common', 'vip', 'special']
}

// 合并默认meta配置
function mergeRouteMeta(routes) {
  return routes.map(route => {
    route.meta = {
      ...DEFAULT_META,
      ...route.meta
    }
    return route
  })
}

export function setupRoutes(userRole) {
  const accessibleRoutes = mergeRouteMeta(asyncRoutes).filter(route => {
    const hasPermission = route.meta.requiresAuth || route.meta.roles.includes(userRole)
    console.log(`路由 ${route.path} 权限:`, hasPermission)
    return hasPermission
  })
  
  console.log('可访问路由:', accessibleRoutes)
  
  accessibleRoutes.forEach(route => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
      console.log('已添加路由:', route.name)
    }
  })
  
  // 打印当前路由表
  console.log('当前路由表:', router.getRoutes())
}

export default router