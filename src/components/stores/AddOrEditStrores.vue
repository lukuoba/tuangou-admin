<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 账号输入框 -->
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="form.storeName" placeholder="请输入门店名称" />
      </el-form-item>

      <el-form-item label="所在地区" prop="location">
        <RegionCascader v-model="form.location" @change="handleRegionChange" />
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址" />
      </el-form-item>
      <el-form-item label="管理员" prop="adminId">
        <UserSearchSelect v-model="form.adminId" @change="handleUserSelect" />
      </el-form-item>
      <el-form-item label="权限" prop="role">
        <el-select v-model="form.role" placeholder="请选择权限">
          <el-option label="一般用户" value="common" />
          <el-option label="VIP用户" value="vip" />
          <el-option label="特殊用户" value="special" />
        </el-select>
      </el-form-item>

      <!-- 状态下拉选择框 -->
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="启用" value="start" />
          <el-option label="禁用" value="forbid" />
          <el-option label="缴费逾期" value="postpone" />
        </el-select>
      </el-form-item>
      <el-form-item label="门头照片">
        <PictureUpload
          v-model="form.picture"
          :max-count="1"
          list-type="picture-card"
        />
      </el-form-item>
      <el-form-item label="营业执照">
        <PictureUpload
          v-model="form.images"
          :max-count="1"
          list-type="picture-card"
        />
      </el-form-item>
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
import UserSearchSelect from "@/components/SelectUserId.vue";
import PictureUpload from "@/components/PictureUpload.vue";
// 弹窗显示状态
const dialogVisible = ref(false);

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
  storeName: "",
  location: undefined,
  address: "", // 默认密码
  role: "common", // 默认权限
  status: "start", // 默认状态
  adminId: "", // 管理员ID
  picture: [], // 门头图片
  images: [], // 营业执照图片
});

// 表单校验规则
const rules = {
  storeName: [{ required: true, message: "请输入账号名称", trigger: "blur" }],
  location: [{ required: true, message: "请选择省市区", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  role: [{ required: true, message: "请选择权限", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 表单引用
const formRef = ref(null);

// 定义 emit
const emit = defineEmits(["addaccount", "update:modelValue", "change"]);

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  if (editId) {
    form.value = { ...editData }; // 使用解构赋值创建新对象，避免引用问题
  } else {
    form.value = {
      storeName: "",
      location: [],
      address: "", // 默认密码
      role: "common", // 默认权限
      status: "start", // 默认状态
      adminId: "", // 管理员ID
      picture: [], // 门头图片
      images: [],
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
  return getFullRegionPath(form.value.region);
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
