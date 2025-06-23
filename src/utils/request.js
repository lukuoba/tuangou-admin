// src/utils/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router' // 确保已正确配置路由实例
const baseURL = import.meta.env.VITE_API_BASE_URL || '';
// 创建axios实例
const request = axios.create({
  baseURL:  baseURL,
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 统一添加认证 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 如果需要 Content-Type 可以在这里统一设置
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 处理业务成功响应 (code === 200)
    if (response.data?.code === 200) {
      return response.data.data // 直接返回业务数据
    }
    // 处理业务异常 (如 code !== 200)
    handleBusinessError(response.data)
    return Promise.reject(response.data)
  },
  (error) => {
    // 处理 HTTP 错误 (如 401, 500 等)
    handleHttpError(error)
    return Promise.reject(error)
  }
)

/**
 * 处理业务逻辑错误
 */
function handleBusinessError(responseData) {
  const { code, message = '请求失败' } = responseData || {}
  
  // 特殊处理 401 未授权
  if (code === 401) {
    return handleUnauthorized()
  }
  
  // 其他业务错误统一提示
  ElMessage.error(message)
}

/**
 * 处理 HTTP 错误
 */
function handleHttpError(error) {
  if (!error.response) {
    // 网络错误或请求超时
    ElMessage.error(error.message || '网络连接异常')
    return
  }

  const { status, data } = error.response
  
  switch (status) {
    case 401:
      handleUnauthorized()
      break
    case 500:
      ElMessage.error(data?.message || '服务器内部错误')
      break
    default:
      ElMessage.error(data?.message || `请求错误: ${status}`)
  }
}

/**
 * 统一处理 401 未授权
 */
function handleUnauthorized() {
  // 1. 清除本地认证信息
  localStorage.removeItem('token')
  
  // 2. 显示提示
  ElMessage.error('登录已过期，请重新登录')
  
  // 3. 跳转到登录页
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  })
}

export default request