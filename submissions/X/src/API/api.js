// api.js
import axios from 'axios';

const API_BASE_URL = 'http://10.190.74.78:8000/totruth';

// 创建 axios 实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * 获取产品列表
 * @returns {Promise<{products: Array}>} 适配后的产品数据
 */
export const getProducts = async () => {
    try {
        const response = await apiClient.get('/product/');
        const backendProducts = response.data.products;

        // 适配为前端格式
        const adaptedProducts = backendProducts.map(product => ({
            id: product.id,
            name: product.name,
            priority: mapPriority(product.priority) // 使用后端返回的优先级并映射为前端格式
        }));

        return { products: adaptedProducts };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

/**
 * 获取产品警告信息
 * @param {string} productName 产品名称
 * @returns {Promise<{warnings: Array}>} 适配后的警告数据
 */
export const getProductWarnings = async (productId, productName) => {
    try {
        const response = await apiClient.get(`/topic/?product_id=${productId}`);
        const backendTopics = response.data.topics;
        
        const productRes = await apiClient.get(`/product/`);
        const product = productRes.data.products.find(p => p.id == productId);
        if (!product) throw new Error('Product not found');

        // 适配为前端格式
        const adaptedWarnings = backendTopics.map(topic => ({
            id: `Pro_${productId}_${topic.id}`,
            topic: topic.content,
            product: product.name,
            priority: getPriorityFromScore(topic.alarm_score),
            date: formatDateB(topic.created_time)
        }));

        return { warnings: adaptedWarnings };
    } catch (error) {
        console.error('Error fetching product warnings:', error);
        throw error;
    }
  };

/**
 * 获取警告详情
 * @param {string} warningId
 * @returns {Promise<Object>} 适配后的警告详情
 */
export const getWarningDetail = async (warningId) => {
    try {
        // 从warningId中提取product_id和topic_id
        const [_, productId, topicId] = warningId.split('_');

        // 并行获取所有需要的数据
        const [productRes, topicRes, commentRes, scoreRes] = await Promise.all([
            apiClient.get(`/product/`),
            apiClient.get(`/topic/?product_id=${productId}`),
            apiClient.get(`/comment/?topic_id=${topicId}`),
            apiClient.get(`/score/?topic_id=${topicId}`)
        ]);

        // 查找对应的topic
        const topic = topicRes.data.topics.find(t => t.id == topicId);
        if (!topic) throw new Error('Topic not found');

        // 查找对应的product
        const product = productRes.data.products.find(p => p.id == productId);
        if (!product) throw new Error('Product not found');

        const comments = commentRes.data.comments;
        const scoreData = scoreRes.data;

        // 计算热点时间范围
        const hotspotTimeRange = calculateHotspotTimeRange(comments);

        // 计算最多评论来源
        const mostCommentsSource = calculateMostCommentsSource(comments);

        const platformCount = new Set(comments.map(c => c.source)).size;

        const infoFlowChart = topic.analyses.map(analysis => ({
            time: formatDateB(analysis.created_time),
            keyword: analysis.keyword
        }));

        // 构建infoFlowInterpretation
        const infoFlowInterpretation = topic.analyses.map(analysis => {
            return `${analysis.summary}\n关键词：${analysis.keyword}\n情感倾向：${analysis.emotion}`;
        }).join('\n');

        const turningPointAnalysis = topic.analyses.map(analysis => {
            return analysis.snap != '' ? `${formatChineseDate(analysis.created_time)}： \n ${analysis.snap}\n` : '';
        }).join('');

        const allCommentsText = comments.map(c => c.content).join(' ');
        // 构建返回数据
        return {
            warningInfo: {
                message: topic.content,
                product: product.name,
                priority: mapPriority(topic.priority),
                alertValue: Math.round(topic.alarm_score * 100),
                fileName: warningId,
                alertTime: formatDate(topic.created_time)
            },
            sentimentAnalysis: {
                fileName: warningId,
                image: "",
                comments: comments.map(c => c.content),
                cognitiveBias: (scoreData.subjectivity * 100).toFixed(0),
                emotionalTendency: (scoreData.polarity * 100).toFixed(0),
                dominantEmotion: [
                    Math.round(scoreData.emotions.sadness * 100),
                    Math.round(scoreData.emotions.joy * 100),
                    Math.round(scoreData.emotions.love * 100),
                    Math.round(scoreData.emotions.anger * 100),
                    Math.round(scoreData.emotions.fear * 100),
                    Math.round(scoreData.emotions.surprise * 100)
                ]
            },
            hotspotTracking: {
                fileName: warningId,
                infoFlowChart: infoFlowChart,
                infoFlowInterpretation,
                hotspotTimeRange,
                wordCloud: allCommentsText,
                turningPointAnalysis: `${turningPointAnalysis}`,
                relatedCommentsCount: `${comments.length}`,
                platformCount: `${platformCount}`,
                mostCommentsSource,
                singlePlatformMostComments: `${comments.filter(c => c.source === mostCommentsSource).length}`
            }
        };
    } catch (error) {
        console.error('Error fetching warning detail:', error);
        throw error;
    }
};

// 辅助函数：计算热点时间范围
function calculateHotspotTimeRange(comments) {
    if (!comments || comments.length === 0) return "Unknown";

    const dates = comments.map(c => new Date(c.created_time)).filter(d => !isNaN(d));
    if (dates.length === 0) return "Unknown";

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    return `${formatDateB(minDate)}\n-\n${formatDateB(maxDate)}`;
}

// 辅助函数：计算最多评论来源
function calculateMostCommentsSource(comments) {
    if (!comments || comments.length === 0) return "Unknown";

    const sourceCount = {};
    comments.forEach(c => {
        if (c.source) {
            sourceCount[c.source] = (sourceCount[c.source] || 0) + 1;
        }
    });

    return Object.entries(sourceCount).sort((a, b) => b[1] - a[1])[0][0];
}


// 辅助函数：格式化为中文日期
function formatChineseDate(dateString) {
    if (!dateString) return "未知日期";

    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}年${month}月${day}日`;
    } catch (e) {
        console.warn('Failed to parse date:', dateString);
        return "未知日期";
    }
}

// 辅助函数：格式化日期 (英文格式)
function formatDate(dateString) {
    if (!dateString) return "Unknown date";

    try {
        const date = new Date(dateString);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month}.${day} ${year}`;
    } catch (e) {
        console.warn('Failed to parse date:', dateString);
        return "Unknown date";
    }
}

function formatDateB(dateString) {
    if (!dateString) return "未知日期";

    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}.${month}.${day}`;
    } catch (e) {
        console.warn('Failed to parse date:', dateString);
        return "未知日期";
    }
}
  
// 辅助函数：映射优先级
function mapPriority(priority) {
    if (typeof priority === 'number') {
        if (priority >= 80) return "High";
        if (priority >= 50) return "Medium";
        return "Low";
    }
    return priority || "Medium";
  }

/**
 * 获取高级分析数据
 * @param {string} warningId 
 * @returns {Promise<Object>} 
 */
export const getAdvancedAnalysis = async (warningId) => {
    try {
        // 解析warningId格式：Pro_${product_id}_${topic.id}
        const [_, productId, topicId] = warningId.split('_');

        // 并行获取所有需要的数据
        const [topicRes, productRes, lawRes] = await Promise.all([
            apiClient.get(`/topic/?product_id=${productId}`),
            apiClient.get('/product/'),
            apiClient.get(`/law/?topic_id=${topicId}`)
        ]);

        // 查找对应的topic
        const topic = topicRes.data.topics.find(t => t.id.toString() === topicId);
        if (!topic) {
            throw new Error(`Topic with id ${topicId} not found`);
        }

        // 查找对应的product
        const product = productRes.data.products.find(p => p.id.toString() === productId);
        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }

        // 计算alertDuration（创建时间到现在的天数）
        const createdTime = new Date(topic.created_time);
        const now = new Date();
        const diffTime = Math.abs(now - createdTime);
        const alertDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + ' Days';

        // 格式化self_ad和other_ad
        const formatAdData = (adData) => {
            return Object.entries(adData)
                .map(([key, value]) => `${key}. ${value}`)
                .join('\n');
        };

        const formatLegalData = (lawData) => {
            const risks = lawData.legal_risks.join('\n');
            const suggestions = lawData.legal_suggestions.map(s =>
                `${s.reasoning}\n${s.suggestion}`
            ).join('\n');
            return `法律风险：\n ${risks} \n\n法律建议：\n ${suggestions} \n\n总结：\n${lawData.summary}`;
        };

        const infoFlowChart = topic.analyses.map(analysis => ({
            time: formatDateB(analysis.created_time),
            keyword: analysis.keyword
        }));

        let formatLegalText = "此问题暂时没有法律建议。";

        if (lawRes.data.message == "success") {
            formatLegalText = formatLegalData(lawRes.data);
        }

        return {
            warningInfo: {
                message: topic.content,
                product: product.name,
                priority: mapPriority(product.priority),
                alertDuration: alertDuration,
                fileName: warningId,
                alertTime: formatDate(topic.created_time)
            },
            deepForesight: {
                infoFlowChart: infoFlowChart,
                trend: topic.predict
            },
            lawChain: {
                detailresult: formatLegalText,
                legalsuggestions: lawRes.data.legal_suggestions,
                summary: lawRes.data.summary
            },
            tasteComparison: {
                companyProduct: formatAdData(product.self_ad),
                otherProduct: formatAdData(product.other_ad)
            }
        };
    } catch (error) {
        console.error('Error fetching advanced analysis:', error);
        throw error;
    }
};

// 辅助函数：格式化日期
function formatDateT(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
}

/**
 * 获取情感分析数据
 * @param {string} warningId 警告ID (如 "Pro_1000")
 * @returns {Promise<Object>} 适配后的情感分析数据
 */
export const getSentimentAnalysis = async (warningId) => {
    try {
        // 解析warningId格式：Pro_${product_id}_${topic.id}
        const [_, productId, topicId] = warningId.split('_');

        // 获取对应topic的评论数据
        const response = await apiClient.get(`/comment/?topic_id=${topicId}`);
        const comments = response.data.comments;

        // 处理情感数据
        const emotions = comments.map(comment => [
            1 + comment.emotion.sadness,
            1 - comment.emotion.sadness,
            1 + comment.emotion.love,
            1 - comment.emotion.love,
            1 + comment.emotion.fear,
            1 - comment.emotion.fear
        ]);

        // 处理subjectivity数据：(客观，中立，主观)
        const polarity = comments.map(comment => {
            const x = comment.score.polarity;
            return [
                0.05 + 0.85 * Math.pow(1 - x, 2) / 4,  // 消极
                0.05 + 0.85 * (1 - Math.pow(x, 2)) / 2, // 中立
                0.05 + 0.85 * Math.pow(1 + x, 2) / 4    // 积极
            ];
        });

        const subjectivity = comments.map(comment => {
            const x = comment.score.subjectivity;
            return [
                0.1 + 0.8 * (1 - x),                  // 客观
                0.1 + 0.8 * (1 - Math.abs(2 * x - 1)), // 中立
                0.1 + 0.8 * x                          // 主观
            ];
        });

        //console.log(polarity);

        return {
            emotion: emotions,
            polarity: polarity,
            subjectivity: subjectivity
        };
    } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
        throw error;
    }
};

// 辅助函数：根据报警分数获取优先级
function getPriorityFromScore(score) {
    if (score == 2) return "High";
    if (score == 1) return "Medium";
    return "Low";
}

export const addProduct = async (productData) => {
    try {
        const response = apiClient.post('/product/', productData);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const getLegalAdvice = async (topicId) => {
    try {
        const response = apiClient.post('/law/', {
            topic_id: topicId
        });
    } catch (error) {
        console.error('Error getting legal advice:', error);
        throw error;
    }
};
  
export default {
    getProducts,
    getProductWarnings,
    getWarningDetail,
    getAdvancedAnalysis,
    getSentimentAnalysis,
    addProduct,
    getLegalAdvice
};