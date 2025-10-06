<template>
  <div class="warning-container card-large">
    <h2>警示信息</h2>
    <div class="warning-grid">
      <!-- 第一行：警示信息编号与内容 -->
      <div class="card full-width">
        <div class="warning-header">
          <div class="icon-column icon-big">
            <font-awesome-icon :icon="priorityIcon" :class="priorityIconClass" />
          </div>
          <div class="content-column">
            <div class="warning-number">{{ data.fileName }}</div>
            <p>{{ data.message }}</p>
          </div>
        </div>
      </div>

      <!-- 第二行：产品信息和优先级 -->
      <div class="sub-row">
        <div class="card">
          <h4>对应产品</h4>
          <p>{{ data.product }}</p>
        </div>
        <div class="card">
          <h4>优先级</h4>
          <div class="priority" :class="data.priority.toLowerCase()">
            <i :class="`fas fa-${priorityIcon}`"></i>
            <span>{{ data.priority }}</span>
          </div>
        </div>
      </div>

      <!-- 第三行：警报时间与警报值 -->
      <div class="sub-row">
        <div class="card">
          <h4>警报时间</h4>
          <p>{{ data.alertTime }}</p>
        </div>
        <div class="card">
          <h4>警报值</h4>
          <p :class="['icon-medium', alertValueClass]">
            <font-awesome-icon :icon="priorityIcon" :class="alertValueClass" />
            {{ data.alertValue }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    priorityIcon() {
      const priority = this.data.priority.toLowerCase();
      console.log(priority);
      switch (priority) {
        case 'high':
          return 'exclamation-triangle';
        case 'medium':
          return 'bell';
        case 'low':
          return 'check';
        default:
          return '';
      }
    },
    priorityIconClass() {
      const priority = this.data.priority.toLowerCase();
      switch (priority) {
        case 'high':
          return 'high-icon';
        case 'medium':
          return 'medium-icon';
        case 'low':
          return 'low-icon';
        default:
          return '';
      }
    },
    alertValueClass() {
      const value = this.data.alertValue;
      if (value >= 80) return 'high-value';
      if (value >= 50) return 'medium-value';
      return 'low-value';
    },
  },
};
</script>

<style scoped>
.icon-big {
  transform: scale(2.5);
}

.icon-medium {
  font-size: 24px
}

.warning-container {
  flex: 1;
}

.warning-grid {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.full-width {
  width: 100%;
}

.sub-row {
  display: flex;
  gap: 1.5rem;
}

.sub-row > * {
  flex: 1;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  padding-left: 30px;
}

h2 {
  margin: 0 0 1rem 0;
  font-size: 36px;
  color: #333;
  font-family: Microsoft JhengHei UI;
}

h4 {
  margin: 0.5rem 0 1rem 0;
  font-size: 16px;
  color: #6D6B6B; /* 小卡片标题使用灰体 */
  font-weight: lighter;

}

.context{
  font-size: 18px;
}

p {
  margin-top: 10px;
  color: #333; /* 警报时间与对应产品使用黑色字体 */
  font-weight: bold;
  font-size: 18px;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 10px;
}

.icon-column {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
}

.content-column {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 10px;
}

.priority {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.9rem 0.5rem 0.9rem;
  border-radius: 8px;
  color: white;
  margin-left: 30%;
  margin-right: 30%;
  font-weight: 700;
}

.priority i {
  font-size: 1rem;
}

.high {
  background: #1467EB;
}

.medium {
  background: #88C3FF;
}

.low {
  background: #C5C5C5;
}

.high-value {
  color: red;
}

.medium-value {
  color: orange;
}

.low-value {
  color: green;
}

.warning-number{
  font-size: 20px;
  font-weight: bold;
}

/* 新增的样式类 */
.high-icon {
  color: #146AF4;
}

.medium-icon {
  color: orange;
}

.low-icon {
  color: green;
}
</style>