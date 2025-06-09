<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 账号输入框 -->
      <el-form-item label="用户名称" prop="user_name">
        <el-input v-model="form.user_name" placeholder="请输入用户名称" />
      </el-form-item>

      <!-- 手机号码输入框 -->
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" />
      </el-form-item>

      <!-- 密码输入框 -->
      <!-- <el-form-item label="密码" prop="password" v-if="!editId">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
          show-password
        />
      </el-form-item> -->

      <!-- 状态下拉选择框 -->
      <el-form-item label="状态" prop="user_status">
        <el-select v-model="form.user_status" placeholder="请选择状态">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
          <el-option label="缴费逾期" value="postpone" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";

// 弹窗显示状态
const dialogVisible = ref(false);

const { title, editId, editData } = defineProps({
  title: {
    type: String,
    default: "新增账号",
  },
  editId: {
    type: String,
    default: "",
  },
  editData: {
    type: Object,
    default: undefined,
  },
});

// 表单数据
const form = ref({
  user_name: "",
  phone: "",
  remark: "",
  // password: "123456", // 默认密码
  user_status: 1, // 默认状态
  user_key: "",
});

// 表单校验规则
const rules = {
  user_name: [{ required: true, message: "请输入账号", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  // password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  user_status: [{ required: true, message: "请选择状态", trigger: "change" }],
};

// 表单引用
const formRef = ref(null);

// 定义 emit
const emit = defineEmits(["addaccount"]);

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  console.log("id", editId, editData);
  if (editId) {
    form.value = { ...editData }; // 使用解构赋值创建新对象，避免引用问题
  } else {
    form.value = {
      user_name: "",
      phone: "",
      // password: "123456",
      user_status: 1,
      remark: "",
      user_key: "",
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

// 暴露方法
defineExpose({ openDialog });
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
