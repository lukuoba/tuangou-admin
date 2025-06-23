<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录日志" name="first">
        <SmartTable
          :tableData="tableData"
          :total="total"
          :loading="isLoading"
          :hasSelectionColumn="true"
          :deleteApiPath="currentConfig.deleteApiPath"
          @pagination-change="handlePaginationChange"
          @refresh-list="refreshList"
        >
          <!-- 表格列 -->
          <template #table-column>
            <el-table-column
              v-for="(item, index) in currentConfig.columns"
              :prop="item.prop"
              :label="item.label"
              :key="index"
            />
            <el-table-column prop="platform" label="平台">
              <template #default="scope">
                {{ scope.row.platform === 1 ? "小程序" : "后台" }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleDetailClick(scope.row)"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </template>
        </SmartTable>
      </el-tab-pane>
      <!-- 操作日志标签页 -->
      <el-tab-pane label="操作日志" name="second">
        <SmartTable
          :tableData="tableData"
          :total="total"
          :loading="isLoading"
          :hasSelectionColumn="true"
          :deleteApiPath="currentConfig.deleteApiPath"
          @pagination-change="handlePaginationChange"
          @refresh-list="refreshList"
        >
          <!-- 表格列 -->
          <template #table-column>
            <el-table-column
              v-for="(item, index) in currentConfig.columns"
              :prop="item.prop"
              :label="item.label"
              :key="index"
            />
            <el-table-column prop="user_type" label="用户类型">
              <template #default="scope">
                <el-tag
                  :type="scope.row.user_type === '1' ? 'success' : 'warning'"
                  >{{ scope.row.user_type === 1 ? "小程序" : "后台" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="operate_status" label="操作状态">
              <template #default="scope">
                <el-tag
                  :type="scope.row.operate_status === '1' ? '' : 'danger'"
                  >{{
                    scope.row.operate_status === 1 ? "成功" : "失败"
                  }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台">
              <template #default="scope">
                {{ scope.row.platform === 1 ? "小程序" : "后台" }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleDetailClick(scope.row)"
                  >详情</el-button
                >
              </template>
            </el-table-column>
          </template>
        </SmartTable>
      </el-tab-pane>
    </el-tabs>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="detailTitle"
      width="50%"
      :loading="detailLoading"
    >
      <div v-if="activeName==='first'">
        <el-descriptions border column="3">
          <el-descriptions-item label="用户ID" >
          {{ detailData.user_id }}
          </el-descriptions-item>
          <el-descriptions-item label="用户名称">
          {{ detailData.user_name }}
          </el-descriptions-item>
          <el-descriptions-item label="平台">
          {{ detailData.platform === 1 ? "小程序" : "后台" }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border column="3">
          <el-descriptions-item label="状态">
          {{ detailData.login_status === 1 ? "成功" : "失败" }}
          </el-descriptions-item>
          <el-descriptions-item label="登录信息">
          {{ detailData.login_message }}
          </el-descriptions-item>
          <el-descriptions-item label="登录时间">
          {{ detailData.created_at }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border column="2">
          <el-descriptions-item label="登录IP">
          {{ detailData.ip }}
          </el-descriptions-item>
          <el-descriptions-item label="浏览器">
          {{ detailData.browser }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-else>
        <el-descriptions border column="3">
          <el-descriptions-item label="用户ID" >
          {{ detailData.user_id }}
          </el-descriptions-item>
          <el-descriptions-item label="用户名称">
          {{ detailData.user_name }}
          </el-descriptions-item>
          <el-descriptions-item label="平台">
          {{ detailData.platform === 1 ? "小程序" : "后台" }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border column="3">
          <el-descriptions-item label="状态">
          {{ detailData.login_status === 1 ? "成功" : "失败" }}
          </el-descriptions-item>
          <el-descriptions-item label="请求方式">
          {{ detailData.request_method }}
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">
          {{ detailData.created_at }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border column="2">
          <el-descriptions-item label="操作标题">
          {{ detailData.operate_title }}
          </el-descriptions-item>
          <el-descriptions-item label="操作路径">
          {{ detailData.operate_url }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border column="2">
          <el-descriptions-item label="请求参数">
          {{ detailData.operate_request }}
          </el-descriptions-item>
          <el-descriptions-item label="响应参数">
          {{ detailData.operate_response }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions border column="3">
          <el-descriptions-item label="IP">
          {{ detailData.ip }}
          </el-descriptions-item>
          <el-descriptions-item label="浏览器">
          {{ detailData.browser }}
          </el-descriptions-item>
          <el-descriptions-item label="耗时">
          {{ detailData.used_time }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import SmartTable from "@/components/SmartTable.vue";
import { ref, reactive, onMounted } from "vue";
import _http from "@/api/admin.js";

// 日志配置对象
const logConfigs = {
  first: {
    fetchApi: _http.getLoginLogList,
    deleteApiPath: _http.deleteLoginLog,
    columns: [
      {
        prop: "user_name",
        label: "用户名",
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
        prop: "created_at",
        label: "时间",
      },
    ],
  },
  second: {
    fetchApi: _http.getOperationLogList,
    deleteApiPath: _http.deleteOperationLog,
    columns: [
      {
        prop: "user_name",
        label: "用户名",
      },
      {
        prop: "user_account",
        label: "用户账号",
      },
      {
        prop: "user_id",
        label: "用户ID",
      },
      {
        prop: "operate_title",
        label: "操作标题",
      },
      {
        prop: "operate_url",
        label: "操作路径",
      },
      {
        prop: "operate_content",
        label: "操作内容",
      },
      {
        prop: "created_at",
        label: "时间",
      },
    ],
  },
};

const tableData = ref([]);
const total = ref(0);
const isLoading = ref(false);
const activeName = ref("first");
const currentConfig = ref(logConfigs[activeName.value]);
const searchForm = reactive({
  user_status: -1,
  phone: "",
  user_name: "",
});
const searchParams = ref({});

// 详情弹窗相关
const detailDialogVisible = ref(false);
const detailData = ref(null);
const detailLoading = ref(false);
const detailTitle = ref("登录日志详情");

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

// 切换 tab 时触发
const handleClick = (tab) => {
  activeName.value = tab.props.name;
  currentConfig.value = logConfigs[activeName.value];
  searchParams.value = { ...searchForm };
  fetchUserList();
};

const fetchUserList = async () => {
  isLoading.value = true;
  try {
    const res = await currentConfig.value.fetchApi(searchParams.value);
    tableData.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 分页变化处理
const handlePaginationChange = (params) => {
  searchParams.value = { ...searchParams.value, ...params };
  fetchUserList();
};

const refreshList = () => {
  searchParams.value = { ...searchForm };
  fetchUserList();
};

// 处理详情点击事件
const handleDetailClick = async (row) => {
  detailDialogVisible.value = true;
  detailLoading.value = true;
  detailData.value = null;
  detailTitle.value =
    activeName.value === "first" ? "登录日志详情" : "操作日志详情";
  try {
    const api =
      activeName.value === "first"
        ? _http.getLoginLogDetail
        : _http.getOperationLogDetail;
    const res = await api(row.id);
    console.log("res", res);
    detailData.value = res;
  } catch (error) {
    console.error("获取详情失败:", error);
  } finally {
    detailLoading.value = false;
  }
};
</script>
