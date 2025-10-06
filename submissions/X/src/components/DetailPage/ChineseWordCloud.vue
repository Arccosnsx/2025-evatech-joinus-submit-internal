<template>
    <div class="word-cloud-container">
        <div v-if="loading" class="loading">正在生成词云...</div>
        <svg v-else :width="width" :height="height" v-html="svgContent"></svg>
    </div>
</template>

<script>
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { Segment, useDefault } from 'segmentit';

const segmentit = useDefault(new Segment());

export default {
    name: 'ChineseWordCloud',
    props: {
        text: {
            type: String,
            required: true
        },
        width: {
            type: Number,
            default: 250
        },
        height: {
            type: Number,
            default: 150
        },
        maxWords: {
            type: Number,
            default: 100
        },
        colorRange: {
            type: Array,
            default: () => [
                '#8D61FF',
                '#594581',
                '#1467EB',
                '#75E1A8',
                '#88C3FF',
                '#FF6B6B'
            ]
        },
        fontSizeRange: {
            type: Array,
            default: () => [12, 72]
        },
        stopWords: {
            type: Array,
            default: () => ['的', '了', '和', '是', '在', '我', '有', '你', '他', '这', '那']
        }
    },
    data() {
        return {
            loading: false,
            words: [],
            svgContent: '', // 存储SVG内容
            segmentit: null // 存储分词器实例
        };
    },
    created() {
        // 初始化分词器（带默认词典）
        this.segmentit = useDefault(new Segment());
    },
    watch: {
        text: {
            immediate: true,
            handler() {
                this.processText();
            }
        }
    },
    methods: {
        async processText() {
            if (!this.text) return;

            this.loading = true;

            try {
                // 1. 使用segmentit进行中文分词
                const wordSegments = segmentit.doSegment(this.text, {
                    simple: true,
                    stripPunctuation: true
                });

                // 2. 过滤停用词和短词
                const filteredWords = wordSegments
                    .filter(word => word.length > 1) // 过滤单字
                    .filter(word => !this.stopWords.includes(word)); // 过滤停用词

                // 3. 统计词频
                const wordCount = {};
                filteredWords.forEach(word => {
                    wordCount[word] = (wordCount[word] || 0) + 1;
                });

                // 4. 转换为词云格式并排序
                const sortedWords = Object.keys(wordCount)
                    .map(word => ({
                        text: word,
                        size: wordCount[word]
                    }))
                    .sort((a, b) => b.size - a.size)
                    .slice(0, this.maxWords);

                // 5. 生成词云
                await this.generateWordCloud(sortedWords);
            } catch (error) {
                console.error('生成词云出错:', error);
            } finally {
                this.loading = false;
            }
        },
        generateWordCloud(words) {
            return new Promise((resolve) => {
                if (!words.length) {
                    resolve();
                    return;
                }

                // 创建一个临时的div来生成SVG内容
                const tempDiv = document.createElement('div');
                const tempSvg = d3.select(tempDiv)
                    .append('svg')
                    .attr('width', this.width)
                    .attr('height', this.height);

                // 设置大小比例尺
                const sizeScale = d3.scaleLinear()
                    .domain([d3.min(words, d => d.size), d3.max(words, d => d.size)])
                    .range(this.fontSizeRange);

                // 使用d3-cloud布局
                cloud()
                    .size([this.width, this.height])
                    .words(words.map(d => ({ ...d, size: Number(d.size) }))) // 确保size是数字
                    .padding(5)
                    .rotate(0)
                    .fontSize(d => sizeScale(d.size))
                    .on('end', (cloudWords) => {
                        if (!cloudWords || cloudWords.length === 0) {
                            console.warn('No words to display');
                            return;
                        }

                        // 生成SVG内容
                        const g = tempSvg.append('g')
                            .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

                        g.selectAll('text')
                            .data(cloudWords)
                            .enter()
                            .append('text')
                            .style('font-size', d => `${d.size}px`)
                            .style('font-family', 'Microsoft YaHei, PingFang SC, sans-serif')
                            .style('fill', (d, i) => this.colorRange[i % this.colorRange.length])
                            .attr('text-anchor', 'middle')
                            .attr('transform', d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
                            .text(d => d.text);

                        // 获取SVG内部HTML内容
                        this.svgContent = g.node().parentNode.innerHTML;
                        resolve();
                    })
                    .start();
            });
        }
    }
};
</script>

<style scoped>
.word-cloud-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    min-height: 300px;
}

svg {
    background-color: #fdfdfd;
    border-radius: 8px;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 18px;
}
</style>
