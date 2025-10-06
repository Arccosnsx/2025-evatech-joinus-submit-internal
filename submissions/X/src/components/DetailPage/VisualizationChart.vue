<template>
    <div class="container">
        <svg ref="svg" :width="size" :height="size"></svg>
    </div>
</template>

<script>
import { getSentimentAnalysis } from '../../API/api.js'; 

export default {
    props: {
        St_id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            size: 250,         // SVG尺寸
            baseRadius: 90,    // 基础外接圆半径
            colors: {           // 颜色配置
                polarity: '#e4f0e6',
                subjectivity: '#388fe3',
                emotion: '#fbb197'
            },
            rawData: null
        }
    },
    watch: {
        St_id: {
            immediate: true,
            handler() {
                this.loadData().then(() => this.drawVisualization())
            }
        }
    },
    methods: {
        // 数据加载方法
        async loadData() {
            try {
                const sentimentData = await getSentimentAnalysis(this.St_id)
                this.rawData = {
                    emotion: sentimentData.emotion,
                    polarity: sentimentData.polarity,
                    subjectivity: sentimentData.subjectivity
                };
                this.dataLoaded = true;
            } catch (error) {
                console.error('数据加载失败:', error)
                this.dataLoaded = false;
            }
        },

        // 核心绘制方法
        drawVisualization() {
            const svg = this.$refs.svg
            svg.innerHTML = '' // 清空SVG内容
            if (!this.dataLoaded || !this.rawData) {
                this.drawPlaceholder(svg);
                return;
            }
            // 计算中心点
            const center = { x: this.size / 2, y: this.size / 2 }

            // 绘制基础外接圆
            this.drawBaseCircle(svg, center)
            this.drawRadialLines(svg, center)
            // 生成所有点坐标
            const points = {
                polarity: this.process3DData(this.rawData.polarity),
                subjectivity: this.process3DData(this.rawData.subjectivity),
                emotion: this.process6DData(this.rawData.emotion)
            }

            // 绘制多边形框架
            this.drawPolygon(svg, center, 3) // 三角形
            this.drawPolygon(svg, center, 6) // 六边形

            // 绘制点云
            this.drawPointCloud(svg, points)

            // 绘制扇形统计
            this.drawRadialStats(svg, center, points)
        },

        // 三维数据转换（三角形）
        process3DData(data) {
            return data.map(scores => {
                const total = scores.reduce((a, b) => a + b, 0)
                const normalized = scores.map(v => v / total * this.baseRadius * 3 / 2)
                return this.convertToTriangleCoord(normalized)
            })
        },

        // 六维数据转换（六边形）
        process6DData(data) {
            return data.map(scores => {
                const total = scores.reduce((a, b) => a + b, 0)
                const normalized = scores.map(v => v / total * this.baseRadius * 3 * Math.sqrt(3))
                return this.convertToHexagonCoord(normalized)
            })
        },

        convertToTriangleCoord(weights) {
            const y = weights[2] - this.baseRadius / 2
            const x = (-3 * this.baseRadius / 2 + weights[2] + 2 * weights[1]) / Math.sqrt(3)

            return {
                x: this.size / 2 - x,
                y: this.size / 2 - y
            }
        },

        // 六边形坐标转换算法
        convertToHexagonCoord(weights) {
            const x = -weights[0] + this.baseRadius / 2 * Math.sqrt(3)
            const y = this.baseRadius - (x + 2 * weights[1]) / Math.sqrt(3)

            return {
                x: this.size / 2 + x,
                y: this.size / 2 - y
            }
        },

        // 绘制基础外接圆
        drawBaseCircle(svg, center) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            circle.setAttribute('cx', center.x)
            circle.setAttribute('cy', center.y)
            circle.setAttribute('r', this.baseRadius)
            circle.setAttribute('stroke', '#628ee055')
            circle.setAttribute('stroke-width', 2)
            circle.setAttribute('fill', 'none')
            svg.appendChild(circle)
        },

        // 绘制多边形框架
        drawPolygon(svg, center, sides) {
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
            const points = []
            const radius = this.baseRadius

            for (let i = 0; i < sides; i++) {
                const angle = i * 2 * Math.PI / sides - Math.PI / 2
                const x = center.x + radius * Math.cos(angle)
                const y = center.y + radius * Math.sin(angle)
                points.push(`${x},${y}`)
            }

            polygon.setAttribute('points', points.join(' '))
            polygon.setAttribute('stroke', '#628ee099')
            polygon.setAttribute('stroke-width', 1)
            polygon.setAttribute('fill', 'none')
            svg.appendChild(polygon)
        },

        // 绘制点云
        drawPointCloud(svg, points) {
            Object.entries(points).forEach(([type, coords]) => {
                coords.forEach(p => {
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
                    circle.setAttribute('cx', p.x)
                    circle.setAttribute('cy', p.y)
                    circle.setAttribute('r', 2)
                    circle.setAttribute('fill', this.colors[type])
                    circle.setAttribute('stroke', '#347dcc')
                    circle.setAttribute('stroke-width', 1)
                    svg.appendChild(circle)
                })
            })
        },

        drawRadialLines(svg, center) {
            const numLines = 36 // 射线数量，每10度一条
            const lineLength = this.baseRadius // 射线长度，略大于外接圆半径
            const lineColor = '#96c8fe66' // 射线颜色，较淡

            for (let i = 0; i < numLines; i++) {
                const angle = (i * 10) * Math.PI / 180 // 每10度一条射线
                const x1 = center.x
                const y1 = center.y
                const x2 = center.x + lineLength * Math.cos(angle)
                const y2 = center.y + lineLength * Math.sin(angle)

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
                line.setAttribute('x1', x1)
                line.setAttribute('y1', y1)
                line.setAttribute('x2', x2)
                line.setAttribute('y2', y2)
                line.setAttribute('stroke', lineColor)
                line.setAttribute('stroke-width', 1)
                svg.appendChild(line)
            }
        },

        // 绘制径向统计
        drawRadialStats(svg, center, points) {
            const sectorAngle = 10; // 每个扇区的角度
            const maxBarHeight = 15; // 最大高度
            const stats = this.calculateSectorStats(points, sectorAngle);
            const sectorHight = new Array(360 / sectorAngle).fill(0);

            Object.entries(stats).forEach(([type, counts]) => {
                const maxCount = Math.max(...counts);
                counts.forEach((count, sector) => {
                    const height = (count / maxCount) * maxBarHeight;
                    const startAngle = (sector * sectorAngle) * Math.PI / 180;
                    const endAngle = ((sector + 1) * sectorAngle) * Math.PI / 180;

                    const typeIndex = ['polarity', 'subjectivity', 'emotion'].indexOf(type);
                    const outerRadius = this.baseRadius + sectorHight[sector]+height+1; // 增加层间距
                    const innerRadius = this.baseRadius + sectorHight[sector]+1;

                    const x1 = center.x + innerRadius * Math.cos(startAngle);
                    const y1 = center.y - innerRadius * Math.sin(startAngle);
                    const x2 = center.x + outerRadius * Math.cos(startAngle);
                    const y2 = center.y - outerRadius * Math.sin(startAngle);
                    const x3 = center.x + outerRadius * Math.cos(endAngle);
                    const y3 = center.y - outerRadius * Math.sin(endAngle);
                    const x4 = center.x + innerRadius * Math.cos(endAngle);
                    const y4 = center.y - innerRadius * Math.sin(endAngle);

                    const d = `M ${x1} ${y1} 
                    L ${x2} ${y2} 
                    A ${outerRadius} ${outerRadius} 0 0 0 ${x3} ${y3} 
                    L ${x4} ${y4} 
                    A ${innerRadius} ${innerRadius} 0 0 1 ${x1} ${y1} Z`;

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', d);
                    path.setAttribute('fill', this.colors[type]);
                    if (count != 0) {
                        path.setAttribute('stroke', '#5890ed'); // 添加边框颜色
                        path.setAttribute('stroke-width', '0.5'); // 设置边框粗细
                        path.setAttribute('stroke-linejoin', 'round'); // 优化边框连接
                        path.setAttribute('stroke-linecap', 'round'); // 优化边框端点
                    }
                    else {
                        path.setAttribute('stroke', 'none'); // 添加边框颜色
                    }
                    sectorHight[sector] += height;
                    svg.appendChild(path);
                });
            });

            // 更新外层圆环半径计算
            const typesCount = 3;
            const outerRadius = this.baseRadius + typesCount * 10;
            const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            outerCircle.setAttribute('cx', center.x);
            outerCircle.setAttribute('cy', center.y);
            outerCircle.setAttribute('r', outerRadius);
            outerCircle.setAttribute('stroke', '#eaeef7');
            outerCircle.setAttribute('stroke-width', 1);
            outerCircle.setAttribute('fill', 'none');
            svg.appendChild(outerCircle);
        },

        // 统计扇形区数据
        calculateSectorStats(points, sectorAngle) {
            const sectorsCount = 360 / sectorAngle;
            const stats = {
                polarity: new Array(sectorsCount).fill(0),
                subjectivity: new Array(sectorsCount).fill(0),
                emotion: new Array(sectorsCount).fill(0)
            };

            Object.entries(points).forEach(([type, coords]) => {
                //console.log(`Processing points for type: ${type}`);
                coords.forEach(p => {
                    // 修正坐标系转换
                    const dx = p.x - this.size / 2;
                    const dy = this.size / 2 - p.y; // Y轴方向修正

                    // 计算角度（0-360度）
                    const radian = Math.atan2(dy, dx);
                    let angle = radian * 180 / Math.PI;
                    if (angle < 0) angle += 360; // 将角度标准化到0-360度

                    // 计算扇区索引
                    const sector = Math.floor(angle / sectorAngle) % sectorsCount;
                    stats[type][sector]++;
                });
            });

            //console.log(stats); // 调试输出
            return stats;
        },
        drawPlaceholder(svg) {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', this.size / 2);
            text.setAttribute('y', this.size / 2);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', '#999');
            text.setAttribute('font-size', '16px');
            text.textContent = '暂无数据';
            svg.appendChild(text);
        },
        drawLine(svg, start, end, color, width) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', start.x);
            line.setAttribute('y1', start.y);
            line.setAttribute('x2', end.x);
            line.setAttribute('y2', end.y);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', width);
            svg.appendChild(line);
        },
        drawText(svg, position, text, color, fontSize) {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('x', position.x);
            textElement.setAttribute('y', position.y);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.setAttribute('fill', color);
            textElement.setAttribute('font-size', fontSize);
            textElement.textContent = text;
            svg.appendChild(textElement);
        },
        drawTestPoints(svg) {
            // 测试点：0度、45度、90度、180度、270度
            const testAngles = [0, 45, 90, 180, 270];
            testAngles.forEach(deg => {
                const angle = deg * Math.PI / 180;
                const point = {
                    x: this.center.x + this.radius * Math.cos(angle),
                    y: this.center.y - this.radius * Math.sin(angle)
                };
                this.drawCircle(svg, point, 5, '#f00', 1, '#f00');
                this.drawText(svg, { x: point.x + 10, y: point.y }, `${deg}°`, '#f00', 12);
            });
        }
    }
}
</script>

<style scoped>
.container {
    margin-top: 13%;
}

svg {
    border-radius: 8px;
}
</style>