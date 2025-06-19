<template>
    <div>
      <p class="add-button">
        <el-button type="primary" @click="openAddAccountDialog">新增账号</el-button>
      </p>
      <AddAccountDialog
        ref="addAccountDialog"
        @addaccount="handleAddAccount"
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
          <el-form-item label="手机号码">
            <el-input v-model="searchForm.phone" />
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input v-model="searchForm.user_name" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.user_status" placeholder="请选择状态">
              <el-option label="全部" :value="-1" />
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
            <el-table-column label="用户名" prop="user_name" />
            <el-table-column label="手机号" prop="phone" />
            <!-- <el-table-column label="角色">
              <template #default="scope">
                <el-tag :type="getTagType(scope.row.role)">
                  {{ getTagLabel(scope.row.role) }}
                </el-tag>
              </template>
            </el-table-column> -->
            <el-table-column label="状态">
              <template #default="scope">
                <el-tag :type="getTagStatus(scope.row.user_status)">
                  {{ getTagStatusLabel(scope.row.user_status  ) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="created_at" />
            <el-table-column label="更新时间" prop="updated_at" />
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </SmartTable>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import { formatDateVNode } from "@/utils/dateUtil";
  import AddAccountDialog from "../components/accounts/AddAccountDialog.vue";
  import SmartTable from "@/components/SmartTable.vue";
  import _http from "../api/account";
  
  const addAccountDialog = ref(null);
  const dialogTitle = ref("");
  const dialogId = ref("");
  const dialogData = ref({});
  const searchForm = reactive({
    user_status: -1, 
    phone: "", 
    user_name: "",
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
    addAccountDialog.value.openDialog();
  };
  
  // 打开编辑账号弹窗
  const handleEdit = (row) => {
    dialogTitle.value = "编辑账号";
    dialogId.value = row.id;
    dialogData.value = row;
    addAccountDialog.value.openDialog();
  };
  
  // 处理新增/编辑账号逻辑
  const handleAddAccount = async (formData) => {
    try {
      const isEdit = !!formData.id;
      await (isEdit ? _http.editCounts(formData) : _http.addCounts(formData));
  
      ElMessage.success(isEdit ? "编辑成功" : "新增成功");
      fetchUserList(); 
    } catch (error) {
      ElMessage.error(error.message || "操作失败");
    }
  };
  
  const getTagLabel = (role) => {
    const roleMap = {
      admin: "管理员",
      common: "普通用户",
      vip: "VIP",
      special: "特殊用户",
    };
    return roleMap[role] || "未知角色";
  };
  
  const getTagType = (role) => {
    switch (role) {
      case "admin":
        return "success";
      case "common":
        return "info";
      case "vip":
        return "warning";
      case "special":
        return "danger";
      default:
        return "";
    }
  };
  
  const getTagStatus = (status) => {
    switch (status) {
      case "start":
        return "success";
      case "forbid":
        return "warning";
      case "postpone":
        return "danger";
      default:
        return "";
    }
  };
  
  const getTagStatusLabel = (status) => {
    const statusMap = {
      start: "启用",
      forbid: "禁用",
      postpone: "缴费逾期",
    };
    return statusMap[status] || "未知状态";
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
  </script>
  
  <style scoped>
  .add-button {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  </style>