<template>
    <el-menu
      :default-active="activeMenu"
      :unique-opened="true"
      :collapse="false"
      router
      background-color="#001529"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item 
        v-for="route in menuList" 
        :key="route.meta.menuId" 
        :item="route" 
      />
    </el-menu>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import SidebarItem from './SidebarItem.vue'
  
  const props = defineProps({
    menuList: {
      type: Array,
      default: () => []
    }
  })
  
  const route = useRoute()
  
  // 当前激活的菜单
  const activeMenu = computed(() => {
    const { meta, path } = route
    return meta.activeMenu || path
  })
  </script>