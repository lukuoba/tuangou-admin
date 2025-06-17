import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './assets/commonStyls.css'
// import { setupRoutes } from "@/router";

// if (role) {
//   setupRoutes(role)
// }
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')