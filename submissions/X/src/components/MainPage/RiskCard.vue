<template>
  <div class="stat-card" :class="type">
    <!-- 背景叠加卡片 -->
    <div class="card-background" :class="type"></div>
    <div class="card-background-light" :class="type"></div>
    <div class="card-background-blur" :class="type"></div>

    <!-- 卡片内容 -->
    <div class="card-content">
      <div class="stat-label">{{ getLabel(type) }}</div>
      <div class="stat-data">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-compare">+33% 较上月</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  type: String, // 卡片类型：high, medium, low
  value: Number, // 卡片值
})

const getLabel = (type) => {
  const labels = {
    high: '高风险数',
    medium: '中风险数',
    low: '低风险数',
  }
  return labels[type]
}
</script>

<style scoped>
.stat-card {
  flex: 1;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: visible; /* 允许子元素超出 */
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px;
  margin-top: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(230, 230, 230, 0.064);
  
}

/* 背景叠加卡片 */
.card-background,
.card-background-light,
.card-background-blur {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.card-background {
  top: 0px;
  right: 0px;
  z-index: 3;
  backdrop-filter: blur(16px);
}

.card-background-light {
  top: -10px;
  right: -8px;
  z-index: 2;
  backdrop-filter: blur(16px);
}

.card-background-blur {
  top: -20px;
  right: -16px;
  z-index: 1;
  
}

/* 高风险数卡片 */
.high .card-background {
  background: #EBEEFFCC;
  box-shadow: inset -2px 2px 4px 2px #FFFFFF80;
  
}

.high .card-background-light {
  background: #1861D5;
  box-shadow: inset -2px 2px 8px 8px #FFFFFF80;
  opacity: 0.8;
}

.high .card-background-blur {
  background: #BCD6FF;
  box-shadow: inset -2px 2px 10px 8px #FFFFFF80;
}

.high .stat-value {
  color: #1467EB;
}

/* 中风险数卡片 */
.medium .card-background {
  background: #E3F1FFCC;
  box-shadow: inset -2px 2px 4px 2px #FFFFFF80;
}

.medium .card-background-light {
  background: #70A7FF;
  box-shadow: inset -2px 2px 10px 8px #FFFFFF80;
  opacity: 0.8;
}

.medium .card-background-blur {
  background: #D2E8FF;
  box-shadow: inset -2px 2px 10px 8px #FFFFFF80;
}

.medium .stat-value {
  color: #88C3FF;
}

/* 低风险数卡片 */
.low .card-background {
  background: #ECECECCC;
  box-shadow: inset -2px 2px 4px 2px #FFFFFF80;
}

.low .card-background-light {
  background: #AFAFAF;
  box-shadow: inset -2px 2px 10px 8px #FFFFFF80;
  opacity: 0.8;
}

.low .card-background-blur {
  background: #E4E4E4;
  box-shadow: inset -2px 2px 10px 8px #FFFFFF80;
}

.low .stat-value {
  color: #000000;
}

/* 卡片内容布局 */
.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 4;
}

/* 左上部分：标题 */
.stat-label {
  margin-top: 7px;
  margin-left: 10px;
  font-size: 20px;
  color: #000;
  align-self: flex-start;
}

/* 左下部分：数据与较上月 */
.stat-data {
  margin-left: 10px;
  display: flex;
  align-items: baseline;
  gap: 16px;
}

/* 数据 */
.stat-value {
  font-size: 44px;
  font-weight: 700;
  position: relative;
}

/* 较上月 */
.stat-compare {
  font-size: 17px;
  color: #828282;
  margin-left: auto;
}
</style>
