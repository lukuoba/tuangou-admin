<template>
  <div>
    <p class="add-button">
      <el-button type="primary" @click="openAddAccountDialog"
        >新增门店</el-button
      >
    </p>
    <AddOrEditStrores
      ref="addEditDialog"
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
        <el-form-item
          ><el-button type="primary" native-type="submit"
            >搜索</el-button
          ></el-form-item
        >
      </el-form>

      <!-- <SmartTable
        ref="smartTableRef"
        :fetch-data="fetchUserList"
        :request-params="searchParams"
        :columns="columns"
      >
      </SmartTable> -->
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, reactive, onMounted, nextTick,toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { formatDateVNode } from "@/utils/dateUtil";
import AddOrEditStrores from "@/components/stores/AddOrEditStrores.vue";
import SmartTable from "@/components/SmartTable.vue";
import { getFullRegionName } from "@/utils/regionUtil.js";
import _http from "@/api/stores.js";
const addEditDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref("");
const dialogData = ref({});
const searchForm = reactive({
  phone: "", // 手机号码
});
const smartTableRef = ref(null);
// 账户列表title
const columns = ref([
  { label: "门店名称", prop: "storeName" },
  {
    label: "地址",
    prop: "location",
    render: (row) => {
      return (
        <span>
          {getFullRegionName(row.location)}
          {row.address}
        </span>
      );
    },
  },
  {
    label: "角色",
    prop: "role",
    render: (row) => {
      const tagType = getTagType(row.role);
      // 只有有类型时才设置 type
      return tagType ? (
        <el-tag type={tagType}>{getTagLabel(row.role)}</el-tag>
      ) : (
        <span>{getTagLabel(row.role)}</span>
      );
    },
  },
  {
    label: "状态",
    prop: "status",
    render: (row) => {
      const tagType = getTagStatus(row.status);
      return tagType ? (
        <el-tag type={tagType}>{getTagStatusLabel(row.status)}</el-tag>
      ) : (
        <span>{getTagStatusLabel(row.status)}</span>
      );
    },
  },
  {
    label: "创建时间",
    prop: "createdAt",
    render: (row) => formatDateVNode(row.createdAt, "YYYY-MM-DD HH:mm"),
  },
  {
    label: "更新时间",
    prop: "updatedAt",
    render: (row) => formatDateVNode(row.updatedAt, "YYYY-MM-DD HH:mm"),
  },
  {
    label: "操作",
    prop: "operation",
    render: (row) => {
      return (
        <div>
          <el-button type="text" onClick={() => handleEdit(row)}>
            编辑
          </el-button>
          <el-button type="text" onClick={() => handleDelete(row._id)}>
            删除
          </el-button>
        </div>
      );
    },
  },
]);

// 打开新增账号弹窗
const openAddAccountDialog = () => {
  dialogTitle.value = "新增门店";
  dialogId.value = null;
  nextTick(() => {
    addEditDialog.value.openDialog();
  });
};
// 打开编辑账号弹窗
const handleEdit = (row) => {
  dialogTitle.value = "编辑门店";
  dialogId.value = row._id;
  console.log("编辑id", row);
  dialogData.value = JSON.parse(JSON.stringify(toRaw(row)))
  console.log("shuju", dialogData.value);
  nextTick(() => {
    addEditDialog.value.openDialog();
  });
};
// 处理新增/编辑账号逻辑
const handleAddAccount = async (formData) => {
  console.log(formData);
  try {
    const isEdit = !!formData._id;
    const response = isEdit
      ? await _http.editStores(formData)
      : await _http.addStores(formData);

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");

    // 方法1：直接调用子组件的refresh方法（推荐）
    smartTableRef.value.refresh();
    // 添加成功后刷新账户列表
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

const searchParams = ref({});
// 初始化时触发请求
onMounted(() => {
  // 初始化搜索参数（如果需要）
  // searchParams.value = { ...searchForm };
  // fetchUserList();
});
// 请求方法（由父组件实现）
const fetchUserList = async (params) => {
  // 实际项目中这里调用API
  const res = await _http.getStoresList(params);
  console.log("用户列表数据", res);
  return {
    list: res.data,
    total: res.total,
  };
};

// 搜索触发
const handleSearch = () => {
  searchParams.value = { ...searchForm };
};

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该用户吗？", "提示", {
      type: "warning",
    });
    const res = await _http.deleteStores(id);
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
