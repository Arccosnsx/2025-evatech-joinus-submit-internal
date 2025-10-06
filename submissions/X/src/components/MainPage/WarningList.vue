<template>
  <div class="warning-list-container">
    <!-- 标题栏 -->
    <div class="header-row">
      <div v-for="header in headers" :key="header" class="header-cell">
        {{ header }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="warning-list-content">
      <div 
        v-for="warning in warnings" 
        :key="warning.id" 
        class="warning-item"
      >
        <div class="warning-id">{{ warning.id }}</div>
        <div class="topic">{{ warning.topic }}</div>
        <div class="product">
          <span>{{ warning.product }}</span>
        </div>
        <div class="priority">
          <span :class="warning.priority.toLowerCase()">
            {{ warning.priority }}
          </span>
        </div>
        <div class="date">{{ warning.date }}</div>
         <button class="details-button" @click="goToProduct(warning.id)"></button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  warnings: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

// 跳转到产品详情页
const goToProduct = (id) => {
  router.push(`/warning/${id}`) 
}

const headers = ['预警编号', '热点话题', '产品', '优先级', '日期', '详情']
</script>

<style scoped>
.warning-list-container {
  height: calc(80vh - 210px); /* 自适应高度，留出底部空间 */
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 隐藏溢出内容 */
}

.header-row {
  display: grid;
  grid-template-columns: 100px 5fr 1fr 1fr 1fr 100px;
  gap: 20px;
  padding: 20px;
  background: #f1f1f1;
  border-radius: 8px 8px 0 0; /* 仅顶部圆角 */
  font-weight: bold;
  flex-shrink: 0; /* 防止标题栏被压缩 */
  font-size: large;
}

.warning-list-content {
  flex: 1; /* 内容区域占据剩余空间 */
  overflow-y: auto; /* 内容超出时显示滚动条 */
}

.warning-list-content::-webkit-scrollbar {
  width: 4px; /* 滚动条宽度 */
}

.warning-list-content::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 4px;
}

.warning-list-content::-webkit-scrollbar-thumb {
  background: #146AF499;
  border-radius: 1px;
}

.warning-list-content::-webkit-scrollbar-thumb:hover {
  background: #146AF488;
}

.warning-item {
  display: grid;
  grid-template-columns: 100px 5fr 1fr 1fr 1fr 100px;
  gap: 20px; /* 确保列间距一致 */
  padding: 20px;
  height: 60px;
  border-bottom: 1px solid #eee;
}


/* 单独设置各栏字体与大小 */
.warning-id {
  font-size: 14px;
  color: #666;
}

.topic {
  font-size: 16px;
}

.product span {
  font-size: 14px;
  display: inline-block;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.priority span {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 4px;
  color: white;
}

.high { background: #1467EB; }
.medium { background: #88C3FF; }
.low { background: #C5C5C5; }

.date {
  font-size: 16px;
  color: #666;
  letter-spacing: 0.5px;
}

.details-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  padding: 0;
  position: relative;
}

.details-button::after {
  content: "···";
  position: absolute;
  top: 50%;
  left: 85%;
  transform: translate(-50%, -50%);
}
</style>
