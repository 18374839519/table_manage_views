<template>
  <div>
    <div id="main" style="height: 240px; width: 90%; padding-top: 8px;"></div>
  </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  methods: {
    initData() {
      const chartDom = document.getElementById('main')
      const myChart = echarts.init(chartDom)
      const option = {
        title: {
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '80%',
            data: [
              { value: 1048, name: '数字' },
              { value: 735, name: '字符串' },
              { value: 102, name: '时间' },
              { value: 6, name: '文本' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>
