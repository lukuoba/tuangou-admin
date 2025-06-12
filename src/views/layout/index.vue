<template>
  <div class="layout-container">
    <div class="sidebar">
      <div class="logo-container">
        <!-- <img src="@/assets/logo.png" alt="Logo" class="logo" /> -->
        <h1 class="title">春日载阳 福履齐长</h1>
      </div>
      <el-menu
        :default-active="activeMenu"
        :unique-opened="true"
        :collapse="isCollapse"
        router
        background-color="#001529"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <template v-for="item in menuList" :key="item.meta.menuId">
          <!-- 有子菜单的项 -->
          <el-sub-menu 
            v-if="item.children && item.children.length > 0" 
            :index="item.path"
          >
            <template #title>
              <el-icon v-if="item.meta.icon">
                <component :is="item.meta.icon" />
              </el-icon>
              <span>{{ item.meta.title }}</span>
            </template>
            <el-menu-item 
              v-for="child in item.children" 
              :key="child.meta.menuId" 
              :index="child.path"
            >
              <el-icon v-if="child.meta.icon">
                <component :is="child.meta.icon" />
              </el-icon>
              <span>{{ child.meta.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 没有子菜单的项 -->
          <el-menu-item v-else :index="item.path">
            <el-icon v-if="item.meta.icon">
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    
    <div class="main-container">
      <div class="header">
        <div class="left-header">
          <el-icon class="collapse-icon" @click="toggleCollapse">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right-header">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="30" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { removeToken, checkLoginStatus } from '@/utils/auth'
import { Expand, Fold } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const menuList = ref([])

// 获取菜单数据
const loadMenuData = () => {
  const menuData = localStorage.getItem('menuData')
  if (menuData) {
    try {
      const parsedData = JSON.parse(menuData)
      menuList.value = parsedData.map(menu => ({
        ...menu,
        meta: {
          title: menu.menu_name,
          icon: menu.menu_icon,
          menuId: menu.id,
          parentId: menu.parent_id
        },
        children: menu.children_list || []
      }))
      console.log('菜单数据加载成功:', menuList.value)
    } catch (e) {
      console.error('菜单数据解析失败:', e)
    }
  }
}

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 面包屑导航
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched
})

// 切换侧边栏折叠
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 退出登录
const logout = () => {
  removeToken()
  localStorage.removeItem('menuData')
  router.push('/login')
}

// 初始化
onMounted(() => {
  loadMenuData()
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  height: 100%;
  overflow: auto;
  background-color: #001529;
  transition: width 0.3s;
}

.logo-container {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #002140;
  background-color: #002140;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.left-header {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.right-header {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info span {
  margin-left: 10px;
  font-size: 14px;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f0f2f5;
}

/* 侧边栏折叠样式 */
.collapsed-sidebar {
  width: 64px;
}

.collapsed-sidebar .logo-container {
  padding: 0 16px;
}

.collapsed-sidebar .title {
  display: none;
}
</style>