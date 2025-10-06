<template>
  <div class="foresight-container card-large">
    <h2>深度预见</h2>
    <div class="foresight-grid">
      <!-- 第一行：图片和评论 -->
      <div class="row">
        <div class="image-card">
          <h3>信息流图</h3>
          <div class="infoFlow-card">
            <InfomationFlowSimple :infoFlowChart="data.infoFlowChart" />
          </div>
        </div>
        <div class="future-trend-card">
          <div class="trend-title"> 未来趋势预测 </div>
          <div class="trend-content">
            <p>{{ data.trend }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InfomationFlowSimple from "../Public/InfomationFlowSimple.vue"

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: {
    InfomationFlowSimple
  }
};
</script>

<style scoped>
/* 主容器样式 */
.foresight-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;

}

.foresight-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.row {
  display: flex;
  gap: 2rem;
  flex: 1;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}

/* 图片卡片样式 */
.image-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 24px;
  background: linear-gradient(to bottom, #eef8ff, white);
}

.image-placeholder {
  flex: 1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

/* 未来趋势预测卡片样式 */
.future-trend-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #eef8ff, white);
  border-radius: 8px;
  padding: 1rem;

}

.trend-title {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  align-self: center;
  margin-top: 15%;
  /* 标题靠下 */
  font-family: Microsoft JhengHei UI;
  border-bottom: 1px solid #ddd;
  width: 90%;
  letter-spacing: 6px;
}

.trend-content {
  flex: 1;
  padding: 0 0;
  overflow-y: auto;
  /* 内容过多时启用滚动 */
  white-space: pre-line;
}

.trend-content p {
  margin-left: 5%;
  margin-right: 5%;
  color: #000000;
  font-size: 16px;
}

/* 标题样式 */
h2 {
  margin: 0 0 1rem 1.5rem;
  font-size: 36px;
  color: #333;
  font-family: Microsoft JhengHei UI;
  letter-spacing: 7px;
}

h3 {
  margin: 0 0 0.75rem 0;
  font-size: 32px;
  color: #000000;
  font-family: Microsoft JhengHei UI;
  letter-spacing: 8px;
}

p {
  font-size: 18px;
  color: #000000;
  font-weight: 400;
  letter-spacing: 1px;
  line-height: 150%;
}

.infoFlow-card{
  margin-top: 40px;
  height: 300px;
}
</style>