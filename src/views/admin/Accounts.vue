<template>
  <div>
    <AddAccountDialog
      ref="addAccountDialog"
      @addaccount="handleAddAccount"
      :title="dialogTitle"
      :editId="dialogId"
      :editData="dialogData"
    />
    <div class="top-action">
      <el-form
        :inline="true"
        :model="searchForm"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="手机号码">
          <el-input v-model="searchForm.phone" />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="searchForm.user_name" />
        </el-form-item>
        <el-form-item label="微信用户标识">
          <el-input v-model="searchForm.open_id" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.user_status"
            placeholder="请选择状态"
            class="search-input"
          >
            <el-option label="全部" :value="-1" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
        </el-form-item>
      </el-form>
      <p class="add-button">
        <el-button type="primary" @click="openAddAccountDialog"
          >新增账号</el-button
        >
      </p>
    </div>
    <SmartTable
      ref="smartTableRef"
      :tableData="accountsData"
      :total="totalAccounts"
      :loading="isLoading"
      :requestParams="searchParams"
      @pagination-change="handlePaginationChange"
    >
      <template #table-column>
        <el-table-column label="用户名" prop="user_name" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.user_status"
              :inactive-text="row.user_status === 0 ? '禁用' : '启用'"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="role_name" />
        <el-table-column label="用户头像">
          <template #default="{ row }">
            <el-image
              :src="row.user_avatar"
              :preview-src-list="row.user_avatar"
              fit="cover"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" />
        <el-table-column label="更新时间" prop="updated_at" />
        <el-table-column label="备注" prop="remark" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button text type="danger" @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </SmartTable>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddAccountDialog from "@/components/accounts/AddAccountDialog.vue";
import SmartTable from "@/components/SmartTable.vue";
import _http from "@/api/account";

const addAccountDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref(null);
const dialogData = ref({});
const searchForm = reactive({
  user_status: -1,
  phone: "",
  user_name: "",
  open_id: "",
});
const smartTableRef = ref(null);
const accountsData = ref([]);
const totalAccounts = ref(0);
const isLoading = ref(false);
const searchParams = ref({});

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
  nextTick(() => {
    addAccountDialog.value.openDialog();
  });
};

// 处理新增/编辑账号逻辑
const handleAddAccount = async (formData) => {
  try {
    const isEdit = !!formData.id;
    formData.user_avatar = typeof formData.user_avatar == 'object' ? formData.user_avatar[0] : formData.user_avatar;
    console.log('formData',formData,typeof formData.user_avatar)
    await (isEdit ? _http.editCounts(formData) : _http.addCounts(formData));

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");
    fetchUserList();
  } catch (error) {
    ElMessage.error(error.message || "操作失败");
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
    const res = await _http.getUserList(searchParams.value);
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
    await _http.deleteCounts(id);
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
// 处理状态变更
const handleStatusChange = async (row) => {
  row.statusLoading = true; // 开启加载状态
  try {
    // 调用修改状态接口
    const response = await _http.updateUserStatus({
      ids: [row.id],
      user_status: row.user_status,
    });
    ElMessage.success(response.message || "状态更新成功");
  } catch (error) {
    // 状态变更失败，恢复原状态
    row.user_status = row.user_status === 1 ? 0 : 1;
    ElMessage.error(error.message || "状态更新失败");
  } finally {
    row.statusLoading = false; // 关闭加载状态
  }
};
</script>

<style scoped>
.top-action {
  display: flex;
  justify-content: space-between;
}
.search-input {
  width: 192px;
}
</style>
