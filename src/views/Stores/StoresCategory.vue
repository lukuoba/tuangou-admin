<template>
  <div>
    <p class="add-button">
      <el-button type="primary" @click="openAddCategoryDialog"
        >新增品类</el-button
      >
    </p>
    <AddCategoryDialog
      ref="addCategoryDialog"
      @addaccount="handleAddRole"
      :title="dialogTitle"
      :editId="dialogId"
      :editData="dialogData"
    /> 
    <div>
      <TreeTable :data="tableData" :loading="loading" :showSearch="false">
        <el-table-column label="商品类型" prop="category_name" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag
              :type="scope.row.category_status === 1 ? 'success' : 'danger'"
            >
              {{ scope.row.category_status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数据权限">
          <template #default="scope">
            {{ getText(scope.row.data_scope) }}
          </template>
        </el-table-column>
        <el-table-column label="创建者" prop="created_by" />
        <el-table-column label="创建时间" prop="created_at" />
        <el-table-column label="更新时间" prop="updated_at" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary"  @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button link type="primary" @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </TreeTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddCategoryDialog from "@/components/stores/AddCategoryDialog.vue";
import TreeTable from "@/components/TreeTable.vue";
import _http from "@/api/stores";

const addCategoryDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref(null);
const dialogData = ref({});
const tableData = ref([]);
const loading = ref(false);
const searchParams = ref({});

// 打开新增账号弹窗
const openAddCategoryDialog = () => {
  dialogTitle.value = "新增角色";
  dialogId.value = null;
  nextTick(() => {
    addCategoryDialog.value.openDialog();
  });
};

// 打开编辑账号弹窗
const handleEdit = (row) => {
  dialogTitle.value = "编辑角色";
  dialogId.value = row.id;
  dialogData.value = row;
  console.log("编辑前", dialogData.value);
  nextTick(() => {
    addCategoryDialog.value.openDialog();
  });
};

// 处理新增/编辑账号逻辑
const handleAddRole = async (formData) => {
  try {
    const isEdit = !!formData.id;
    await (isEdit
      ? _http.updateCategory(formData)
      : _http.addCategory(formData));

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");
    loadData();
  } catch (error) {
    ElMessage.error(error.message || "操作失败");
  }
};

const getText = (role) => {
  switch (role) {
    case 0:
      return "自定义";
    case 1:
      return "全部";
    case 2:
      return "仅本店铺";
    case 3:
      return "仅本人";
    default:
      return "";
  }
};
// 请求方法（由父组件实现）
const loadData = async () => {
  loading.value = true;
  try {
    const res = await _http.getCategoryList(searchParams.value);
    console.log(res);
    tableData.value = res.list;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该用户吗？", "提示", {
      type: "warning",
    });
    await _http.deleteCategory(id);
    ElMessage.success("删除成功");
    loadData();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  }
};

// 初始化时触发请求
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.add-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.search-input {
  width: 192px;
}
</style>
