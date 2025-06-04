<template>
  <div class="smart-table-container">
    <!-- 标题区域（支持插槽） -->
    <div class="table-header">
      <slot name="title">
        <h3 v-if="title">{{ title }}</h3>
      </slot>
    </div>

    <!-- Table 主体 -->
    <el-table
      :data="tableData"
      v-bind="$attrs"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
      >
        <template #default="{ row }">
          <!-- 处理自定义渲染 -->
          <component v-if="col.render" :is="col.render(row)" />
          <span v-else>{{ row[col.prop] }}</span>
        </template>
      </el-table-column>  
      <slot></slot>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePaginationChange"
        @current-change="handlePaginationChange"
      />
      <div class="total-text">共 {{ total }} 条数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  title: String,
  fetchData: { type: Function, required: true },  // 明确为Function类型
  columns: { type: Array, required: true },
  requestParams: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["fetch-success", "fetch-error"]);

// 数据状态
const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
});

// 执行请求方法（添加async/await）
const executeFetch = async () => {
  try {
    loading.value = true;
    const params = {
      ...props.requestParams,
      pageNum: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    };

    const res = await props.fetchData(params);
    
    // 确保数据正确赋值
    tableData.value = res?.list || res?.data || [];
    total.value = res?.total || 0;

    emit("fetch-success", res);
  } catch (error) {
    console.error("表格数据请求失败:", error);
    tableData.value = []; // 清空数据
    total.value = 0;
    emit("fetch-error", error);
  } finally {
    loading.value = false;
  }
};

// 监听变化
watch(
  () => [props.requestParams, props.fetchData], // 同时监听fetchData和requestParams
  () => {
    pagination.value.currentPage = 1; // 重置页码
    executeFetch();
  },
  { deep: true, immediate: true }
);

// 分页变化处理
const handlePaginationChange = () => {
  executeFetch();
};

// 暴露方法
defineExpose({
  refresh: executeFetch,
  getTableData: () => tableData.value, // 可选：暴露获取当前数据的方法
});
</script>

<style scoped>
.smart-table-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-text {
  color: #909399;
  font-size: 14px;
}
</style>
