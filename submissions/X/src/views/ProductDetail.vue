<template>
  <div class="container">
    <!-- 顶部栏 -->
    <div class="header-card">
      <header class="header">
        <router-link to="/" class="back-button">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </router-link>
        <div class="header-text">警示详情</div>
        <div class="logo">
          <img src="/logo.svg" alt="Logo" class="logo" />
        </div>
      </header>
    </div>

    <!-- 主体内容 -->
    <main class="main-content">
      <div v-if="loading">加载中...</div>
      <div v-else class="dashboard">
        <!-- 第一行：警示信息和情感分析 -->
        <div class="row">
          <WarningSection :data="productData.warningInfo" />
          <SentimentSection :data="productData.sentimentAnalysis" />
        </div>

        <!-- 第二行：热点追踪 -->
        <div class="row">
          <HotspotSection :data="productData.hotspotTracking" />
        </div>
      </div>
    </main>

    <!-- 底部栏 -->
    <div class="footer-card">
      <footer class="footer">
        <div class="footer-content">
          <!-- <div class="footer-text">欲了解更多信息，请支付锁定费用</div> -->
          <router-link :to="`/ad_warning/${$route.params.id}`" class="footer-text">
            欲了解更多信息，请点此解锁
          </router-link>
          <img src="/Lock.svg" alt="欲了解更多信息，请点此解锁" class=".footer-icon" />
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import WarningSection from "../components/DetailPage/WarningSection.vue";
import SentimentSection from "../components/DetailPage/SentimentSection.vue";
import HotspotSection from "../components/DetailPage/HotspotSection.vue";
import { getWarningDetail } from "../API/api.js";

export default {
  components: {
    WarningSection,
    SentimentSection,
    HotspotSection,
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
        this.loading = true;
        this.error = null;

        const warningId = this.$route.params.id;

        const response = await getWarningDetail(warningId);
        this.productData = response;
      } catch (error) {
        console.error('Error fetching data:', error);
        this.error = '加载数据失败，请稍后重试';
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

.row {
  display: flex;
  gap: 1.5rem;
  align-items: stretch;
  /* 使子元素高度一致 */
}

.row> :first-child {
  flex: 1;
}

.row> :last-child {
  flex: 2.5;
}

.card-large {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

/* 底部栏卡片 */
.footer-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.footer-text {
  font-size: 20px;
  color: #000000;
  letter-spacing: 18%;
  line-height: 150%;
  font-weight: 400;
}

.footer-icon {
  display: inline-block;
}
</style>