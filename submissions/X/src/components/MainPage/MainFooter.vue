<template>
  <div class="footer-root">
    <div class="footer-card">
      <!-- 背景圆形 -->
      <div class="circle circle-sharp"></div>
      <div class="circle circle-blur"></div>

      <!-- 风险总数卡片 -->
      <div class="stat-card total">
        <div class="card-content">
          <div class="stat-label">{{ getLabel('total') }}</div>
          <div class="stat-data">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-compare">+33% 较上月</span>
          </div>
        </div>
      </div>

      <!-- 其他卡片组件 -->
      <RiskCard
        v-for="(value, key) in filteredStats"
        :key="key"
        :type="key"
        :value="value"
      />
    </div>
  </div>
</template>

<script setup>
import { computed,defineProps } from 'vue'
import RiskCard from './RiskCard.vue'

const props = defineProps(['stats'])

// 过滤掉风险总数，只保留高风险、中风险、低风险
const filteredStats = computed(() => {
  const { total, ...rest } = props.stats
  return rest
})

const getLabel = (key) => {
  const labels = {
    total: '风险总数',
    high: '高风险数',
    medium: '中风险数',
    low: '低风险数',
  }
  return labels[key]
}
</script>

<style scoped>
.footer-root {
  position: relative;
  overflow: hidden;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
}

.footer-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  display: flex;
  gap: 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  height: 205px;
}

/* 背景圆形 */
.circle {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
}

.circle-sharp {
  width: 100px;
  height: 100px;
  background: linear-gradient(
    to bottom, 
    #6F9FFF, 
    #C8E7FF 
  );
  filter: blur(18.7px);
  bottom: 12%;
  left: 15%;
}

.circle-blur {
  width: 50px;
  height: 50px;
  background: linear-gradient(
    to bottom, 
    #4F7FFF, 
    #C0D1FF 
  );
  top: 7%;
  left: 12%;
}

/* 风险总数卡片 */
.stat-card.total {
  flex: 1;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 30px;
  margin-top: 40px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(230, 230, 230, 0.064);
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
}

/* 左上部分：标题 */
.stat-label {
  font-size: 24px;
  color: #000;
  align-self: flex-start;
}

/* 左下部分：数据与较上月 */
.stat-data {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

/* 数据 */
.stat-value {
  font-size: 44px;
  font-weight: 700;
  position: relative;
  background: linear-gradient(
    to top, 
    #146AF4, /* 起始颜色 */
    #88C3FF  /* 结束颜色 */
  );
  -webkit-background-clip: text; /* 将背景裁剪为文字 */
  -webkit-text-fill-color: transparent; /* 使文字透明 */
  background-clip: text;
  color: transparent; /* 兼容性 */
}

/* 较上月 */
.stat-compare {
  font-size: 17px;
  color: #828282;
  margin-left: auto
}
</style>
s