<template>
  <div class="login-container">
    <!-- 标题和登录内容 -->
    <div class="login-title-container">
      <div class="system-title">后台管理系统</div>
      <div class="login-title">愿将来远胜过往</div>
    </div>
    <el-card class="login-card">
      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="账号登录" name="account">
          <el-form :model="accountForm" :rules="rules" ref="accountFormRef">
            <el-form-item label="账号" prop="account">
              <el-input
                v-model="accountForm.account"
                placeholder="请输入手机号"
              />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="accountForm.password"
                type="password"
                placeholder="请输入密码"
              />
            </el-form-item>
            <el-form-item class="login-button-item">
              <el-button
                type="primary"
                @click="handleAccountLogin"
                :loading="loading"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="验证码登录" name="sms">
          <el-form :model="smsForm" :rules="smsRules" ref="smsFormRef">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="smsForm.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-row :gutter="10">
                <el-col :span="16">
                  <el-input v-model="smsForm.code" placeholder="请输入验证码" />
                </el-col>
                <el-col :span="8">
                  <el-button
                    :disabled="isCodeDisabled"
                    @click="sendVerificationCode"
                    style="width: 100%"
                  >
                    {{ codeButtonText }}
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item class="login-button-item">
              <el-button type="primary" @click="handleSmsLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="微信登录" name="wechat">
          <div class="wechat-login">
            <img src="https://example.com/wechat-qrcode.png" alt="微信二维码" />
            <p>请使用微信扫码登录</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import _http from "@/api/account";
import { setToken } from "@/utils/auth";
const activeTab = ref("account");
const router = useRouter();
const route = useRoute();
import Http_s from "@/api/admin";
import { initDynamicRoutes } from "@/router";
import { ElMessage } from "element-plus";
// 账号登录表单
const accountForm = ref({
  account: "18888888888",
  password: "123456",
});
const loading = ref(false);
// 验证码登录表单
const smsForm = ref({
  phone: "",
  code: "",
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
const rules = {
  account: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const smsRules = {
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { validator: validatePhone, trigger: "blur" },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

const accountFormRef = ref(null);
const smsFormRef = ref(null);

const isCodeDisabled = ref(false); // 是否禁用验证码按钮
const codeButtonText = ref("获取验证码"); // 按钮文字
let countdown = 60; // 倒计时秒数

// 获取验证码
const sendVerificationCode = async () => {
  if (!/^1[3-9]\d{9}$/.test(smsForm.value.phone)) {
    return this.$message.error("请输入正确的手机号");
  }

  isCodeDisabled.value = true;
  codeButtonText.value = `${countdown}秒后重发`;

  // 请求验证码
  try {
    await _http.sendSmsCode(smsForm.value.phone);
    // 启动倒计时
    const interval = setInterval(() => {
      countdown--;
      codeButtonText.value = `${countdown}秒后重发`;
      if (countdown <= 0) {
        clearInterval(interval);
        isCodeDisabled.value = false;
        countdown = 60;
        codeButtonText.value = "获取验证码";
      }
    }, 1000);
  } catch (error) {
    isCodeDisabled.value = false;
    countdown = 60;
    codeButtonText.value = "获取验证码";
    this.$message.error("验证码发送失败");
  }
};

// 账号密码登录
const handleAccountLogin = async () => {
  try {
    const valid = await accountFormRef.value.validate();
    if (!valid) {
      return;
    }
    loading.value = true;
    const loginRes = await _http.login(accountForm.value);
    setToken(loginRes.access_token);
    // 2. 获取菜单
    const menuRes = await Http_s.getMenuList();
    const menuData = menuRes.list;
    // 存储菜单数据到localStorage
    localStorage.setItem("menuData", JSON.stringify(menuData));

    // 3. 初始化动态路由
    const success = await initDynamicRoutes();
    console.log('success', success)
    if (!success) {
      ElMessage.error("路由初始化失败");
      return;
    }

    // 4. 跳转到首页
    ElMessage.success("登录成功");
    router.push("/");
  } catch (error) {
    console.error("登录失败:", error);
    ElMessage.error("登录失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 手机验证码登录
const handleSmsLogin = () => {
  smsFormRef.value.validate((valid) => {
    if (valid) {
      _http.smsLogin(smsForm.value).then((res) => {
        localStorage.setItem("token", res.token);
        const redirect = route.query.redirect || "/";
        router.push(redirect);
      });
    } else {
      console.log("表单校验失败");
    }
  });
};
</script>

<style scoped>
.login-container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  padding-top: 20vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  box-sizing: border-box;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.login-title-container {
  text-align: center;
  margin-bottom: 20px;
}

.system-title {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.login-title {
  font-size: 18px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.login-card {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  width: 100%;
}

.el-button {
  width: 100%;
  height: 40px;
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  font-size: 16px;
}

.el-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.wechat-login {
  text-align: center;
}

.wechat-login img {
  width: 200px;
  height: 200px;
}

.login-button-item .el-form-item__content {
  margin-left: 0 !important;
  /* 去掉默认的左边距 */
}

.login-button-item .el-button {
  width: 100%;
  height: 40px;
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  font-size: 16px;
  margin-left: 51px;
}

.login-button-item .el-button:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style>
