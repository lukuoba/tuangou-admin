<template>
  <div class="smart-table-container">
    <!-- Table 主体 -->
    <el-table
      :data="tableData"
      v-bind="$attrs"
      v-loading="loading"
      style="width: 100%"
    >
      <!-- 接收父组件传入的 table-column -->
      <slot name="table-column"></slot>
      <slot></slot>
    </el-table>

    <!-- 分页区域 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.page_num"
        v-model:page-size="pagination.page_size"
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
  tableData: { type: Array, required: true }, // 由父组件传入表格数据
  total: { type: Number, required: true }, // 由父组件传入总数据量
  loading: { type: Boolean, required: true }, // 由父组件传入加载状态
  requestParams: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["pagination-change"]);

// 分页状态
const pagination = ref({
  page_num: 1,
  page_size: 10,
});

// 监听请求参数变化
watch(
  () => props.requestParams,
  () => {
    pagination.value.page_num = 1; // 重置页码
  },
  { deep: true }
);

// 分页变化处理
const handlePaginationChange = () => {
  emit("pagination-change", {
    page_num: pagination.value.page_num,
    page_size: pagination.value.page_size,
  });
};

// 暴露方法
defineExpose({
  getPagination: () => pagination.value, // 可选：暴露获取当前分页信息的方法
});
</script>

<style scoped>
.smart-table-container {
  padding: 20px;
  /* background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
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