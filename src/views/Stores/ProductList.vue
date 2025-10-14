<template>
  <div>
    <el-form :inline="true" :model="searchForm" @submit.prevent="handleSearch">
      <el-form-item label="商品名称">
        <el-input
          v-model="searchForm.product_name"
          placeholder="请输入商品名称"
        />
      </el-form-item>
      <el-form-item label="店铺" v-if="showStore">
        <el-select
          v-model="searchForm.store_id"
          placeholder="请选择状态"
          class="search-input"
        >
          <el-option
            v-for="item in store_list"
            :label="item.store_name"
            :value="item.id"
          />
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
      <el-form-item label="是否单规格">
        <el-select
          v-model="searchForm.is_single_spec"
          placeholder="请选择状态"
          class="search-input"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="searchForm.category_id"
          placeholder="请选择分类"
          class="search-input"
        >
          <el-option
            v-for="item in category_list"
            :label="item.category_name"
            :value="item.id"
          />
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
        <el-table-column label="商品名称" prop="product_name" />
        <el-table-column label="库存" prop="stock">
          <template #default="scope">
            <div :style="{ color: scope.row.stock < 20 ? 'red' : '' }">
              {{ scope.row.stock }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="主图">
          <template #default="scope">
            <el-image
              v-for="(img, index) in scope.row.main_picture"
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
              v-model="row.product_status"
              :inactive-text="row.product_status === 0 ? '禁用' : '启用'"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="零售价格" prop="retail_price" />
        <el-table-column label="创建者" prop="created_by" />
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import SmartTable from "@/components/SmartTable.vue";
import _http from "@/api/stores";
import { useRouter } from "vue-router";
const router = useRouter();
const searchForm = reactive({
  store_id: null,
  product_status: null,
  is_single_spec: null,
  product_name: null,
  category_id: null,
});
const showStore = ref(false);
const smartTableRef = ref(null);
const accountsData = ref([]);
const totalAccounts = ref(0);
const isLoading = ref(false);
const searchParams = ref({});
const store_list = ref([]);
const category_list = ref([]);

// 初始化时触发请求
onMounted(async () => {
  const userMessage = JSON.parse(localStorage.getItem("UserMessage"));
  if (userMessage.user_name == "超级管理员") {
    showStore.value = true;
    let params = {
      page: 1,
      page_size: 100,
    };
    const res = await _http.getStoresList(params);
    store_list.value = res.list;
  }
  searchParams.value = { ...searchForm };
  fetchUserList();
});

// 请求方法（由父组件实现）
const fetchUserList = async () => {
  isLoading.value = true;
  try {
    const res = await _http.getProductList(searchParams.value);
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
    await ElMessageBox.confirm("确定删除该商品吗？", "提示", {
      type: "warning",
    });
    await _http.deleteProduct(id);
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
    const response = await _http.updateProductStatus({
      ids: [row.id],
      product_status: row.product_status,
    });
    ElMessage.success(response.message || "状态更新成功");
  } catch (error) {
    // 状态变更失败，恢复原状态
    row.product_status = row.product_status === 1 ? 0 : 1;
    ElMessage.error(error.message || "状态更新失败");
  } finally {
    row.statusLoading = false; // 关闭加载状态
  }
};
const handleEdit = (row) => {
  router.push({
    path: "/stores/add-product",
    query: {
      id: row.id,
      store_id: row.store_id,
    },
  });
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
.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
}
</style>
