<template>
  <div>
    <Header v-if="showHeader" />
    <Sidebar v-if="showSidebar" />
    <router-view :class="showSidebar?'router-view' : 'router-view-full'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()
// 分开控制头部和侧边栏的显示
const showHeader = computed(() => !route.meta.fullScreen)
const showSidebar = computed(() => {
  return !route.meta.fullScreen && route.meta.title // 有title的路由才显示侧边栏
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

/* 常规页面样式 */
.router-view {
  margin: 80px 20px 0 220px;
  height: calc(100vh - 110px);
  overflow-y: auto;
}

/* 全屏页面样式 */
.router-view-full {
  margin: 0;
  height: 100vh;
}
</style>