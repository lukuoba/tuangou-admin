<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="form.role_name" />
      </el-form-item>
      <el-form-item label="数据权限" prop="data_scope">
        <el-select
          v-model="form.data_scope"
          placeholder="请选择状态"
          class="search-input"
        >
          <el-option label="全部" :value="1" />
          <el-option label="自定义" :value="0" />
          <el-option label="仅本店铺" :value="2" />
          <el-option label="仅本人" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="角色标识" prop="role_key">
        <el-input v-model="form.role_key" />
      </el-form-item>
      <el-form-item label="状态" prop="role_status">
        <el-select
          v-model="form.role_status"
          placeholder="请选择状态"
          class="search-input"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" />
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
  role_name: "",
  role_key: "",
  remark: "",
  data_scope: 1,
});

// 表单校验规则
const rules = {
  role_name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  role_key: [{ required: true, message: "请输入角色标识", trigger: "blur" }],
  data_scope: [{ required: true, message: "请选择数据权限", trigger: "change" }],
  role_status: [{ required: true, message: "请选择状态", trigger: "change" }],
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
      role_name: "",
      data_scope: 1,
      // password: "123456",
      role_status: 1,
      remark: "",
      role_key: "",
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
