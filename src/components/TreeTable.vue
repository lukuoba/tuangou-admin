<template>
    <div class="tree-table-container">
      <!-- 搜索框 -->
      <div class="search-box" v-if="showSearch">
        <el-input
          v-model="searchText"
          placeholder="请输入关键词搜索"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
  
      <!-- 树形表格 -->
      <el-table
        ref="tableRef"
        :data="filteredData"
        :tree-props="treeProps"
        row-key="id"
        stripe
        v-bind="$attrs"
        v-loading="loading"
        :element-loading-text="loadingText"
        :highlight-current-row="true"
        @row-click="handleRowClick"
      >
        <!-- 表格列插槽 -->
        <slot></slot>
        
        <!-- 默认操作列 -->
        <el-table-column 
          v-if="showDefaultActions"
          label="操作" 
          width="180" 
          fixed="right"
          align="center"
        >
          <!-- <template #default="{ row }">
            <el-button 
              v-if="showEditAction"
              type="primary" 
              size="small" 
              @click.stop="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button 
              v-if="showDeleteAction"
              type="danger" 
              size="small" 
              @click.stop="handleDelete(row)"
            >
              删除
            </el-button>
            <slot name="actions" :row="row"></slot>
          </template> -->
        </el-table-column>
      </el-table>
  
      <!-- 空状态 -->
      <div v-if="!loading && filteredData.length === 0" class="empty-state">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  
  const props = defineProps({
    // 表格数据
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 加载提示文本
    loadingText: {
      type: String,
      default: '加载中...'
    },
    // 是否显示搜索框
    showSearch: {
      type: Boolean,
      default: true
    },
    // 是否显示默认操作列
    showDefaultActions: {
      type: Boolean,
      default: true
    },
    // 是否显示编辑按钮
    showEditAction: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    showDeleteAction: {
      type: Boolean,
      default: true
    },
    // 是否默认展开所有行
    defaultExpandAll: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['row-click', 'edit', 'delete', 'search'])
  
  const tableRef = ref(null)
  const searchText = ref('')
  
  // 树形配置
  const treeProps = computed(() => {
    return {
      children: 'children_list',
      hasChildren: (row) => {
        return row.children_list && row.children_list.length > 0
      }
    }
  })
  
  // 过滤后的数据
  const filteredData = computed(() => {
    if (!searchText.value) return props.data
    
    return props.data.filter(item => {
      // 检查当前行是否匹配
      const matchCurrent = Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchText.value.toLowerCase())
      )
      
      // 检查子节点是否匹配
      let matchChildren = false
      if (item.children_list && item.children_list.length) {
        matchChildren = item.children_list.some(child => 
          Object.values(child).some(value => 
            String(value).toLowerCase().includes(searchText.value.toLowerCase())
          )
        )
      }
      
      return matchCurrent || matchChildren
    })
  })
  
  // 搜索处理
  const handleSearch = () => {
    emit('search', searchText.value)
  }
  
  // 行点击事件
  const handleRowClick = (row, column, event) => {
    emit('row-click', row)
  }
  
  // 编辑行
  const handleEdit = (row) => {
    emit('edit', row)
  }
  
  // 删除行
  const handleDelete = (row) => {
    emit('delete', row)
  }
  
  // 展开/折叠所有行
  const toggleExpandAll = () => {
    if (tableRef.value) {
      props.data.forEach(item => {
        tableRef.value.toggleRowExpansion(item, !props.defaultExpandAll)
      })
    }
  }
  
  // 监听数据变化，自动展开所有行
  watch(() => props.data, (newData) => {
    if (props.defaultExpandAll && newData.length > 0) {
      setTimeout(() => {
        newData.forEach(item => {
          tableRef.value?.toggleRowExpansion(item, true)
        })
      }, 100)
    }
  }, { immediate: true, deep: true })
  
  // 暴露方法给父组件
  defineExpose({
    toggleExpandAll
  })
  </script>
  
  <style scoped>
  .tree-table-container {
    padding: 15px;
    /* background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  }
  
  .search-box {
    margin-bottom: 15px;
    max-width: 300px;
  }
  
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    background: #fff;
    border-radius: 8px;
    margin-top: 10px;
  }
  
  :deep(.el-table .el-table__cell) {
    padding: 8px 0;
  }
  
  :deep(.el-table__expand-icon) {
    margin-right: 8px;
  }
  
  :deep(.el-table__expand-icon .el-icon) {
    font-size: 16px;
  }
  </style>