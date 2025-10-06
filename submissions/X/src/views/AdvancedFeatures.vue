<template>
  <div class="container">
    <!-- 顶部栏 -->
    <div class="header-card">
      <header class="header">
        <router-link to="/" class="back-button">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <div class="header-text">高级功能</div>
        <div class="logo">
          <img src="/logo.svg" alt="Logo" class="logo" />
        </div>
      </header>
    </div>

    <!-- 主体内容 -->
    <main class="main-content">
      <div v-if="loading">加载中...</div>
      <div v-else class="dashboard">
        <div class="row-1">
          <WarningSection :data="productData.warningInfo" />
          <DeepForesight :data="productData.deepForesight" />
        </div>

        <!-- 第二行：热点追踪 -->
        <div class="row-2">
          <LawChain :data="productData.lawChain" />
          <TasteComparison :data="productData.tasteComparison" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import WarningSection from "../components/AdvancedPage/WarningSection.vue";
import DeepForesight from "../components/AdvancedPage/DeepForesight.vue";
import LawChain from "../components/AdvancedPage/LawChain.vue";
import TasteComparison from "../components/AdvancedPage/TasteComparison.vue";
import { getAdvancedAnalysis } from "../API/api.js"

export default {
  components: {
    WarningSection,
    DeepForesight,
    LawChain,
    TasteComparison
  },
  data() {
    return {
      loading: true,
      productData: null,
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const warningId = this.$route.params.id; // 获取路由参数中的 id
        const analysisData = await getAdvancedAnalysis(warningId);
        this.productData = analysisData;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 全局样式 */
.container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

/* 顶部栏卡片 */
.header-card {
  background: #3E67C7;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  margin-left: 40px;
  transform: scale(2.5);
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

.header-text {
  color: white;
  font-size: 40px;
  text-align: left;
  margin-left: 10px;
  font-family: Microsoft JhengHei UI;
  letter-spacing: 8px;
  font-weight: 700;
}

.logo {
  font-weight: bold;
  margin-left: auto;
  margin-right: 10px;
  width: 200px;
  height: auto;
}

/* 主体内容 */
.main-content {
  flex: 1;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.row-1 {
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
  /* 使子元素高度一致 */
}

.row-1> :first-child {
  flex: 1;
}

.row-1> :last-child {
  flex: 2.5;
}

.row-2 {
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
  /* 使子元素高度一致 */
}

.card-large {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
</style>