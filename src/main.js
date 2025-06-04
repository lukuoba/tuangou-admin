import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { setupRoutes } from "@/router";
// 初始化时加载用户角色
const role = localStorage.getItem('userRole')
if (role) {
  setupRoutes(role)
}
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    return '/login'
  }
})
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')