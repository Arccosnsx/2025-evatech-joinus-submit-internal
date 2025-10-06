<template>
  <div class="sentiment-container card-large">
    <h2>情感分析</h2>
    <div class="sentiment-grid">
      <!-- 第一行：图片和评论 -->
      <div class="row">
        <div class="image-card">
          <h3 class="image-title">三维情感视图</h3>
          <VisualizationChart :St_id="data.fileName" />
        </div>
        <div class="card comments-card">
          <h3 class="comments-title">评论</h3>
          <div class="comments-header">
            <span class="header-index">序号</span>
            <span class="header-content">评论详情</span>
          </div>
          <div class="comments-list">
            <ul>
              <li v-for="(comment, index) in data.comments" :key="index">
                <span class="comment-index">{{ index + 1 }}</span>
                <span class="comment-content">{{ comment }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 第二行：认知偏向、情绪倾向、主导情绪 -->
      <div class="row">
        <!-- 认知偏向 -->
         <div class="card-row2 per-card">
          <div class="per-num-1">{{data.cognitiveBias}}</div>
          <SemiCircleProgress
          :percentage="data.cognitiveBias"
          :color="'#88C3FF,#CDFCFF,#8D61FF'"
        />
          <div class="per-title">认知偏向</div>
       </div>
        <!-- 情感倾向 -->
         <div class="card-row2 per-card">
          <div class="per-num-2">{{data.emotionalTendency}}</div>
          <SemiCircleProgress
          :percentage="data.emotionalTendency"
          :color="'#75E1A8,#CDFFE4,#FFC5C5,#FF6B6B'"
        />
        <div class="per-title">情感倾向</div>
       </div>
        <!-- 主导情绪 -->
        <DominantEmotion
    :emotions="data.dominantEmotion"
    class="card-row2 large-card"/>
      </div>
    </div>
  </div>
</template>

<script>
import SemiCircleProgress from "./SemiCircleProgress.vue";
import DominantEmotion from "./DominantEmotion.vue";
import VisualizationChart from './VisualizationChart.vue'

export default {
  components: {
    SemiCircleProgress,
    DominantEmotion,
    VisualizationChart
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dominantEmotion() {
      const maxValue = Math.max(...this.data.dominantEmotion);
      const index = this.data.dominantEmotion.indexOf(maxValue);
      return this.emotionLabels[index];
    },
    emotionLabels() {
      return ["惊喜值", "恐惧值", "厌恶值", "愉悦值", "悲伤值", "愤怒值"];
    },
  },
};
</script>

<style scoped>
/* 主组件样式保持不变 */
.sentiment-container {
  flex: 1;
}

.sentiment-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: flex;
  gap: 2rem;
  margin-right: 16px;
  margin-left: 16px;
}

.row > :first-child {
  flex: 1;
}

.row > :nth-child(2) {
  flex: 1;
}

.row > :last-child {
  flex: 4;
}

.image-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 50%;
  max-width: 40%;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 10px 4px rgba(0, 0, 0, 0.1);
}

.image-title {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  z-index: 1;
  font-size: 28px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-image: none;
  background-size: cover;
  background-position: center;
}

.comments-card {
  display: flex;
  flex-direction: column;
  max-height: 320px;
  max-width: 60%;
  overflow: hidden;
  padding: 10px;
}

.comments-title {
  margin-bottom: 20px;
  text-align: left;
  font-size: 32px;
  margin-left: 8px;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;

  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.header-index {
  flex: 1;
  text-align: left;
  font-size: 18px;
  color: #828282;
  font-weight: lighter;
}

.header-content {
  flex: 3;
  text-align: left;
  font-size: 18px;
  color: #828282;
  font-weight: lighter;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
}

.comments-list ul {
  list-style: none;
  padding: 4px;
  margin: 0;
}

.comments-list li {
  display: flex;
  justify-content: space-between;
  padding: 12px 1rem;
  border-bottom: 1px solid #eee;
}

.comment-index {
  flex: 1;
  text-align: left;
}

.comment-content {
  flex: 9;
  text-align: left;
}

.comments-list::-webkit-scrollbar {
  width: 2px; /* 滚动条宽度 */
}

.comments-list::-webkit-scrollbar-track {
  background: #ffffff; /* 滚动条轨道背景 */
  border-radius: 4px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: #146AF466; /* 滚动条滑块颜色 */
  border-radius: 1px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: #146AF488; /* 滚动条滑块悬停颜色 */
}

.small-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
}

.large-card {
  flex: 5;
}

.per-card {
  display: flex;
  flex-direction: column; /* 竖排 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  text-align: center; /* 文本居中 */
}

.per-num-1 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #5A8EE1;
}

.per-num-2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #75E1A8;
}

.per-title {
  font-size: 16px;
  font-weight: 400;
  margin-top: 10px; /* 调整上下间距 */
  color: #6D6B6B;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px 4px rgba(0, 0, 0, 0.1);
}

.card-row2 {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px 4px rgba(0, 0, 0, 0.1);
  height: 40%;
}

h2 {
  margin: 0 0 1rem 2rem;
  font-size: 36px;
  color: #333;
  font-family: Microsoft JhengHei UI;
}

h3,
h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #555;
  font-family: Microsoft JhengHei UI;
}

p {
  margin: 0;
  color: #777;
}

/* 主导情绪板块 */
.emotion-grid {
  display: flex;
  gap: 0.5rem;
}

.emotion-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dominant {
  background: #1467eb;
  color: white;
  border-radius: 4px;
  padding: 0.5rem;
}

.emotion-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.emotion-label {
  font-size: 0.9rem;
  color: #777;
}

.thermometer {
  width: 20px;
  height: 100px;
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
  background: #ff6b6b;
  border-radius: 10px;
}
</style>