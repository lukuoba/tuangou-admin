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
              <component :is="row.menu_icon" />
            </el-icon>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="menu_status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.menu_status === 1 ? 'success' : 'danger'">
              {{ row.menu_status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_by" label="创建人" width="100" />
        <el-table-column prop="created_at" label="创建时间" width="180" />

        <!-- 自定义操作列 -->
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click.stop="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click.stop="handleDelete(row.id)"
            >
              删除
            </el-button>
            <el-button
              type="success"
              size="small"
              @click.stop="handleDetail(row)"
            >
              详情
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
import MenuManage from "../components/menu/MenuCreated.vue";
import TreeTable from "@/components/TreeTable.vue";
import _http from "../api/admin";
const addAccountDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref("");
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
  }finally {
    loading.value = false;
  }
};

// 行点击事件
const handleRowClick = (row) => {
  console.log("行点击:", row);
};

// 详情按钮
const handleDetail = (row) => {
  console.log("详情:", row);
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
      ? await _http.editCounts(formData)
      : await _http.addMune(formData);

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");

    // 方法1：直接调用子组件的refresh方法（推荐）
    smartTableRef.value.refresh();
    // 添加成功后刷新账户列表
  } catch (error) {
    ElMessage.error(error.message || "操作失败");
  }
};

const searchParams = ref({});
// 初始化时触发请求
onMounted(() => {
  // 初始化搜索参数（如果需要）
  // searchParams.value = { ...searchForm };
  loadData();
});
// 请求方法（由父组件实现）
const fetchUserList = async (params) => {
  // 实际项目中这里调用API
  const res = await _http.getMenuList(params);
  console.log("res", res);
  return {
    list: res.list,
    // total: res.total,
  };
};

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该用户吗？", "提示", {
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
</script>
<style scoped>
.add-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
