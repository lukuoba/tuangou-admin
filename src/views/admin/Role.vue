<template>
  <div>
    <p class="add-button">
      <el-button type="primary" @click="openAddRoleDialog">新增角色</el-button>
    </p>
    <AddRoleDialog
      ref="addRoleDialog"
      @addaccount="handleAddRole"
      :title="dialogTitle"
      :editId="dialogId"
      :editData="dialogData"
    />
    <div>
      <el-form
        :inline="true"
        :model="searchForm"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.role_name" />
        </el-form-item>
        <el-form-item label="数据权限">
          <el-select
            v-model="searchForm.data_scope"
            placeholder="请选择状态"
            class="search-input"
          >
            <el-option label="全部" :value="1" />
            <el-option label="自定义" :value="0" />
            <el-option label="仅本店铺" :value="2" />
            <el-option label="仅本人" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.role_status"
            placeholder="请选择状态"
            class="search-input"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
        </el-form-item>
      </el-form>

      <SmartTable
        ref="smartTableRef"
        title="角色列表"
        :tableData="accountsData"
        :total="totalAccounts"
        :loading="isLoading"
        :requestParams="searchParams"
        @pagination-change="handlePaginationChange"
      >
        <template #table-column>
          <el-table-column label="角色名称" prop="role_name" />
          <el-table-column label="角色标识" prop="role_key" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag
                :type="scope.row.role_status === 1 ? 'success' : 'danger'"
              >
                {{ scope.row.role_status === 1 ? "启用" : "禁用" }}
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
              <el-button type="text" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button type="text" @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </template>
      </SmartTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddRoleDialog from "@/components/accounts/AddRoleDialog.vue";
import SmartTable from "@/components/SmartTable.vue";
import _http from "@/api/admin";

const addRoleDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref("");
const dialogData = ref({});
const searchForm = reactive({
  role_name: "",
  data_scope: "",
  role_status: 1,
});
const smartTableRef = ref(null);
const accountsData = ref([]);
const totalAccounts = ref(0);
const isLoading = ref(false);
const searchParams = ref({});

// 打开新增账号弹窗
const openAddRoleDialog = () => {
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
  nextTick(() => {
    addAccountDialog.value.openDialog();
  });
};

// 处理新增/编辑账号逻辑
const handleAddRole = async (formData) => {
  try {
    const isEdit = !!formData.id;
    await (isEdit ? _http.editRole(formData) : _http.addRole(formData));

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");
    fetchUserList();
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
// 初始化时触发请求
onMounted(() => {
  searchParams.value = { ...searchForm };
  fetchUserList();
});

// 请求方法（由父组件实现）
const fetchUserList = async () => {
  isLoading.value = true;
  try {
    const res = await _http.getRoleList(searchParams.value);
    accountsData.value = res.list;
    totalAccounts.value = res.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 搜索触发
const handleSearch = () => {
  searchParams.value = { ...searchForm };
  fetchUserList();
};

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该用户吗？", "提示", {
      type: "warning",
    });
    await _http.deleteRole(id);
    ElMessage.success("删除成功");
    fetchUserList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  }
};

// 分页变化处理
const handlePaginationChange = (params) => {
  searchParams.value = { ...searchParams.value, ...params };
  fetchUserList();
};
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
