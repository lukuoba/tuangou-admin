<template>
  <el-header class="header">
    <div class="header-left">
      <el-icon class="collapse-icon" @click="toggleCollapse">
        <component :is="isCollapse ? 'Expand' : 'Fold'" />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="header-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar
            :size="30"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span>管理员</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isCollapse = ref(false)
const handleProfile = () => {
  console.log("跳转到个人中心");
  // 这里可以跳转到个人中心页面
};
// 切换侧边栏折叠
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
// 面包屑导航
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched
})


const handleLogout = () => {
  // 清除 token 和用户信息
  localStorage.removeItem("token");

  // 跳转到登录页
  router.push("/login");
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #fff;
  height: 61px;
  border-bottom: 1px solid #ccc;
  top: 0;
  left: 220px; /* 靠左侧侧边栏向右侧布局 */
  right: 0;
  z-index: 1000;
}

.header-left .logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.header-right .el-dropdown-link {
  cursor: pointer;
}
</style>
