<template>
  <div>
    <h4>新增商品</h4>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <!-- 账号输入框 -->
          <el-form-item label="商品名称" prop="product_name">
            <el-input
              v-model="form.product_name"
              placeholder="请输入商品名称"
            />
          </el-form-item>
          <el-form-item label="主图" prop="main_picture">
            <PictureUpload
              v-model="form.main_picture"
              :max-count="1"
              list-type="picture-card"
            />
          </el-form-item>
          <el-form-item label="展示图片" prop="show_picture">
            <PictureUpload
              v-model="form.show_picture"
              :max-count="10"
              list-type="picture-card"
            />
          </el-form-item>
          <el-form-item label="详情图片" prop="detail_picture">
            <PictureUpload
              v-model="form.detail_picture"
              :max-count="10"
              list-type="picture-card"
            />
          </el-form-item>
          <el-form-item label="分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="请选择分类">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="零售价格" prop="retail_price">
            <el-input-number
              v-model="form.retail_price"
              placeholder="请输入序列号"
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input-number
              v-model="form.stock"
              placeholder="请输入序列号"
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="序列">
            <el-input-number
              v-model="form.sort_no"
              placeholder="请输入序列号"
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="总销量">
            <el-input-number
              v-model="form.total_sales"
              placeholder="请输入总销量"
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="状态" prop="product_status">
            <el-select v-model="form.product_status" placeholder="请选择状态">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否为单规格">
            <el-radio-group v-model="form.is_single_spec">
              <el-radio :value="1" size="large">是</el-radio>
              <el-radio :value="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="规格组">
            <div
              v-for="(specGroup, index) in form.spec_list"
              :key="index"
              class="spec-group"
            >
              <el-form-item
                label="规格名称"
                :prop="`spec_list.${index}.spec_name`"
                :rules="{
                  required: true,
                  message: '请输入规格名称',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="specGroup.spec_name"
                  placeholder="请输入规格名称"
                />
              </el-form-item>
              <el-form-item label="规格数值列表">
                <div
                  v-for="(specValue, valueIndex) in specGroup.spec_value_list"
                  :key="valueIndex"
                  class="spec-value"
                >
                  <el-form-item
                    label="详细名称"
                    :prop="`spec_list.${index}.spec_value_list.${valueIndex}.spec_name`"
                    :rules="{
                      required: true,
                      message: '请输入规格详情名称',
                      trigger: 'blur',
                    }"
                  >
                    <el-input
                      v-model="specValue.spec_name"
                      placeholder="请输入规格详情名称"
                    />
                  </el-form-item>
                  <el-form-item
                    label="价格"
                    :prop="`spec_list.${index}.spec_value_list.${valueIndex}.price`"
                    :rules="{
                      required: true,
                      message: '请输入价格',
                      trigger: 'change',
                    }"
                  >
                    <el-input-number
                      v-model="specValue.price"
                      placeholder="请输入价格"
                      class="search-input"
                    />
                  </el-form-item>
                  <el-form-item label="规格图片">
                    <PictureUpload
                      v-model="specValue.spec_picture"
                      :max-count="1"
                      list-type="picture-card"
                    />
                  </el-form-item>
                  <el-form-item label="库存">
                    <el-input-number
                      v-model="specValue.stock"
                      placeholder="请输入库存"
                      class="search-input"
                    />
                  </el-form-item>
                  <div class="flex justify-center">
                    <el-button
                      @click="addSpecValue(specGroup)"
                      type="primary"
                      size="small"
                      >添加规格数值</el-button
                    >
                    <el-button
                      @click="removeSpecValue(specGroup, valueIndex)"
                      :disabled="specGroup.spec_value_list.length <= 1"
                      type="danger"
                      size="small"
                    >
                      删除规格数值
                    </el-button>
                  </div>
                </div>
              </el-form-item>
              <div class="flex justify-center">
                <el-button @click="addSpecGroup" type="primary"
                  >添加规格组</el-button
                >
                <el-button
                  @click="removeSpecGroup(index)"
                  :disabled="form.spec_list.length <= 1"
                  type="danger"
                >
                  删除规格组
                </el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
          <div class="flex justify-center">
            <el-button @click="handleClear">清空</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button type="success" @click="handlePreview">预览</el-button>
          </div>
        </el-form>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
  </div>
</template>
<script setup>
import PictureUpload from "@/components/PictureUploadNew.vue";
import { ref, onMounted,nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import cloneDeep from "lodash/cloneDeep";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import _http from "@/api/stores.js";

// 表单数据
const initialForm = {
  product_name: "",
  show_picture: [],
  main_picture: [],
  detail_picture: [],
  product_status: null,
  sort_no: 1,
  stock: 1,
  retail_price: 1,
  total_sales: 1,
  remark: "",
  is_single_spec: 1,
  category_id: null,
  spec_list: [
    {
      spec_name: "",
      spec_value_list: [
        {
          spec_name: "",
          price: 0,
          spec_picture: [],
          stock: null,
        },
      ],
    },
  ],
};
// 表单数据
const form = ref(cloneDeep(initialForm));
const isSubmitting = ref(false);
const formRef = ref(null);
const categoryList = ref([]);
const storeId = ref(null);
const productId = ref(null);

const extractFormData = (detailData) => {
  return {
    product_name: detailData.product_name,
    show_picture: detailData.show_picture,
    main_picture: detailData.main_picture,
    detail_picture: detailData.detail_picture,
    product_status: detailData.product_status,
    sort_no: detailData.sort_no,
    stock: detailData.stock,
    retail_price: detailData.retail_price,
    total_sales: detailData.total_sales,
    remark: detailData.remark,
    is_single_spec: detailData.is_single_spec,
    category_id: detailData.category_id,
    spec_list: detailData.spec_list.map(specGroup => ({
      spec_name: specGroup.spec_name,
      spec_value_list: specGroup.spec_value_list.map(specValue => ({
        spec_name: specValue.spec_name,
        price: specValue.price,
        spec_picture: specValue.spec_picture,
        stock: specValue.stock
      }))
    }))
  };
};
// 添加规格组
const addSpecGroup = () => {
  form.value.spec_list.push({
    spec_name: "",
    spec_value_list: [
      {
        spec_name: "",
        price: 0,
        spec_picture: [],
        stock: null,
      },
    ],
  });
};
const getAllCategory = async () => {
  const data = await _http.getAllCategory();
  console.log("分类", data);
  if (data.list) {
    categoryList.value = data.list;
  }
};
// 删除规格组
const removeSpecGroup = (index) => {
  if (form.value.spec_list.length > 1) {
    form.value.spec_list.splice(index, 1);
  }
};

// 添加规格数值
const addSpecValue = (specGroup) => {
  specGroup.spec_value_list.push({
    spec_name: "",
    price: null,
    spec_picture: [],
    stock: null,
  });
};

// 删除规格数值
const removeSpecValue = (specGroup, index) => {
  if (specGroup.spec_value_list.length > 1) {
    specGroup.spec_value_list.splice(index, 1);
  }
};

// 表单校验规则
const rules = {
  product_name: [{ required: true, message: "请输入账号", trigger: "blur" }],
  show_picture: [
    { required: true, message: "请输入展示图片", trigger: "blur" },
  ],
  main_picture: [{ required: true, message: "请输入主图", trigger: "blur" }],
  detail_picture: [
    { required: true, message: "请输入详情图片", trigger: "blur" },
  ],
  product_status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  stock: [{ required: true, message: "请输入库存", trigger: "change" }],
  retail_price: [
    { required: true, message: "请输入零售价格", trigger: "change" },
  ],
  total_sales: [{ required: true, message: "请输入总销量", trigger: "change" }],
};

const handleClear = async () => {
  if (formRef.value) {
    const fields = Object.keys(formRef.value.fields);
    fields.forEach((field) => {
      if (field.startsWith("spec_list")) {
        formRef.value.removeField(field);
      }
    });
  }

  // 使用 lodash 的 cloneDeep 进行深拷贝
  form.value = cloneDeep(initialForm);

  // 重置表单验证
  if (formRef.value) {
    await formRef.value.clearValidate(); // 清空所有校验信息
    formRef.value.resetFields(); // 重置表单字段
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  const submitData = { ...form.value, store_id: storeId.value };
  isSubmitting.value = true; // 开启 loading 效果
  try {
    // 触发表单校验
    await formRef.value.validate();
    // 调用 addProduct 接口
    if (productId.value) {
      submitData.id = productId.value;
    }
    const response = productId.value ? await _http.updateProduct(submitData) : await _http.addProduct(submitData);

    console.log(response, "response", typeof response);
    if (typeof response === "object") {
      // 假设成功状态码为 200
      ElMessageBox.confirm("创建商品成功", "提示", {
        confirmButtonText: "继续新增商品",
        cancelButtonText: "跳转商品列表页",
        type: "success",
      })
        .then(() => {
          // 点击继续新增商品，清空表单
          // handleClear();
        })
        .catch(() => {
          // 点击跳转商品列表页，进行路由跳转
          router.push("/stores/product"); // 路径根据实际情况修改
        });
    } else {
      ElMessage.error(response.message || "创建商品失败");
    }
  } catch (error) {
    ElMessage.error("表单校验失败或请求出错");
    console.error("提交错误:", error);
  } finally {
    isSubmitting.value = false; // 关闭 loading 效果
  }
};
const handlePreview = () => {
  console.log("from", form.value);
};

const getProductDetail = async (id) => {
  try {
    const data = await _http.getProductDetail(id);
    console.log(data, "data");

    if (data && typeof data === "object") {
      // 提取符合 initialForm 结构的数据
      const formData = extractFormData(data);
      // 使用 cloneDeep 深拷贝数据到 form
      nextTick(() => {
        form.value = cloneDeep(formData);
      })
      // 重新初始化表单验证
      if (formRef.value) {
        await formRef.value.clearValidate(); // 清空所有校验信息
        formRef.value.resetFields(); // 重置表单字段
      }
    }
  } catch (error) {
    ElMessage.error("获取商品详情失败");
    console.error("获取商品详情出错:", error);
  }
};

onMounted(async () => {
  // 从 URL 查询参数中获取 store_id
  const urlStoreId = Number(route.query.store_id);
  const urlProductId = Number(route.query.id);
  if (urlStoreId) {
    storeId.value = urlStoreId;
  } else {
    // 从本地存储获取 UserMessage
    const userMessageStr = localStorage.getItem("UserMessage");
    if (userMessageStr) {
      const userMessage = JSON.parse(userMessageStr);
      if (userMessage.user_name === "超级管理员") {
        ElMessageBox.alert("您是超级管理员，请选择门店", "提示", {
          confirmButtonText: "跳转门店列表",
          type: "warning",
          callback: () => {
            // 跳转到门店列表页面，路径根据实际情况修改
            router.push("/stores");
          },
        });
      } else {
        storeId.value = userMessage.store_id;
      }
    }
  }
  if (urlProductId) {
    productId.value = urlProductId;
    getProductDetail(urlProductId);
  }

  // 初始化搜索参数（如果需要）
  // searchParams.value = { ...searchForm };
  getAllCategory();
});
</script>
<style scoped>
h4 {
  margin-bottom: 12px;
}
.spec-group {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.spec-value {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #f0f2f5;
  border-radius: 4px;
}

.add-btn {
  margin-top: 10px;
}

.remove-group-btn {
  margin-top: 10px;
}
.el-form-item .el-form-item {
  margin-bottom: 18px;
}
</style>
