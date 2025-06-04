<template>
  <el-aside class="sidebar">
    <el-menu
      router
      :default-active="$route.path"
      background-color="#304156"
      text-color="#fff"
      active-text-color="#409eff"
    >
      <template v-for="route in accessibleRoutes" :key="route.path">
        <el-menu-item :index="route.path">
          <el-icon>
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userRole = localStorage.getItem("userRole") || "common";

// 计算可访问的路由
const accessibleRoutes = computed(() => {
  return router.getRoutes().filter((route) => {
    return (
      route.meta?.title && // 有标题的才显示
      (!route.meta.requiresAuth || route.meta.roles.includes(userRole))
    );
  });
});
</script>
<style scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  background-color: #304156;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.el-menu {
  border-right: none;
  height: 100%;
}
</style>
