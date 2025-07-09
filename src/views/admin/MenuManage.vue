<template>
  <div>
    <p class="add-button">
      <el-button type="primary" @click="openAddAccountDialog"
        >新增菜单</el-button
      >
    </p>
    <MenuManage
      ref="addAccountDialog"
      @addaccount="handleAddAccount"
      :title="dialogTitle"
      :editId="dialogId"
      :editData="dialogData"
    />
    <div>
      <TreeTable
        :data="tableData"
        :loading="loading"
        @row-click="handleRowClick"
        @edit="handleEdit"
        @delete="handleDelete"
        @search="handleSearch"
      >
        <!-- 自定义列 -->
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="menu_name" label="菜单名称" min-width="150" />
        <el-table-column prop="menu_path" label="菜单路径" min-width="120" />
        <el-table-column prop="menu_icon" label="菜单图标" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.menu_icon">
              <component :is="iconMap[row.menu_icon]" />
            </el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="menu_status" label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.menu_status"
              :inactive-text="row.menu_status === 0 ? '禁用' : '启用'"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="created_by" label="创建人" width="100" />
        <el-table-column prop="created_at" label="创建时间" width="180" />

        <!-- 自定义操作列 -->
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              text
              type="danger"
              size="small"
              @click.stop="handleDelete(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </TreeTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import MenuManage from "@/components/menu/MenuCreated.vue";
import TreeTable from "@/components/TreeTable.vue";
import { iconMap } from "@/utils/icon";
import _http from "@/api/admin";
const addAccountDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref(null);
const dialogData = ref({});
const smartTableRef = ref(null);
// 表格数据
const tableData = ref([]);
const loading = ref(false);

// 加载数据
const loadData = async () => {
  try {
    loading.value = true;
    const response = await _http.getMenuList();
    tableData.value = response.list || [];
    console.log("加载数据成功:", tableData.value);
  } catch (error) {
    console.error("加载数据失败:", error);
    ElMessage.error("加载数据失败");
  } finally {
    loading.value = false;
  }
};

// 行点击事件
const handleRowClick = (row) => {
  console.log("行点击:", row);
};

// 搜索事件
const handleSearch = (keyword) => {
  console.log("搜索关键词:", keyword);
  // 这里可以触发搜索请求
};
// 打开新增账号弹窗
const openAddAccountDialog = () => {
  dialogTitle.value = "新增账号";
  dialogId.value = null;
  nextTick(() => {
    addAccountDialog.value.openDialog();
  });
};
// 打开编辑账号弹窗
const handleEdit = (row) => {
  dialogTitle.value = "编辑账号";
  dialogId.value = row.id;
  dialogData.value = row;
  console.log("shuju", row);
  nextTick(() => {
    addAccountDialog.value.openDialog();
  });
};
// 处理新增/编辑账号逻辑
const handleAddAccount = async (formData) => {
  console.log(formData);
  try {
    const isEdit = !!formData.id;
    const response = isEdit
      ? await _http.editMenu(formData)
      : await _http.addMune(formData);

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");

    // 方法1：直接调用子组件的refresh方法（推荐）
    smartTableRef.value.refresh();
    // 添加成功后刷新账户列表
  } catch (error) {
    ElMessage.error(error.message || "操作失败");
  }
};

// 初始化时触发请求
onMounted(() => {
  // 初始化搜索参数（如果需要）
  // searchParams.value = { ...searchForm };
  loadData();
});

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该菜单吗？", "提示", {
      type: "warning",
    });
    const res = await _http.deleteMenu(id);
    console.log("删除成功", res);
    ElMessage.success("删除成功");
    smartTableRef.value.refresh();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  }
};

// 处理状态变更
const handleStatusChange = async (row) => {
  row.statusLoading = true; // 开启加载状态
  try {
    // 调用修改状态接口
    const response = await _http.updateMenuStatus({
      ids: [row.id],
      menu_status: row.menu_status,
    });
    ElMessage.success(response.message || "状态更新成功");
  } catch (error) {
    // 状态变更失败，恢复原状态
    row.menu_status = row.menu_status === 1 ? 0 : 1;
    ElMessage.error(error.message || "状态更新失败");
  } finally {
    row.statusLoading = false; // 关闭加载状态
  }
};
</script>
<style scoped>
.add-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
