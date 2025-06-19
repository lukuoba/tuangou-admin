<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 账号输入框 -->
      <el-form-item label="菜单名称" prop="menu_name">
        <el-input v-model="form.menu_name" placeholder="请输入用户菜单" />
      </el-form-item>

      <!-- 手机号码输入框 -->
      <el-form-item label="路由" prop="menu_path">
        <el-input v-model="form.menu_path" placeholder="请输入路由" />
      </el-form-item>
      <el-form-item label="前端路径" prop="menu_component">
        <el-input v-model="form.menu_component" placeholder="请输入前端路径" />
      </el-form-item>
      <el-form-item label="Icon" prop="menu_icon">
        <el-input v-model="form.menu_icon" placeholder="请输入Icon字符" />
      </el-form-item>
      <el-form-item label="序列" prop="sort_no">
        <el-input-number v-model="form.sort_no" placeholder="请输入序列号" />
      </el-form-item>
      <el-form-item label="父级菜单" prop="parent_id">
        <el-select v-model="form.parent_id" placeholder="请选择父级菜单">
          <el-option
            v-for="item in parentList"
            :key="item.id"
            :label="item.menu_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 状态下拉选择框 -->
      <el-form-item label="状态" prop="menu_status">
        <el-select v-model="form.menu_status" placeholder="请选择状态">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否隐藏菜单" prop="is_hide_menu">
        <el-select v-model="form.is_hide_menu" placeholder="请选择状态">
          <el-option label="显示" :value="0" />
          <el-option label="隐藏" :value="1" />
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
import _http from "@/api/admin";
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
  menu_name: "",
  menu_path: "",
  menu_component: "",
  // password: "123456", // 默认密码
  sort_no: 1, // 默认状态
  parent_id: 0, // 0父级
  menu_status: 1, // 默认状态
  menu_type: 1, // 0->父级；1->子菜单
  is_hide_menu: 0, // 是否隐藏菜单
  remark:''
});

// 表单校验规则
const rules = {
  menu_name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  menu_path: [{ required: true, message: "请输入路由", trigger: "blur" }],
  menu_component: [{ required: true, message: "请输入前端路径", trigger: "blur" }],
  menu_icon: [{ required: true, message: "请输入Icon字符", trigger: "blur" }],
  menu_name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  sort_no: [{ required: true, message: "请输入路由", trigger: "blur" }],
  parent_id: [{ required: true, message: "请选择父级菜单", trigger: "blur" }],
  menu_status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  is_hide_menu: [{ required: true, message: "请选择是否隐藏菜单", trigger: "blur" }],
};

// 表单引用
const formRef = ref(null);
const parentList = ref([]);
// 定义 emit
const emit = defineEmits(["addaccount"]);

// 打开弹窗
const openDialog = () => {
  dialogVisible.value = true;
  _http.getMenuList().then((res) => {
    if (res.list) {
      parentList.value = res.list.map(item => ({
        id: item.id,
        menu_name: item.menu_name
      }));;
      parentList.value.push({ id: 0, menu_name: '根目录' });
      console.log("parentId", parentList);
    }
  });
  console.log("id", editId, editData);
  if (editId) {
    form.value = { ...editData }; // 使用解构赋值创建新对象，避免引用问题
  } else {
    form.value = {
      menu_name: "",
      menu_path: "",
      menu_component: "",
      // password: "123456", // 默认密码
      sort_no: 1, // 默认状态
      parent_id: 0, // 0父级
      menu_status: 1, // 默认状态
      menu_type: 1, // 0->父级；1->子菜单
      is_hide_menu:0,
      remark:''
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
