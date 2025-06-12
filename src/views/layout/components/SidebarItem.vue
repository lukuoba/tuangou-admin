<template>
    <el-sub-menu
      v-if="hasChildren"
      :index="item.path"
    >
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.meta.menuId"
        :item="child"
      />
    </el-sub-menu>
    
    <el-menu-item
      v-else
      :index="item.path"
    >
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    item: {
      type: Object,
      required: true
    }
  })
  
  // 判断是否有子菜单
  const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0
  })
  </script>