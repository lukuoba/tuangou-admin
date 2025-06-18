<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { checkLoginStatus } from "@/utils/auth";
import { initDynamicRoutes } from "@/router";

const router = useRouter();

// 初始化应用
const initApp = async () => {
  const isLoggedIn = checkLoginStatus();

  if (isLoggedIn) {
    // 尝试初始化动态路由
    const success = await initDynamicRoutes();
    if (success) {
      // 如果当前在登录页，跳转到首页
      if (router.currentRoute.value.path === "/login") {
        router.replace("/home");
      }
    } else {
      // 未登录时重定向到登录页
      if (router.currentRoute.value.path !== "/login") {
        router.replace("/login");
      }
    }
  }
};

onMounted(initApp);
</script>
