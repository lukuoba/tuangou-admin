<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="登录" name="first">登录</el-tab-pane>
      <el-tab-pane label="操作" name="second">操作</el-tab-pane>
    </el-tabs>
  </template>
  <script>
    export default {
      data() {
        return {
          activeName: 'first'
        };
      },
      methods: {
        handleClick(tab, event) {
          console.log(tab, event);
        }
      }
    };
  </script>