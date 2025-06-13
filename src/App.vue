<template>
  <div class="main-box">
    <div class="left-box" v-if="showLayout" >
      <SideBar />
    </div>
    <div class="header-top"  v-if="showLayout">
      <HeaderTop />
      <router-view :class="showLayout ? 'router-view' : 'router-view-full'" />   
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import { checkLoginStatus } from "@/utils/auth";
import { initDynamicRoutes } from "@/router";
import HeaderTop from "./components/Header.vue"
const route = useRoute();
const showLayout = ref(false);
const isLoggedIn = ref(false);

// 初始化应用
const initApp = async () => {
  isLoggedIn.value = checkLoginStatus();
  console.log("isLoggedIn",isLoggedIn.value);
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
.main-box {
  display: flex;
  height: 100vh;
}
/* 常规页面样式 */
.router-view {
  margin:10px;
  height: calc(100vh - 100px);
  overflow-y: auto;
}
.left-box {
  width: 220px;
  height: 100vh;
  background-color: #001529;
}
.header-top {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  width: calc(100% - 220px);
  /* padding: 0 20px; */
  height: 61px;
}
/* 全屏页面样式 */
.router-view-full {
  margin: 0;
  width: 100%;
  height: 100vh;
}
</style>