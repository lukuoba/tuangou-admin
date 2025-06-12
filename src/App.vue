<template>
  <div>
    <Layout v-if="showLayout" />
    <router-view :class="showLayout ? 'router-view' : 'router-view-full'" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import Layout from "@/views/layout/index.vue";
import { checkLoginStatus } from "@/utils/auth";
import { initDynamicRoutes } from "@/router";

const route = useRoute();
const showLayout = ref(false);
const isLoggedIn = ref(false);

// 初始化应用
const initApp = async () => {
  isLoggedIn.value = checkLoginStatus();
  
  if (isLoggedIn.value) {
    // 初始化动态路由
    const success = await initDynamicRoutes();
    console.log("初始化动态路由成功",success);
    if (success) {
      showLayout.value = true;
    } else {
      console.log("初始化动态路由失败");
    }
  } else {
    showLayout.value = false;
  }
};

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    if (isLoggedIn.value) {
      showLayout.value = newPath !== "/login"; 
    }
  }
);

// 初始化
onMounted(initApp);
</script>

<style>
/* 原有样式保持不变 */
</style>