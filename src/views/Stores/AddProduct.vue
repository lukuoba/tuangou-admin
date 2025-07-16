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
              placeholder="请输入用户名称"
            />
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
          <el-form-item label="角色" prop="role_id">
            <el-select v-model="form.role_id" placeholder="请选择角色">
              <el-option
                v-for="item in roleData"
                :key="item.id"
                :label="item.role_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺">
            <el-select
              v-model="form.store_id"
              placeholder="请选择店铺"
              filterable
              allow-create
              default-first-option
              remote
              reserve-keyword
              :remote-method="remoteSearch"
              :loading="loading"
            >
              <el-option
                v-for="store in storeList"
                :key="store.id"
                :label="store.store_name"
                :value="store.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户头像">
            <PictureUpload
              v-model="form.user_avatar"
              :max-count="1"
              list-type="picture-card"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10"></el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref } from "vue";
// 表单数据
const form = ref({
  product_name: "",
  phone: "",
  remark: "",
  // password: "123456", // 默认密码
  user_status: 1, // 默认状态
  user_key: "",
  user_avatar: [],
  store_id: null,
});
// 表单校验规则
const rules = {
  product_name: [{ required: true, message: "请输入账号", trigger: "blur" }],
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
</script>
<style>
h4 {
  margin-bottom: 20px;
}
</style>
