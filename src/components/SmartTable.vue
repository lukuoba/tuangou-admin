<template>
  <div class="smart-table-container">
    <!-- 操作按钮区域 -->
    <div v-if="hasSelectionColumn" class="table-header">
      <div></div>
      <div>
        <el-button @click="clearSelection">清除选择</el-button>
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </div>
    </div>

    <!-- Table 主体 -->
    <el-table
      :data="tableData"
      v-bind="$attrs"
      v-loading="loading"
      style="width: 100%"
      ref="tableRef"
    >
      <!-- 选择框列 -->
      <el-table-column v-if="hasSelectionColumn" type="selection" width="55" />
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

    <!-- 删除确认弹框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="30%"
      @close="deleteDialogVisible = false"
    >
      <span>确定要删除选中的数据吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmBatchDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  tableData: { type: Array, required: true }, // 由父组件传入表格数据
  total: { type: Number, required: true }, // 由父组件传入总数据量
  loading: { type: Boolean, required: true }, // 由父组件传入加载状态
  requestParams: { type: Object, default: () => ({}) },
  hasSelectionColumn: { type: Boolean, default: false }, // 父组件配置是否有选择框列
  deleteApiPath: { type: String, default: "" }, // 父组件传入删除接口路径
});

const emit = defineEmits(["pagination-change", "refresh-list"]);

// 分页状态
const pagination = ref({
  page_num: 1,
  page_size: 10,
});

// 表格引用
const tableRef = ref(null);

// 删除确认弹框显示状态
const deleteDialogVisible = ref(false);

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

// 清除选择框
const clearSelection = () => {
  tableRef.value?.clearSelection();
};

// 点击批量删除按钮
const handleBatchDelete = () => {
  const selection = tableRef.value?.getSelection();
  if (selection && selection.length > 0) {
    deleteDialogVisible.value = true;
  } else {
    ElMessage.warning("请先选择要删除的数据");
  }
};

// 确认批量删除
const confirmBatchDelete = async () => {
  const selection = tableRef.value?.getSelection();
  const ids = selection.map((item) => item.id);
  try {
    // 模拟调用删除接口
    // 实际使用时需要替换为真实的接口调用
    // await axios.delete(props.deleteApiPath, { data: { ids } });
    ElMessage.success("删除成功");
    deleteDialogVisible.value = false;
    emit("refresh-list"); // 触发刷新列表事件
  } catch (error) {
    ElMessage.error("删除失败，请重试");
    console.error("删除失败:", error);
  }
};

// 暴露方法
defineExpose({
  getPagination: () => pagination.value, // 可选：暴露获取当前分页信息的方法
});
</script>

<style scoped>
.smart-table-container {
  padding: 20px;
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