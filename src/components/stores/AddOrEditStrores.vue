<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="900px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 账号输入框 -->
          <el-form-item label="门店名称" prop="store_name">
            <el-input v-model="form.store_name" placeholder="请输入门店名称" />
          </el-form-item>

          <el-form-item label="所在地区" prop="location">
            <RegionCascader
              v-model="form.location"
              @change="handleRegionChange"
            />
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号码" />
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

          <!-- 状态下拉选择框 -->
          <el-form-item label="状态" prop="store_status">
            <el-select v-model="form.store_status" placeholder="请选择状态">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="序列" prop="sort_no">
            <el-input-number
              v-model="form.sort_no"
              placeholder="请输入序列号"
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
          <el-form-item label="公告" prop="notice">
            <el-input v-model="form.notice" placeholder="请输入公告" />
          </el-form-item>
          <el-form-item label="门头照片">
            <PictureUpload
              v-model="form.entrance_picture"
              :max-count="3"
              list-type="picture-card"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照">
            <PictureUpload
              v-model="form.business_license_picture"
              :max-count="1"
              list-type="picture-card"
            />
          </el-form-item>
          <el-form-item label="食品许可证">
            <PictureUpload
              v-model="form.business_charter_picture"
              :max-count="1"
              list-type="picture-card"
            />
          </el-form-item>

          <el-form-item label="室内照片">
            <PictureUpload
              v-model="form.indoor_picture"
              :max-count="3"
              list-type="picture-card"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import RegionCascader from "@/components/RegionCascader.vue";
import { getFullRegionPath } from "@/utils/regionUtil";
import PictureUpload from "@/components/PictureUploadNew.vue";
import _http from "@/api/stores";
// 弹窗显示状态
const dialogVisible = ref(false);
const categoryList = ref([]);
const { title, editId, editData, modelValue } = defineProps({
  title: {
    type: String,
    default: "新增账号",
  },
  editId: {
    type: Number,
    default: 0,
  },
  editData: {
    type: Object,
    default: undefined,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
});

// 表单数据
const form = ref({
  phone: "",
  store_name: "",
  location: undefined,
  address: "", // 默认密码
  category_id: "", // 默认权限
  store_status: 1, // 默认状态
  adminId: "", // 管理员ID
  picture: [], // 门头图片
  business_license_picture: [], // 营业执照图片
  remark: "",
  sort_no: 1,
  notice: "",
  entrance_picture: [], // 门头照片
  indoor_picture: [], // 室内照片
});
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号码"));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error("请输入正确的手机号码"));
  } else {
    callback();
  }
};
// 表单校验规则
const rules = {
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" },
  ],
  store_name: [{ required: true, message: "请输入账号名称", trigger: "blur" }],
  location: [{ required: true, message: "请选择省市区", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  category_id: [{ required: true, message: "请选择分类", trigger: "change" }],
  store_status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 表单引用
const formRef = ref(null);

// 定义 emit
const emit = defineEmits(["addaccount", "update:modelValue", "change"]);
const getAllCategory = async () => {
  const data = await _http.getAllCategory();
  console.log("分类", data);
  if (data.list) {
    categoryList.value = data.list;
  }
};
// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  getAllCategory();
  if (editId) {
    form.value = { ...editData }; // 使用解构赋值创建新对象，避免引用问题
  } else {
    form.value = {
      phone: "",
      store_name: "",
      location: [],
      address: "", // 默认密码
      category_id: "", // 默认权限
      store_status: 1, // 默认状态
      adminId: "", // 管理员ID
      picture: [], // 门头图片
      business_license_picture: [],
      remark: "",
      sort_no: 1,
      notice: "",
      indoor_picture: [], // 室内照片
    };
  }
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
  formRef.value.resetFields(); // 重置表单
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log("表单数据", form.value);
      emit("addaccount", form.value); // 触发父组件的 addaccount 方法
      handleClose(); // 关闭弹窗
    } else {
      console.log("表单校验失败");
    }
  });
};
const displayRegion = computed(() => {
  return getFullRegionPath(form.value.location);
});

const handleRegionChange = (value) => {
  console.log("选择的地区代码:", value);
  console.log("完整地区路径:", displayRegion.value);
};
const handleUserSelect = (value) => {
  console.log("初始时选择的用户ID:", value);
};
// 暴露方法
defineExpose({ openDialog });
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
