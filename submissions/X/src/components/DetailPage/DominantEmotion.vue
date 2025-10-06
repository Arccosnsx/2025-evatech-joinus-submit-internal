<template>
  <div class="emotion-container">
    <div class="emotion-grid">
      <!-- 主导情绪 -->
      <div class="emotion-column">
        <!-- 第一行：主导情绪（英文 + 数值） -->
        <div class="dominant-emotion-box">
          <div class="dominant-emotion">
            {{ dominantEmotionLabelEng }} {{ dominantEmotionValue }}
          </div>
        </div>
        <!-- 第二行：显示“主导情绪”文字 -->
        <div class="dominant-label">
          主导情绪
        </div>
      </div>
      <!-- 温度计和数值 -->
      <div 
        class="emotion-column" 
        v-for="(value, index) in emotions" 
        :key="index"
      >
        <div class="thermometer-container">
          <!-- 温度计 -->
          <div 
            class="thermometer" 
            :style="{
              '--value': value,
              '--color': emotionColors[index]
            }"
          ></div>
          <!-- 数值 -->
          <div 
            class="value-label" 
            :style="{ 
              bottom: `calc(${value}% + 4px)`, 
              color: emotionColors[index] 
            }"
          >
            {{ value }}
          </div>
        </div>
        <!-- 温度计名称 -->
        <div 
          class="emotion-label" 
          :style="{ color: emotionColors[index] }"
        >
          {{ emotionLabels[index] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    emotions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      emotionLabels: ["惊喜值", "恐惧值", "厌恶值", "愉悦值", "悲伤值", "愤怒值"], // 中文标签
      emotionLabelsEng: ["Surprise", "Fear", "Hate", "Joy", "Sadness", "Anger"], // 英文标签
      emotionColors: [
        '#8D61FF', 
        '#594581', 
        '#1467EB', 
        '#75E1A8', 
        '#88C3FF', 
        '#FF6B6B'  
      ]
    }
  },
  computed: {
    // 主导情绪名称（中文）
    dominantEmotionLabel() {
      const maxValue = Math.max(...this.emotions);
      const index = this.emotions.indexOf(maxValue);
      return this.emotionLabels[index];
    },
    // 主导情绪名称（英文）
    dominantEmotionLabelEng() {
      const maxValue = Math.max(...this.emotions);
      const index = this.emotions.indexOf(maxValue);
      return this.emotionLabelsEng[index];
    },
    // 主导情绪数值
    dominantEmotionValue() {
      return Math.max(...this.emotions);
    }
  }
}
</script>

<style scoped>
.emotion-container {
  padding: 1rem;
}

.emotion-grid {
  display: flex;
  gap: 0.5rem;
  height: 100%;
}

.emotion-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

/* 主导情绪盒子 */
.dominant-emotion-box {
  background: #1467eb; /* 蓝色背景 */
  color: white; /* 白色文字 */
  border-radius: 10px;
  padding: 8px 16px;
  text-align: center;
  margin-top: 10%;
  margin-bottom: 20%; /* 与第二行的间距 */
  box-shadow: inset 0 0 2px 2px;
}

.dominant-emotion {
  font-size: 20px;
  font-weight: bold;
}

/* 第二行：“主导情绪”文字 */
.dominant-label {
  font-size: 16px;
  color: #333; /* 深灰色文字 */
  text-align: center;
}

/* 温度计容器 */
.thermometer-container {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.thermometer {
  width: 7px;
  height: 70px;
  background: #e0e0e0;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.thermometer::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(var(--value) * 1%);
  background: var(--color);
  border-radius: 10px;
  transition: height 0.3s ease;
}

/* 数值显示 */
.value-label {
  position: absolute;
  left: 15px;
  font-size: 12px;
  font-weight: bold;
  transform: translateY(50%);
  white-space: nowrap;
}

/* 温度计名称 */
.emotion-label {
  font-size: 15px;
  text-align: center;
  margin-top: 8px;
  font-weight: bold;
}
</style>