<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="门店类别" prop="category_name">
        <el-input v-model="form.category_name" />
      </el-form-item>
      <el-form-item label="分类级别" prop="category_level">
        <el-select
          v-model="form.category_level"
          placeholder="请选择类别"
          class="search-input"
        >
          <el-option label="首级" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="父级ID" prop="parent_id">
        <el-select
          v-model="form.parent_id"
          placeholder="请选择类别"
          class="search-input"
        >
          <el-option label="首级" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="序列" prop="sort_no">
        <el-input-number
          v-model="form.sort_no"
          placeholder="请输入序列号"
          class="search-input"
        />
      </el-form-item>
      <el-form-item label="状态" prop="category_status">
        <el-select
          v-model="form.category_status"
          placeholder="请选择状态"
          class="search-input"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="类别照片">
        <PictureUpload
          v-model="form.picture"
          :max-count="1"
          list-type="picture-card"
        />
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
import PictureUpload from "@/components/PictureUpload.vue";
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
  category_name: "",
  parent_id: 0, // 父级0
  remark: "",
  category_level: 0, // 首级0
  sort_no: 1,
  category_status: 1,
});

// 表单校验规则
const rules = {
  category_name: [
    { required: true, message: "请输入门店类别", trigger: "blur" },
  ],
  category_level: [
    { required: true, message: "请选择数据权限", trigger: "change" },
  ],
  category_status: [
    { required: true, message: "请选择状态", trigger: "change" },
  ],
  sort_no: [{ required: true, message: "请输入序列", trigger: "change" }],
  parent_id: [{ required: true, message: "请选择父级", trigger: "change" }],
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
      category_name: "",
      parent_id: 0, // 父级0
      remark: "",
      category_level: 0, // 首级0
      sort_no: 1,
      category_status: 1,
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
