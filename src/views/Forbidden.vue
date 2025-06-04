<template>
    <div class="forbidden-container">
      <h1>403 Forbidden</h1>
      <p>抱歉，您没有权限访问此页面</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const goHome = () => {
    router.push('/')
  }
  </script>
  
  <style scoped>
  .forbidden-container {
    text-align: center;
    padding-top: 100px;
  }
  </style>