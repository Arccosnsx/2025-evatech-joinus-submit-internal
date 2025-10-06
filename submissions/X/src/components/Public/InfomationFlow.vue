<template>
    <div ref="container" class="flow-container">
        <!-- <div v-if="loading" class="loading">数据加载中...</div> -->
        <img alt="flow" src="../../../public/flow.png" style="height: auto; width: 600px;margin-top: 50px;" />
    </div>
</template>

<script>
import * as d3 from 'd3';

// 定义情感级别颜色配置
const emotion_levels = [
    { color: '#ff6b6b' }, // 非常负面
    { color: '#ffd700' }, // 负面
    { color: '#d3d3d3' }, // 中性
    { color: '#87cefa' }, // 正面
    { color: '#32cd32' }  // 非常正面
];

export default {
    props: {
        If_id: {
            type: String,
            required: true
        }
    },

    data: () => ({
        loading: true,
        rawData: [], // 情感数据
        keywordData: [], // 关键词数据
        rawDataMap: {}, // 日期映射
        densityData: [], // 密度数据
        emotion_levels, // 注入颜色配置
        dimensions: {
            width: 0,
            height: 400,
            margin: { top: 40, right: 20, bottom: 100, left: 40 } // 增加底部边距以容纳关键词
        }
    }),

    async mounted() {
        await this.loadData();
        //this.initVis();
        window.addEventListener('resize', this.handleResize);
    },

    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },

    methods: {
        async loadData() {
            try {
                const response = await fetch(`/data/${this.If_id}_if.json`);
                const rawData = await response.json();

                // 分离情感数据和关键词数据
                this.rawData = rawData.filter(d => d.date); // 情感数据
                this.keywordData = rawData.find(d => d.keyword)?.keyword || []; // 关键词数据

                // 创建日期映射
                this.rawDataMap = this.rawData.reduce((acc, cur) => {
                    acc[cur.date] = cur;
                    return acc;
                }, {});


            } catch (error) {
                console.error('数据加载失败:', error);
            }
            this.loading = false;
        },
        initVis() {
            const { width, height, margin } = this.calculateDimensions();

            // 清除旧图表
            d3.select(this.$refs.container).select('svg').remove();

            // 创建基础画布
            this.svg = d3.select(this.$refs.container)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // 创建比例尺
            this.xScale = d3.scaleTime() // 确保 xScale 是时间比例尺
                .domain(d3.extent(this.rawData, d => new Date(d.date))) // 确保 domain 是日期范围
                .range([0, width]);

            this.densityData = this.calculateDensity(this.rawData);

            const yMax = d3.max(this.densityData, d => d.density);
            this.yScale = d3.scaleLinear()
                .domain([0, yMax])
                .range([height, 0])
                .nice();

            // 绘制密度基线
            const area = d3.area()
                .x(d => this.xScale(d.date))
                .y0(height)
                .y1(d => this.yScale(d.density))
                .curve(d3.curveMonotoneX);

            this.svg.append('path')
                .datum(this.densityData)
                .attr('fill', 'rgba(100, 150, 200, 0.2)')
                .attr('stroke', '#6496c8')
                .attr('stroke-width', 1)
                .attr('d', area);

            // 创建情感河流
            const stackGenerator = d3.stack()
                .keys(d3.range(5))
                .value((d, key) => {
                    const dateKey = d.date;
                    const dayData = this.rawDataMap[dateKey];
                    return (dayData?.emotions[key] || 0) * (d.density / yMax) * 1.2;
                });

            const series = stackGenerator(this.densityData);

            this.svg.selectAll('.emotion-layer')
                .data(series)
                .join('path')
                .attr('class', 'emotion-layer')
                .attr('fill', (d, i) => this.emotion_levels[i].color)
                .attr('d', d3.area()
                    .x(d => this.xScale(d.data.date))
                    .y0(d => this.yScale(d[0]))
                    .y1(d => this.yScale(d[1]))
                    .curve(d3.curveMonotoneX)
                )
                .style('mix-blend-mode', 'multiply');

            // 添加坐标轴
            const xAxis = d3.axisBottom(this.xScale)
                .ticks(d3.timeDay.every(3))
                .tickFormat(d3.timeFormat('%m/%d'));

            this.svg.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");

            const yAxis = d3.axisLeft(this.yScale)
                .ticks(5);

            this.svg.append('g')
                .call(yAxis)
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("密度值");

            // 渲染关键词
            this.renderKeywords();
        },
        calculateDensity(data) {
            const bandwidth = 2;
            // 使用 d3.contourDensity 计算密度
            const density = d3.contourDensity()
                .x(d => this.xScale(new Date(d.date))) // 将日期映射到 x 轴
                .y(d => 0) // y 轴固定为 0（单维度密度）
                .weight(d => 1) // 每个数据点的权重
                .bandwidth(bandwidth) // 带宽
                .size([this.dimensions.width, 1]); // 密度图尺寸
            // 生成密度数据
            const densityData = density(data);
            console.log(densityData);
            // 将密度数据转换为适合绘制的格式
            return densityData.map(d => ({
                date: this.xScale.invert(d.coordinates[0][0]), // 将 x 坐标转换回日期
                density: d.value // 密度值
            }));
        },

        calculateBandwidth(data) {
            const n = data.length;
            const std = d3.deviation(data.map(d => new Date(d.date).getTime()));
            return 1.06 * std * Math.pow(n, -1 / 5);
        },


        renderKeywords() {
            const { width, height, margin } = this.calculateDimensions();

            // 清除旧的关键词标注
            this.svg.selectAll('.keyword-group').remove();

            // 创建关键词比例尺
            const fontSizeScale = d3.scaleLinear()
                .domain([0, d3.max(this.keywordData, d => d.size)])
                .range([10, 24]); // 字体大小范围

            // 按日期分组关键词
            const keywordMap = d3.group(this.keywordData, d => d.date);

            // 渲染关键词
            this.densityData.forEach(d => {
                const dateKey = d.date;
                const keywords = keywordMap.get(dateKey);
                if (!keywords) return;

                const xPos = this.xScale(d.date);
                const baseY = height + 30; // 在图表下方显示

                const group = this.svg.append('g')
                    .attr('class', 'keyword-group')
                    .attr('transform', `translate(${xPos},${baseY})`);

                // 绘制连接线
                group.append('line')
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', -20)
                    .attr('y2', 0)
                    .attr('stroke', '#999')
                    .attr('stroke-width', 0.5);

                // 渲染关键词
                keywords.forEach((keyword, i) => {
                    group.append('text')
                        .text(keyword.text)
                        .attr('x', 0)
                        .attr('y', i * 20)
                        .attr('font-size', fontSizeScale(keyword.size))
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#333')
                        .style('cursor', 'pointer')
                        .on('mouseover', function () {
                            d3.select(this)
                                .transition()
                                .attr('fill', '#000')
                                .attr('font-weight', 'bold');
                        })
                        .on('mouseout', function () {
                            d3.select(this)
                                .transition()
                                .attr('fill', '#333')
                                .attr('font-weight', 'normal');
                        });
                });
            });
        },

        calculateDimensions() {
            const containerWidth = this.$refs.container.clientWidth;
            return {
                width: containerWidth - this.dimensions.margin.left - this.dimensions.margin.right,
                height: 400,
                margin: { top: 40, right: 20, bottom: 100, left: 40 }
            };
        },

        handleResize() {
            d3.select(this.$refs.container).select('svg').remove();
            this.initVis();
        }
    }
};
</script>

<style>
.flow-container {
    position: relative;
    width: 100%;
    height: 500px;
}

.loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    color: #666;
}

.keyword-group text {
    transition: all 0.2s ease;
    pointer-events: all;
}

.keyword-group:hover text {
    opacity: 1 !important;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

.keyword-group line {
    stroke-dasharray: 2, 2;
    opacity: 0.6;
}

.keyword-tooltip {
    position: absolute;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
}
</style>