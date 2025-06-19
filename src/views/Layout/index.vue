<!-- src/views/layout/index.vue -->
<template>
  <div class="layout-container">
    <!-- 根据 hideMenu 控制侧边栏显示 -->
    <SideBar v-if="!hideMenu" />
    
    <div class="main-content">
      <!-- 根据 hideMenu 控制顶部栏显示 -->
      <HeaderTop v-if="!hideMenu" />
      
      <router-view class="main-center-box"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import HeaderTop from '@/components/Header.vue'

const route = useRoute()

// 根据当前路由的 meta 判断是否隐藏菜单
const hideMenu = computed(() => {
  return route.meta.hideMenu === true
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.router-view-container {
  height: calc(100vh - 130px); /* 设置固定高度 */
  overflow: auto; /* 内容超出时显示滚动条 */
}
.main-center-box {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin: 20px;
  padding:16px;
  height: 100%;
  overflow: auto;
}
</style>