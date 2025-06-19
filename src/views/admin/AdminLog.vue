<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="登录日志" name="first">
      <SmartTable
        :tableData="tableData"
        :total="total"
        :loading="loading"
        :hasSelectionColumn="true"
        :deleteApiPath="deleteApiPath"
        @pagination-change="handlePaginationChange"
        @refresh-list="refreshList"
      >
        <!-- 表格列 -->
        <template #table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :prop="item.prop"
            :label="item.label"
            :key="index"
          />
        </template>
      </SmartTable>
    </el-tab-pane>
    <el-tab-pane label="操作日志" name="second">操作</el-tab-pane>
  </el-tabs>
</template>
<script setup>
import SmartTable from "@/components/SmartTable.vue";
import { ref, reactive, onMounted } from "vue";
import _http from "@/api/admin.js";
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const activeName = ref("first");
const deleteApiPath = ref("/api/delete");
const searchForm = reactive({
  user_status: -1,
  phone: "",
  user_name: "",
});
const isLoading = ref(false);
const searchParams = ref({});
const columns = [
  {
    prop: "user_name",
    label: "用户名",
  },
  {
    prop: "user_account",
    label: "用户账号",
  },
  {
    prop: "platform",
    label: "平台",
  },
  {
    prop: "user_id",
    label: "用户ID",
  },
  {
    prop: "login_message",
    label: "登录信息",
  },
  {
    prop: "browser",
    label: "浏览器",
  },
  {
    prop: "ip",
    label: "IP地址",
  },
  {
    prop: "created_at",
    label: "时间",
  },
];
// 初始化时触发请求
onMounted(() => {
  searchParams.value = { ...searchForm };
  fetchUserList();
});
// 搜索触发
const handleSearch = () => {
  searchParams.value = { ...searchForm };
  fetchUserList();
};
const fetchUserList = async () => {
  isLoading.value = true;
  try {
    const res = await _http.getLoginLogList(searchParams.value);
    tableData.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};
const handleClick = (id) => {};
// 分页变化处理
const handlePaginationChange = (params) => {
  searchParams.value = { ...searchParams.value, ...params };
  fetchUserList();
};

const refreshList = () => {
  // 重新请求列表数据
};
</script>
