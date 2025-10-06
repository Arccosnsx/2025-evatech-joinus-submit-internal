<template>
  <div 
    class="progress-bar"
    :style="{
      '--conic-gradient': 'conic-gradient(from '+ progress +'deg at 50% 100%, '+color+')',
    }"
  >
    <div class="vertical-line"></div> <!-- 灰色竖线 -->
  </div>
</template>

<script>
export default {
  name: 'SemiCircleProgress',
  props: {
    percentage: { type: Number, required: true },
    color: { type: String, default: '#88C3FF, #CDFCFF, #8D61FF' } 
  },
  computed: {
    // 将百分比转换为角度
    progress() {
      return 90 - (this.percentage / 100) * 180;
    }
  }
};
</script>

<style scoped>
.progress-bar {
  --conic-gradient: conic-gradient(from 90deg, #63cdda, #ff6b6b); /* 默认锥形渐变 */
  position: relative;
  width: 100px;
  height: 50px;
  border-radius: 100px 100px 0 0;
  overflow: visible; /* 允许内容超出 */
  background: var(--conic-gradient);
  box-shadow: inset 0px 1px 3px white;
}

.progress-bar::before {
  content: "";
  display: block;
  position: absolute;
  top: 25px;
  left: 25px;
  right: 25px;
  height: 25px;
  border-radius: 100px 100px 0 0;
  background-color: #ffffff; /* 内层背景 */
  z-index: 8;
  box-shadow: 0px 1px 3px white;
}

.progress-bar::after {
  content: "";
  display: block;
  position: absolute;
  top: 30px;
  left: 30px;
  right: 30px;
  height: 100px;
  opacity: 0.25;
  border-radius: 200px 200px 0 0;
  z-index: 8;
}

/* 灰色竖线 */
.vertical-line {
  position: absolute;
  top: -5px; /* 超出上半部分 */
  bottom: -10px; /* 超出下半部分 */
  left: 50%; /* 居中 */
  width: 6px; /* 线宽 */
  background-color: #D9D9D9; /* 灰色 */
  border-radius: 3px;
  transform: translateX(-50%); /* 确保完全居中 */
  z-index: 10; /* 确保在最上层 */
}
</style>