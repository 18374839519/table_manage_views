<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-sub-menu index="1">
        <template #title>工作台</template>
        <el-menu-item index="1-1">数据概览</el-menu-item>
        <el-sub-menu>
          <template #title>基础数据</template>
          <el-menu-item index="1-2-1">字段管理</el-menu-item>
          <el-menu-item index="1-2-2">表管理</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </div>
  <DataViews v-if="activeIndex === '1-1'"></DataViews>
  <Column v-if="activeIndex === '1-2-1'"></Column>
  <Table v-if="activeIndex === '1-2-2'"></Table>
</template>

<script>
import DataViews from '@/views/DataViews/Index.vue'
import Column from '@/views/Column/Index.vue'
import Table from '@/views/Table/Index.vue'
export default {
  components: {
    DataViews,
    Column,
    Table
  },
  data() {
    return {
      activeIndex: '1-1'
    }
  },
  methods: {
    handleSelect(val) {
      this.activeIndex = val
    }
  }
}
</script>
