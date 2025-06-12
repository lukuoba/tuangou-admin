<template>
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <div class="loading-text">正在检查页面是否存在...</div>
    </div>
  </div>

  <div class="not-found-container" v-else>
    <div class="not-found-content">
      <div class="error-code">404</div>
      <div class="error-message">抱歉，您访问的页面不存在</div>
      <div class="error-description">
        可能的原因：<br />
        • 页面已被删除或移动<br />
        • 您输入的网址有误<br />
        • 页面正在建设中
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>

    <div class="animation-container">
      <div class="astronaut">
        <div class="helmet"></div>
        <div class="body"></div>
        <div class="left-arm"></div>
        <div class="right-arm"></div>
        <div class="left-leg"></div>
        <div class="right-leg"></div>
      </div>
      <div class="stars">
        <div v-for="i in 50" :key="i" class="star" :style="starStyle(i)"></div>
      </div>
      <div class="planet"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
// 在404页面的script部分添加
import { onMounted, ref } from "vue";

const isLoading = ref(true);

onMounted(() => {
  // 模拟加载延迟
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
const router = useRouter();

// 返回首页
const goHome = () => {
  router.push("/");
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 生成星星样式
const starStyle = (index) => {
  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const top = Math.random() * 100;
  const opacity = Math.random() * 0.5 + 0.5;
  const animationDuration = Math.random() * 3 + 2;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    opacity: opacity,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${Math.random() * 5}s`,
  };
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #311b92 100%);
  color: #fff;
  overflow: hidden;
  position: relative;
}

.not-found-content {
  text-align: center;
  z-index: 10;
  max-width: 600px;
  padding: 0 20px;
}

.error-code {
  font-size: 160px;
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  line-height: 1;
}

.error-message {
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 600;
}

.error-description {
  font-size: 18px;
  margin-bottom: 40px;
  line-height: 1.8;
  text-align: left;
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.action-buttons {
  margin-top: 30px;
}

.action-buttons .el-button {
  margin: 0 10px;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.animation-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

/* 宇航员动画 */
.astronaut {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 200px;
  animation: float 6s ease-in-out infinite;
}

.helmet {
  position: absolute;
  top: 0;
  left: 25px;
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 50%;
  box-shadow: inset -8px 0 0 rgba(0, 0, 0, 0.1);
}

.body {
  position: absolute;
  top: 90px;
  left: 35px;
  width: 80px;
  height: 90px;
  background: #fff;
  border-radius: 40% 40% 20% 20%;
}

.left-arm,
.right-arm {
  position: absolute;
  top: 100px;
  width: 30px;
  height: 60px;
  background: #fff;
  border-radius: 15px;
}

.left-arm {
  left: 10px;
  transform-origin: top center;
  animation: left-arm 3s ease-in-out infinite;
}

.right-arm {
  right: 10px;
  transform-origin: top center;
  animation: right-arm 3s ease-in-out infinite;
}

.left-leg,
.right-leg {
  position: absolute;
  top: 170px;
  width: 30px;
  height: 60px;
  background: #fff;
  border-radius: 15px;
}

.left-leg {
  left: 40px;
  transform-origin: top center;
  animation: left-leg 4s ease-in-out infinite;
}

.right-leg {
  right: 40px;
  transform-origin: top center;
  animation: right-leg 4s ease-in-out infinite;
}

/* 星球 */
.planet {
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(255, 107, 107, 0.6);
  animation: rotate 30s linear infinite;
}

/* 星星 */
.stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  animation: twinkle infinite alternate;
}

@keyframes float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-20px);
  }
}

@keyframes left-arm {
  0%,
  100% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(-20deg);
  }
}

@keyframes right-arm {
  0%,
  100% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(20deg);
  }
}

@keyframes left-leg {
  0%,
  100% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(15deg);
  }
}

@keyframes right-leg {
  0%,
  100% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(-15deg);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-container {
    flex-direction: column;
    text-align: center;
  }

  .animation-container {
    opacity: 0.3;
  }

  .error-code {
    font-size: 120px;
  }

  .error-message {
    font-size: 24px;
  }

  .error-description {
    font-size: 16px;
    text-align: center;
  }

  .astronaut {
    transform: translate(-50%, -50%) scale(0.7);
  }

  .planet {
    width: 300px;
    height: 300px;
  }
}
</style>
