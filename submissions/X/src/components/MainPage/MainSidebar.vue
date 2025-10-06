<template>
  <div class="sidebar-container">
    <div class="sidebar-card">
      <h2 class="title">企业产品</h2>
      <div class="product-scroll">
        <ProductItem v-for="product in products" :key="product.id" :product="product"
          :isActive="selectedProduct === product.id" @select="selectProduct" />
        <button class="add-button" @click="showAddDialog = true">
          <font-awesome-icon icon="plus" />
        </button>
      </div>

      <div class="total-card">
        <span class="label">产品</span>
        <span class="sub-label">总数 Total</span>
        <span class="value">{{ products.length }}</span>
      </div>
    </div>

    <!-- 添加产品对话框 -->
    <div v-if="showAddDialog" class="dialog-overlay">
      <div class="add-product-dialog">
        <h3>添加新产品</h3>
        <input v-model="newProductName" type="text" placeholder="输入产品名称" class="product-input" />
        <div class="dialog-buttons">
          <button class="cancel-button" @click="cancelAdd">取消</button>
          <button class="confirm-button" @click="confirmAdd">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import ProductItem from './ProductItem.vue'
import { getProducts, addProduct } from '../../API/api.js';

const products = ref([])
const selectedProduct = ref(null)
const showAddDialog = ref(false)
const newProductName = ref('')

// 加载产品数据
onMounted(async () => {
  await loadProducts()
})

const loadProducts = async () => {
  try {
    const prodRes = await getProducts();
    products.value = prodRes.products;
  } catch (error) {
    console.error('加载产品列表失败:', error);
    products.value = [];
  }
}

// 添加新产品
const confirmAdd = async () => {
  if (!newProductName.value.trim()) {
    alert('请输入产品名称')
    return
  }

  try {
    const response = await addProduct({
      product_name: newProductName.value
    })
    showAddDialog.value = false
    newProductName.value = ''
    location.reload()
  } catch (error) {
    console.error('添加产品失败:', error)
    alert('添加产品失败，请重试')
  }
}

const cancelAdd = () => {
  showAddDialog.value = false
  newProductName.value = ''
}

const emit = defineEmits(['select-selected'])
// 选择产品

const selectProduct = (productId) => {
  selectedProduct.value = productId
  emit('product-selected', productId)
}

</script>

<style scoped>
.sidebar-container {
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 20px;
  width: 15%;
  min-height: calc(80vh - 100px);
  /* 计算可用高度 */
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 0px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  margin-top: 40px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #333;
  font-family: PangMenZhengDao;
}

.product-scroll {
  flex: 1;
  margin: 15px 0;
  overflow-y: auto;
  max-height: calc(100vh - 370px);
}

.product-scroll>* {
  margin-bottom: 5px;
  /* 调整 ProductItem 之间的间距 */
}

.product-scroll::-webkit-scrollbar {
  width: 4px;
  /* 滚动条宽度 */
}

.product-scroll::-webkit-scrollbar-track {
  background: #ffffff;
  border-radius: 4px;
}

.product-scroll::-webkit-scrollbar-thumb {
  background: #146AF499;
  border-radius: 1px;
}

.product-scrollt::-webkit-scrollbar-thumb:hover {
  background: #146AF488;
}

.add-button {
  background: linear-gradient(45deg, #146AF4, #88C3FF);
  color: white;
  padding: 16px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.9em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin: 20px auto;
  cursor: pointer;
  border: none;
  outline: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.add-button:hover {
  animation: pulse 0.5s ease-in-out infinite alternate;
  /* 悬停时播放动画 */
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  100% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
}

.total-card {
  background: linear-gradient(45deg, #146AF4, #88C3FF);
  color: white;
  padding: 16px;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
  font-size: 0.9em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 150px;
  text-align: left;
  box-shadow: inset -2px 2px 10px 2px #FFFFFF80;
}

.total-card .label {
  font-size: 14px;
  font-weight: 500;
  text-shadow: 2px 4px 4px rgba(0, 0, 0, 0.3);
  margin-left: 10px;
  font-family: OPlusSans 3.0;
}

.total-card .sub-label {
  font-size: 14px;
  font-weight: 400;
  text-shadow: 2px 4px 4px rgba(0, 0, 0, 0.3);
  margin-left: 10px;
  font-family: OPlusSans 3.0;
}

.total-card .value {
  font-size: 48px;
  font-weight: 700;
  text-shadow: 2px 4px 4px rgba(0, 0, 0, 0.3);
  margin-left: 10px;
  align-items: flex-end;
  font-family: Inter;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.add-product-dialog {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.add-product-dialog h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
}

.product-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  margin-bottom: 20px;
  transition: border-color 0.3s;
}

.product-input:focus {
  border-color: #146AF4;
  outline: none;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.cancel-button,
.confirm-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #eaeaea;
}

.confirm-button {
  background: linear-gradient(45deg, #146AF4, #88C3FF);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(20, 106, 244, 0.3);
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 106, 244, 0.4);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.add-product-dialog {
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.add-product-dialog h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.5em;
}

.product-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1em;
  margin-bottom: 20px;
  transition: border-color 0.3s;
}

.product-input:focus {
  border-color: #146AF4;
  outline: none;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.cancel-button,
.confirm-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #eaeaea;
}

.confirm-button {
  background: linear-gradient(45deg, #146AF4, #88C3FF);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(20, 106, 244, 0.3);
}

.confirm-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(20, 106, 244, 0.4);
}
</style>
