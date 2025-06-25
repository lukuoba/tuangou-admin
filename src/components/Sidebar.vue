<!-- src/components/SideBar.vue -->
<template>
  <div class="left-side">
    <div class="logo-container">
      <h1 class="title">春日载阳 福履齐长</h1>
    </div>
    <el-menu
      :default-active="activeMenu"
      :unique-opened="true"
      router
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <template v-for="item in filteredMenuList" :key="item.id">
        <!-- 有子菜单的项 -->
        <el-sub-menu
          v-if="item.children_list && item.children_list.length"
          :index="item.menu_path"
        >
          <template #title>
            <el-icon>
              <component :is="iconMap[item.menu_icon]" />
            </el-icon>
            <span>{{ item.menu_name }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children_list"
            :key="child.id"
            :index="child.menu_path"
          >
            <el-icon>
              <component :is="iconMap[child.menu_icon]" />
            </el-icon>
            <span>{{ child.menu_name }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子菜单的项 -->
        <el-menu-item v-else :index="item.menu_path">
          <el-icon>
            <component :is="iconMap[item.menu_icon]" />
          </el-icon>
          <span>{{ item.menu_name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import {
  Star,
  Avatar,
  Tickets,
  Document,
  User,
  Setting,
  VideoCamera,
  Link,
  Management,
  OfficeBuilding,
  Film
} from "@element-plus/icons-vue";

const route = useRoute();
const menuList = ref([]);

// 图标映射
const iconMap = {
  Start: Star,
  Share: Avatar,
  Tickets: Tickets,
  Document: Document,
  User: User,
  Setting: Setting,
  VideoCamera: VideoCamera,
  Link: Link,
  Management:Management,
  OfficeBuilding:OfficeBuilding,
  Film:Film
};

// 过滤隐藏的菜单项
const filteredMenuList = computed(() => {
  return menuList.value.filter(
    (item) =>
      item.is_hide_menu === 0 &&
      (item.children_list
        ? item.children_list.some((child) => child.is_hide_menu === 0)
        : true)
  );
});

// 当前激活的菜单
const activeMenu = computed(() => route.path);

// 获取菜单数据
const loadMenuData = () => {
  const menuData = localStorage.getItem("menuData");
  if (menuData) {
    try {
      menuList.value = JSON.parse(menuData);
    } catch (e) {
      console.error("菜单数据解析失败:", e);
    }
  }
};

// 初始化加载菜单
loadMenuData();
</script>

<style scoped>
/* 保持原有样式不变 */
</style>
<style scoped>
.left-side {
  width: 220px;
  height: 100vh;
  background-color: #001529;
}
.logo-container {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #002140;
  background-color: #002140;
}
.title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
}
.el-menu {
  border-right: none;
}
</style>
