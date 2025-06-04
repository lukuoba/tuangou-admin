<template>
  <el-header class="header">
    <div class="header-left">
      <span class="logo">My App</span>
    </div>
    <div class="header-right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar icon="el-icon-user-solid" />
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
import { useRouter } from "vue-router";

const router = useRouter();
const handleProfile = () => {
  console.log("跳转到个人中心");
  // 这里可以跳转到个人中心页面
};

const handleLogout = () => {
  // 清除 token 和用户信息
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");

  // 跳转到登录页
  router.push("/login");
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  padding: 0 20px;
  height: 60px;
  position: fixed;
  top: 0;
  left: 200px; /* 靠左侧侧边栏向右侧布局 */
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
