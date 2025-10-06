import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue' 
import ProductDetail from '../views/ProductDetail.vue'
import AdvancedFeatures from '../views/AdvancedFeatures.vue'
const routes = [
    // 添加路由配置
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/warning/:id',
        name: 'warning',
        component: ProductDetail
    },
    {
        path: '/ad_warning/:id',
        name: 'ad_warning',
        component: AdvancedFeatures
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
