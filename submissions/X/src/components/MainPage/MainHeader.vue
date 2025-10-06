<template>
  <div class="header-container">
    <div class="header-content">
      <!-- 第一行：Logo 和标题 -->
      <div class="top-row">
        <h1 class="title">产品预警</h1>
        <div class="logo-section">

          <img src="/logo.png" alt="Logo" class="logo" />
        </div>
      </div>

      <!-- 第二行：搜索栏和视图切换栏 -->
      <div class="bottom-row">
        <div class="search-section">
          <div class="search-input-container">
            <font-awesome-icon icon="search" class="search-icon" />
            <input type="text" placeholder="请输入搜索热点" v-model="searchQuery" class="search-input" />
          </div>
          <button class="filter-button">
            <font-awesome-icon icon="filter" />
            <span class="filter-text">筛选</span>
          </button>
        </div>
        <div class="view-controls">
          <button v-for="(mode, index) in viewModes" :key="index" @click="changeView(mode.type)"
            :class="{ active: currentView === mode.type }">
            <font-awesome-icon :icon="mode.icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const viewModes = [
  { type: "list", icon: "fa-solid fa-list" },
  { type: "table", icon: "fa-solid fa-table" },
  { type: "grid", icon: "fa-solid fa-grip" },
];

const currentView = ref("list");

const changeView = (type) => {
  currentView.value = type;
};
</script>

<style scoped>
.header-container {
  height: 120px;
  /* 增加高度以容纳两行内容 */
  padding: 12px 24px;
}

.header-content {
  background: white;
  border-radius: 12px;
  padding: 10px 24px;
  display: flex;
  flex-direction: column;
  /* 垂直排列两行 */
  gap: -3px;
  /* 两行之间的间距 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 第一行：Logo 和标题 */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 15px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Logo 和文字之间的间距 */
}

.logo {
  width: 180px;
  height: auto;
  border-radius: 8px;
}

.logo-text {
  font-size: 30px;
  font-weight: bold;
  color: #333;
  letter-spacing: 2px;
  font-family: "Lucida Calligraphy", cursive, serif, sans-serif;
}

.title {
  font-size: 40px;
  /* 调整字体大小 */
  font-weight: 700;
  /* 加粗 */
  color: #333;
  margin: 0;
  letter-spacing: 16px;
  font-family: Microsoft JhengHei UI;
}

/* 第二行：搜索栏和视图切换栏 */
.bottom-row {
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* 搜索栏和视图切换栏分别靠左和靠右 */
}

.search-section {
  display: flex;
  align-items: center;
  gap: 8px;
  /* 搜索栏和筛选按钮之间的间距 */
}

.search-input-container {
  display: flex;
  align-items: center;
  /* 垂直居中 */
  border: 1px solid #ccc;
  /* 搜索栏边框 */
  border-radius: 8px;
  /* 圆角 */
  padding: 8px;
  /* 内边距 */
  background-color: white;
  /* 背景色 */
  width: 300px;
  /* 固定搜索栏宽度 */
}

.search-icon {
  margin-right: 8px;
  /* 图标与输入框的间距 */
  color: #666;
  /* 图标颜色 */
}

.search-input {
  flex: 1;
  /* 输入框占据剩余空间 */
  border: none;
  /* 去除默认边框 */
  outline: none;
  /* 去除聚焦时的边框 */
}

.filter-button {
  width: 90px;
  height: 35px;
  border: 1px solid #ccc;
  /* 灰色描边 */
  border-radius: 8px;
  background: transparent;
  /* 透明背景 */
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  /* 让图标和文字在同一行 */
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
  /* 水平居中 */
  gap: 12px;
  /* 图标和文字之间的间距 */
}

.filter-button:hover {
  background: #f5f5f5;
  /* 悬停时背景变为浅灰色 */
}

.filter-text {
  font-size: 16px;
  font-weight: normal;
  /* 修正为正常字体粗细 */
  color: #666;
  /* 文字颜色改为灰色 */
}

.view-controls {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  /* 灰色背景 */
  padding: 4px;
  /* 内边距 */
  border-radius: 8px;
  /* 圆角 */
  width: 149px;
  height: 40px;
  margin-left: 10px;
}

.view-controls button {
  width: 40px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: transparent;
  /* 透明背景 */
  margin-left: 5px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.view-controls button.active {
  background: white;
  /* 选中项白色背景 */
  color: #146AF4;
  /* 选中项文字颜色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* 选中项阴影 */
}
</style>
