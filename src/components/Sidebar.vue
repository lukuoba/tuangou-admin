<template>
  <div class="left-side">
    <div class="logo-container">
      <h1 class="title">春日载阳 福履齐长</h1>
    </div>
    <el-menu
      :default-active="activeMenu"
      :unique-opened="true"
      :collapse="false"
      router
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <template v-for="item in menuList" :key="item.id">
        <!-- 有子菜单的项 -->
        <el-sub-menu v-if="item.children_list" :index="item.menu_path">
          <template #title>
            <el-icon v-if="item.menu_icon">
              <component :is="item.menu_icon" />
            </el-icon>
            <span>{{ item.menu_name }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children_list"
            :key="child.id"
            :index="child.menu_path"
          >
            <el-icon v-if="child.menu_icon">
              <component :is="child.menu_icon" />
            </el-icon>
            <span>{{ child.menu_name }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子菜单的项 -->
        <el-menu-item v-else :index="item.menu_path">
          <el-icon v-if="item.menu_icon">
            <component :is="item.menu_icon" />
          </el-icon>
          <span>{{ item.menu_name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";

const route = useRoute();

const menuList = ref([]);

// 初始化
onMounted(() => {
  loadMenuData();
});
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [],
  },
  activeMenu: {
    type: String,
    default: "",
  },
});
// 获取菜单数据
const loadMenuData = () => {
  const menuData = localStorage.getItem("menuData");
  if (menuData) {
    try {
      const parsedData = JSON.parse(menuData);
      console.log("从localStorage加载的菜单数据:", parsedData);
      menuList.value = parsedData;
      console.log("菜单数据加载成功:", menuList.value);
    } catch (e) {
      console.error("菜单数据解析失败:", e);
    }
  }
};

// 当前激活的菜单
const activeMenu = computed(() => {
  const { meta, path } = route;
  return meta.activeMenu || path;
});
</script>
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
