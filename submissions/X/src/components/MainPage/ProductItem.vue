<template>
  <div 
    class="product-item"
    :class="{ active: isActive }"
    @click="handleClick"
  >
    <!-- 默认背景衬底 -->
    <div class="default-background" :style="defaultBackgroundStyle"></div>
    <!-- 图标和文字 -->
    <div class="content-wrapper">
      <span class="priority-mark">
        <font-awesome-icon :icon="priorityIcon" :style="priorityIconStyle" />
      </span>
      <span class="product-name" :style="productNameStyle">
        {{ product.name }}
      </span>
    </div>
    <!-- 选中覆盖层 -->
    <div class="active-overlay" v-if="isActive" :style="activeOverlayStyle"></div>
    <!-- 选中竖线 -->
    <span class="selected-line" v-if="isActive" :style="priorityStyle"></span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', props.product.id)
}

const priorityStyle = computed(() => ({
  backgroundColor: {
    High: '#1467EB',
    Medium: '#2196f3',
    Low: '#4caf50'
  }[props.product.priority]
}))

const priorityIcon = computed(() => ({
  High: 'exclamation-triangle',
  Medium: 'bell',
  Low: 'check'
})[props.product.priority])

const priorityNameStyle = computed(() => ({
  color: {
    High: '#1467EB',
    Medium: '#2196f3',
    Low: '#4caf50'
  }[props.product.priority]
}))


const priorityIconStyle = computed(() => ({
  color: {
    High: '#DE5454',
    Medium: '#FFCD29',
    Low: '#75E1A8'
  }[props.product.priority]
}))

const defaultBackgroundStyle = computed(() => ({
  backgroundColor: {
    High: '#A3D1FF',
    Medium: '#E4F1FF',
    Low: 'rgba(240, 240, 240, 1)'
  }[props.product.priority],
  width: props.isActive ? '85%' : '90%', // 选中时变小
  height: props.isActive ? '65%' : '70%', // 选中时变小
  left: props.isActive ? '5%' : '3%', // 选中时变小
  top: props.isActive ? '20%' : '15%' // 选中时调整位置
}))

const activeOverlayStyle = computed(() => ({
  backgroundColor: {
    High: '#A3D1FF4D',
    Medium: 'rgba(33, 150, 243, 0.2)',
    Low: 'rgba(76, 175, 80, 0.2)'
  }[props.product.priority]
}))

const productNameStyle = computed(() => ({
  color: props.isActive ? priorityNameStyle.value.color : '#333'
}))
</script>

<style scoped>
.product-item {
  padding: 12px 16px;
  margin: 0px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  position: relative;
  cursor: pointer;
  height: 60px
}

.content-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1; /* 确保内容在背景上方 */
}

.priority-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px; /* 调整图标到按钮左侧的距离 */
  z-index: 10001;
}

.product-name {
  color: #333; /* 默认字体颜色为黑色 */
  font-size: 18px;
  font-weight: 600;
  font-family: DingTalk Sans;
}

.default-background {
  position: absolute;
  border-radius: 8px;
  z-index: 0; /* 默认背景在内容下方 */
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1); /* 添加过渡效果 */
}

.active-overlay {
  position: absolute;
  top: 0;
  left: 0px; /* 覆盖整个侧边栏宽度 */
  width: 100%; /* 覆盖整个侧边栏宽度 */
  height: 100%;
  z-index: 1; /* 选中覆盖层在默认背景上方 */
}

.selected-line {
  position: absolute;
  right: 5px; /* 与侧边栏对齐 */
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 80%;
  border-radius: 2px;
  z-index: 2; /* 竖线在最上层 */
}

.product-item.active .content-wrapper {
  transform: scale(0.95); /* 选中时缩小 */
}
</style>
