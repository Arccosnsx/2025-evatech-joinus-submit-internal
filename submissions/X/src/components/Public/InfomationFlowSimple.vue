<template>
    <div ref="container" class="flow-container">
        <img alt="flow" src="../../../public/flow_background.png"
            style="height: auto; width: 100%; margin-top: 50px;" />
        <svg class="flow-chart" :width="svgWidth" :height="svgHeight">
            <!-- 时间轴 -->
            <g class="timeline">
                <line x1="25" y1="30" :x2="svgWidth - 25" y2="30" stroke="#000" stroke-width="2" />
                <!-- 时间刻度 -->
                <g v-for="(time, index) in uniqueTimes" :key="'time-' + index">
                    <text :x="getXPosition(index)" y="20" text-anchor="middle" font-size="12" fill="#000">
                        {{ time }}
                    </text>
                </g>
            </g>

            <!-- 关键词文字 -->
            <g class="keywords">
                <text v-for="(item, index) in processedData" :key="'keyword-' + index"
                    :x="getXPosition(getTimeIndex(item.time))" :y="getRandomYPosition(index)" text-anchor="middle"
                    font-size="14" fill="#fff" class="keyword-text" @mouseover="hoverKeyword(index)"
                    @mouseout="unhoverKeyword(index)">
                    {{ item.keyword }}
                </text>
            </g>
        </svg>
    </div>
</template>

<script>
export default {
    props: {
        infoFlowChart: {
            type: Array,
            required: true,
            default: () => []
        }
    },
    data() {
        return {
            svgWidth: 800,
            svgHeight: 100,
            yPositions: {}, // 存储每个关键词的随机Y位置
            hoverIndex: null // 当前悬停的关键词索引
        }
    },
    computed: {
        // 处理后的数据（每个时间点随机选一个关键词）
        processedData() {
            const timeGroups = {};

            // 按时间分组
            this.infoFlowChart.forEach(item => {
                if (!timeGroups[item.time]) {
                    timeGroups[item.time] = [];
                }
                timeGroups[item.time].push(item.keyword);
            });

            // 每个时间点随机选一个关键词
            return Object.keys(timeGroups).map(time => {
                const keywords = timeGroups[time];
                const randomIndex = Math.floor(Math.random() * keywords.length);
                //console.log(keywords[randomIndex])
                return {
                    time,
                    keyword: keywords[randomIndex].split(",")[Math.floor(Math.random() * keywords[randomIndex].split(",").length)]
                };
            });
        },
        // 获取所有唯一时间（去重后）
        uniqueTimes() {
            return [...new Set(this.processedData.map(item => item.time))];
        }
    },
    mounted() {
        this.initDimensions();
        window.addEventListener('resize', this.initDimensions);
        // 初始化随机Y位置
        this.initRandomPositions();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.initDimensions);
    },
    methods: {
        initDimensions() {
            if (this.$refs.container) {
                this.svgWidth = this.$refs.container.clientWidth;
                this.svgHeight = this.$refs.container.clientHeight;
            }
        },
        initRandomPositions() {
            // 为每个关键词生成随机Y位置（50-450之间）
            this.yPositions = this.processedData.reduce((acc, _, index) => {
                acc[index] = Math.floor(Math.random() * 35) + 100;
                return acc;
            }, {});
        },
        getTimeIndex(time) {
            return this.uniqueTimes.indexOf(time);
        },
        getXPosition(timeIndex) {
            // 均匀分布时间点
            const spacing = (this.svgWidth - 50) / (this.uniqueTimes.length );
            return timeIndex * spacing + 70;
        },
        getRandomYPosition(index) {
            return this.yPositions[index] || 200;
        },
        hoverKeyword(index) {
            this.hoverIndex = index;
        },
        unhoverKeyword(index) {
            if (this.hoverIndex === index) {
                this.hoverIndex = null;
            }
        }
    }
}
</script>

<style>
.flow-container {
    position: relative;
    width: 100%;
    height: 500px;
}

.flow-chart {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: all;
}

.timeline {
    font-size: 12px;
}

.keyword-text {
    cursor: pointer;
    font-weight: bold;
    transition: font-size 0.2s ease, font-weight 0.2s ease;
}

.keyword-text:hover {
    font-size: 18px;
    font-weight: bold;
}
</style>