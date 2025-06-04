<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="500px"
    :before-close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <!-- 账号输入框 -->
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号" />
      </el-form-item>

      <!-- 手机号码输入框 -->
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号码" />
      </el-form-item>

      <!-- 密码输入框 -->
      <el-form-item label="密码" prop="password" v-if="!editId">
        <el-input
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
          show-password
        />
      </el-form-item>

      <!-- 权限下拉选择框 -->
      <el-form-item label="权限" prop="role">
        <el-select v-model="form.role" placeholder="请选择权限">
          <el-option label="超级管理员" value="admin" />
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
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

// 弹窗显示状态
const dialogVisible = ref(false)

const { title, editId, editData } = defineProps({
  title:{
    type:String,
    default:'新增账号'
  },
  editId:{
    type:String,
    default:'',
  },
  editData:{
    type:Object,
    default:undefined
  }
})

// 表单数据
const form = ref({
  username: '',
  phone: '',
  password: '123456', // 默认密码
  role: 'common', // 默认权限
  status: 'start' // 默认状态
})

// 表单校验规则
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择权限', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 表单引用
const formRef = ref(null)

// 定义 emit
const emit = defineEmits(['addaccount'])

// 打开弹窗
  const openDialog = () => {
    dialogVisible.value = true;
    console.log('id', editId, editData)
    if(editId){
      form.value = { ...editData }; // 使用解构赋值创建新对象，避免引用问题
    }else{
    form.value = { username: '', phone: '', password: '123456', role: 'common', status: 'start' }; 
    }
  }

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  formRef.value.resetFields() // 重置表单
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('表单数据', form.value)
      emit('addaccount', form.value) // 触发父组件的 addaccount 方法
      handleClose() // 关闭弹窗
    } else {
      console.log('表单校验失败')
    }
  })
}

// 暴露方法
defineExpose({ openDialog })
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
