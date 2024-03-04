<template>
  <div>
    <el-empty description="暂无数据" v-if="tableData.length === 0" />
    <el-table :data="tableData" size="small" stripe style="width: 100%" v-if="tableData.length > 0">
      <el-table-column prop="columnName" label="字段名称"></el-table-column>
      <el-table-column prop="columnDesc" label="字段描述"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ scope.row.status === 1 ? '可用' : scope.row.status === 2 ? '禁用' : scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column prop="useCount" label="使用次数"></el-table-column>
      <el-table-column prop="useRate" label="使用率"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getColumnReportTop10 } from '@/api/Report'

export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    getColumnReportTop10() {
      getColumnReportTop10().then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data
        }
      })
    }
  },
  mounted () {
    this.getColumnReportTop10()
  }
}
</script>
