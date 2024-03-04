<template>
  <div>
    <div class="report-total-div">
      <div>
        <span>总表数：</span>
        <span class="total-span">{{ tableCount }}</span>
      </div>
      <div>
        <span>总字段数：</span>
        <span class="total-span">{{ columnCount }}</span>
      </div>
    </div>
    <div class="report-view-div">
      <div class="report-view-card-div">
        <div class="report-view-card-heard-div">
          <div class="report-view-card-title-div">字段使用统计-TOP10</div>
          <div class="report-view-card-op-div">
            <a href="javascrip:void(0)">更多</a>
          </div>
        </div>
        <div>
          <column-count-card ref="ColumnCountCard"></column-count-card>
        </div>
      </div>
      <div class="report-view-card-div">
        <div class="report-view-card-heard-div">
          <div class="report-view-card-title-div">字段类型占比</div>
        </div>
        <div>
          <column-type-rate ref="ColumnTypeRate"></column-type-rate>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTableColumnCount } from '@/api/Report'
import ColumnCountCard from '@/views/DataViews/ColumnCountCard.vue'
import ColumnTypeRate from '@/views/DataViews/ColumnTypeRate.vue'

export default {
  components: {
    ColumnTypeRate,
    ColumnCountCard
  },
  data() {
    return {
      tableCount: 0,
      columnCount: 0
    }
  },
  methods: {
    getTableColumnCount() {
      getTableColumnCount().then(res => {
        if (res && res.code === 200) {
          this.tableCount = res.data.tableCount
          this.columnCount = res.data.columnCount
        }
      })
    }
  },
  mounted () {
    this.getTableColumnCount()
  }
}
</script>
<style>
.report-total-div {
  display: flex;
  padding: 12px 0 12px 1.65%;
  border-bottom: #d4dada 1px solid;
}
.total-span {
  margin-right: 200px;
  text-align: left;
  font-weight: bolder;
}
.report-view-div {
  display: flex;
}
.report-view-card-div {
  width: 30%;
  height: 300px;
  margin: 20px 1.65% 0;
  border: #d4dada 1px solid;
  border-radius: 5px;
  overflow: auto;
}
.report-view-card-heard-div {
  display: flex;
  border-bottom: #d4dada 1px solid;
  padding: 5px 2px;
}
.report-view-card-title-div {
  width: 50%;
  text-align: left;
  font-weight: bolder;
  font-size: 14px;
}
.report-view-card-op-div {
  width: 50%;
  text-align: right;
  padding-right: 20px;
}
</style>
