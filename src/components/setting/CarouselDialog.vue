<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="图片" prop="picture_url">
        <PictureUpload
          v-model="form.picture_url"
          :max-count="1"
          list-type="picture-card"
        />
      </el-form-item>
      <el-form-item label="跳转路径" prop="skip_path">
        <el-input v-model="form.skip_path" />
      </el-form-item>
      <el-form-item label="是否展示" prop="is_show_carousel">
        <el-select
          v-model="form.is_show_carousel"
          placeholder="请选择"
          class="search-input"
        >
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
import PictureUpload from "@/components/PictureUploadNew.vue";
import { ref } from "vue";
import _http from "@/api/stores";
// 弹窗显示状态
const dialogVisible = ref(false);

const { title, editId, editData } = defineProps({
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
});

// 表单数据
const form = ref({
  picture_url: [],
  remark: "",
  sort_no: 1,
  skip_path: "",
  is_show_carousel: 1,
});


// 表单校验规则
const rules = {
  picture_url: [{ required: true, message: "请上传图片", trigger: "change" }],
  skip_path: [{ required: true, message: "请输入跳转路径", trigger: "change" }],
  is_show_carousel: [{ required: true, message: "请选择是否展示", trigger: "change" }],
  sort_no: [{ required: true, message: "请输入序列", trigger: "change" }],
};

// 表单引用
const formRef = ref(null);
// 定义 emit
const emit = defineEmits(["addaccount"]);

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  if (editId) {
    form.value = {
      ...editData,
      // category_picture: editData.category_picture ? [editData.category_picture] :  []
    }; // 使用解构赋值创建新对象，避免引用问题
  } else {
    form.value = {
      picture_url: [],
      remark: "",
      sort_no: 1,
      skip_path: "",
      is_show_carousel: 1,
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
      emit("addaccount", {
        ...form.value,
        // category_picture: form.value.category_picture[0],
      }); // 触发父组件的 addaccount 方法
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
