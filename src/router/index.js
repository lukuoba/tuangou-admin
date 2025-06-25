// router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Layout from '@/views/Layout/index.vue';
import _http from '@/api/admin.js';

export const staticRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/home',
    children: [],
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/Forbidden.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { requiresAuth: false },
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'CatchAll',
  //   redirect: '/404',
  // },
];



const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
});

// 转换菜单为动态路由
export function transformMenuToRoutes(menuList) {
  if (!Array.isArray(menuList)) {
    console.warn('菜单数据不是数组：', menuList);
    return [];
  }

  // const modules = import.meta.glob('@/views/**/*.vue');

  const convert = (menu) => {
    const hasChildren = Array.isArray(menu.children_list) && menu.children_list.length > 0;
    const isDirectory = menu.menu_path.toLowerCase() === 'no' &&
                        menu.menu_component === 'NONE' &&
                        menu.children_list?.length > 0
    const route = {
      path: menu.menu_path === 'no' ? `/no-${menu.id}` : menu.menu_path,
      name: `Route${menu.id}`,
      meta: {
        title: menu.menu_name,
        icon: menu.menu_icon,
        hiddenLayout: menu.is_hide_menu === 1,
      },
      redirect: undefined,
      component: undefined,
      children: [],
    };
    if (isDirectory) {
      // 目录菜单使用布局组件
      route.component = () => import('@/views/layout/ParentView.vue');
    } else if (menu.menu_component !== 'NONE') {
      // 动态导入组件
      try {
        let componentPath = menu.menu_component.replace('@/', '/src/')
        if (!componentPath.endsWith('.vue')) {
          componentPath += '.vue'
        }
        console.log('尝试加载组件路径:', componentPath); 
        route.component = () => import(/* @vite-ignore */ componentPath)
      } catch (e) {
        console.error(`组件加载失败: ${menu.menu_component}`, e)
        route.redirect = '/404'
      }
    } else {
      // 默认重定向到404
      route.redirect = '/404'
    }

    if (hasChildren) {
      route.children = menu.children_list.map(convert).filter(Boolean);
    }

    return route;
  };

  return menuList.map(convert).filter(Boolean);
}

export async function setupDynamicRoutes(menuList) {
  if (!Array.isArray(menuList)) {
    console.warn('setupDynamicRoutes: menuList 不是数组：', menuList);
    return;
  }
  const routes = transformMenuToRoutes(menuList);
  console.log('处理之后的route',routes)
  routes.forEach(route => {
    router.addRoute('Layout', route);
  });
}

export async function initDynamicRoutes() {
  try {
    const menuData = localStorage.getItem('menuData');
    if (!menuData) {
      console.warn('菜单数据不存在');
      return false;
    }

    const parsedData = JSON.parse(menuData);
    const menuList = Array.isArray(parsedData) ? parsedData : (parsedData.list || []);

    if (!Array.isArray(menuList)) {
      console.warn('菜单数据格式不正确');
      return false;
    }

    await setupDynamicRoutes(menuList);
    return true;
  } catch (e) {
    console.error('菜单数据解析失败:', e);
    return false;
  }
}

let isDynamicRouteAdded = false;
// ... 已有代码 ...
router.beforeEach(async (to, from, next) => {
  console.log('22222触发路由守卫',isDynamicRouteAdded)
  const token = localStorage.getItem('token');

  if (!token && to.path !== '/login') {
    return next('/login');
  }

  if (token && !isDynamicRouteAdded) {
    try {
      // 等待动态路由初始化完成
      await initDynamicRoutes();
      isDynamicRouteAdded = true;

      // 检查目标路由是否为 404
      if (to.name === 'NotFound') {
        // 尝试跳转到首页
        return next({ path: '/', replace: true });
      }
      return next({ ...to, replace: true }); 
    } catch (error) {
      console.error('动态路由初始化失败:', error);
      return next('/login');
    }
  }

  next();
});
// ... 已有代码 ...

export default router;