<template>
  <div>
    <CarouselDialog
      ref="addCarouselimg"
      @addaccount="handleAddCarouselimg"
      :title="dialogTitle"
      :editId="dialogId"
      :editData="dialogData"
    />
    <p class="add-button">
      <el-button type="primary" @click="openAddAccountDialog"
        >新增轮播图</el-button
      >
    </p>
    <SmartTable
      ref="smartTableRef"
      :tableData="accountsData"
      :total="totalAccounts"
      :loading="isLoading"
      :requestParams="searchParams"
      @pagination-change="handlePaginationChange"
    >
      <template #table-column>
        
        <el-table-column label="图片">
          <template #default="{ row }">
            <el-image
                v-for="(img, index) in row.picture_url"
                :key="index"
                :src="img"
                :preview-src-list="[img]"
                class="table-image"
              />
            <!-- <el-image
              :src="row.picture_url || ''"
              :preview-src-list="row.picture_url ? row.picture_url : []" 
              style="width: 50px; height: 50px"
            /> -->
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort_no" />
        <el-table-column label="链接" prop="skip_path" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_show_carousel"
              :inactive-text="row.is_show_carousel === 0 ? '不显示' : '显示'"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="created_by" />
        <el-table-column label="更新人" prop="updated_by" />
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
import { ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import SmartTable from "@/components/SmartTable.vue";
import CarouselDialog from "@/components/setting/CarouselDialog.vue";
import _http from "@/api/appSetting";

const addCarouselimg = ref(null);
const dialogTitle = ref("");
const dialogId = ref(null);
const dialogData = ref({});
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
    addCarouselimg.value.openDialog();
  });
};

// 打开编辑账号弹窗
const handleEdit = (row) => {
  dialogTitle.value = "编辑账号";
  dialogId.value = row.id;
  dialogData.value = row;
  nextTick(() => {
    addCarouselimg.value.openDialog();
  });
};

// 处理新增/编辑账号逻辑
const handleAddCarouselimg = async (formData) => {
  const isEdit = !!formData.id;
  try {
    await (
    isEdit
      ? _http.editCarouselimg(formData)
      : _http.addCarouselimg(formData));

    ElMessage.success(isEdit ? "编辑成功" : "新增成功");
    fetchUserList();
  } catch (error) {
    ElMessage.error(error.message || "操作失败");
  }
};

// 初始化时触发请求
onMounted(() => {
  fetchUserList();
});

// 请求方法（由父组件实现）
const fetchUserList = async () => {
  isLoading.value = true;
  console.log('searchParams.value', searchParams.value)
  searchParams.value = {
    ...searchParams.value,
    page_num: searchParams.value.page_num || 1,
    page_size: searchParams.value.page_size || 10,
  }
  try {
    const res = await _http.getCarouselimgList(searchParams.value);
    accountsData.value = res.list;
    totalAccounts.value = res.total;
  } catch (error) {
    console.error("获取用户列表失败:", error);
  } finally {
    isLoading.value = false;
  }
};

// 删除账号
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除该轮播图吗？", "提示", {
      type: "warning",
    });
    await _http.deleteCarouselimg(id);
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
.add-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
