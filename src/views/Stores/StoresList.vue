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
      <el-form-item label="店铺名称">
          <el-input v-model="searchForm.store_name" />
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="searchForm.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.store_status"
            placeholder="请选择状态"
            class="search-input"
          >
            <el-option label="全部" :value="-1" />
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          ><el-button type="primary" native-type="submit"
            >搜索</el-button
          ></el-form-item
        >
      </el-form>
      <SmartTable
        ref="smartTableRef"
        :tableData="storesData"
        :total="total"
        :loading="isLoading"
        :requestParams="searchParams"
        @pagination-change="handlePaginationChange"
      >
        <!-- 表格列 -->
        <template #table-column>
          <el-table-column label="店铺名称" prop="store_name" />
          <el-table-column label="号码" prop="phone" />
          <el-table-column label="详细地址" prop="detail_address" />
          <el-table-column label="营业执照图片">
            <template #default="scope">
              <el-image
                v-for="(img, index) in scope.row.business_license_picture"
                :key="index"
                :src="img"
                :preview-src-list="[img]"
                class="table-image"
              />
            </template>
          </el-table-column>
          <el-table-column label="食品安全许可证">
            <template #default="scope">
              <el-image
                v-for="(img, index) in scope.row.business_charter_picture"
                :key="index"
                :src="img"
                :preview-src-list="[img]"
                class="table-image"
              />
            </template>
          </el-table-column>
          <el-table-column label="门头图片">
            <template #default="scope">
              <el-image
                v-for="(img, index) in scope.row.entrance_picture"
                :key="index"
                :src="img"
                :preview-src-list="[img]"
                class="table-image"
              />
            </template>
          </el-table-column>
          <el-table-column label="室内图片">
            <template #default="scope">
              <el-image
                v-for="(img, index) in scope.row.indoor_picture"
                :key="index"
                :src="img"
                :preview-src-list="[img]"
                class="table-image"
              />
            </template>
          </el-table-column>
          <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.store_status"
              :inactive-text="row.store_status === 0 ? '禁用' : '启用'"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
          <el-table-column label="备注" prop="remark" />
          <el-table-column label="创建者" prop="created_by" />
          <el-table-column label="更新者" prop="updated_by" />
          <el-table-column label="更新时间" prop="updated_at" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, toRaw } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import AddOrEditStrores from "@/components/stores/AddOrEditStrores.vue";
import SmartTable from "@/components/SmartTable.vue";
import _http from "@/api/stores.js";
const addEditDialog = ref(null);
const dialogTitle = ref("");
const dialogId = ref(null);
const dialogData = ref({});
const searchForm = reactive({
  phone: "", // 手机号码
  store_status:-1,
  store_name:''
});
const smartTableRef = ref(null);
const storesData = ref([]);
const total = ref(0);
const isLoading = ref(false);

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
  dialogId.value = row.id;
  dialogData.value = JSON.parse(JSON.stringify(toRaw(row)));
  nextTick(() => {
    addEditDialog.value.openDialog();
  });
};
// 处理新增/编辑账号逻辑
const handleAddAccount = async (formData) => {
  console.log(formData);
  try {
    const isEdit = !!formData.id;
    const response = isEdit
      ? await _http.editStores(formData)
      : await _http.addStores(formData);
    console.log("response", response);
    ElMessage.success(isEdit ? "编辑成功" : "新增成功");
    nextTick(() => {
      addEditDialog.value.openDialog();
    });
    fetchUserList()
  } catch (error) {
    ElMessage.error(error.message || "操作失败");
  }
};
  


// 分页变化处理
const handlePaginationChange = (params) => {
  searchParams.value = { ...searchParams.value, ...params };
  fetchUserList();
};

const searchParams = ref({});
// 初始化时触发请求
onMounted(() => {
  // 初始化搜索参数（如果需要）
  searchParams.value = { ...searchForm };
  fetchUserList();
});
// 请求方法（由父组件实现）
const fetchUserList = async (params) => {
  isLoading.value = true;
  try {
    const res = await _http.getStoresList(searchParams.value);
    storesData.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 搜索触发
const handleSearch = () => {
  const phone = searchForm.phone;
  if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
    ElMessage.warning('请输入有效的手机号码');
    return;
  }
  searchParams.value = { ...searchForm };
  fetchUserList(); // 触发搜索请求
};

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该店铺吗？", "提示", {
      type: "warning",
    });
    const res = await _http.deleteStores(id);
    console.log("删除成功", res);
    ElMessage.success("删除成功");
    fetchUserList();
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
    const response = await _http.updateStoreStatus({
      ids: [row.id],
      store_status: row.store_status,
    });
    ElMessage.success(response.message || "状态更新成功");
  } catch (error) {
    // 状态变更失败，恢复原状态
    row.store_status = row.store_status === 1 ? 0 : 1;
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
.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
}
.search-input {
  width: 192px;
}
</style>
