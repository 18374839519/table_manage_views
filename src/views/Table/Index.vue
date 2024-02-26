<template>
  <div>
    <el-form ref="form" :model="queryParam" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="表名称：">
            <el-input v-model.trim="queryParam.tableName" clearable placeholder="请输入表名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="表描述：">
            <el-input v-model.trim="queryParam.tableDesc" clearable placeholder="请输入表描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="表类型：">
            <el-select v-model.trim="queryParam.tableType" clearable placeholder="请选择表类型">
              <el-option v-for="(item, index) in tableTypeList" :key="index" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" align="right" style="height: 50px">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="searchPage">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="data-op-div">
      <el-button @click="createTable">创建表</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="tableName" label="表名称"></el-table-column>
      <el-table-column prop="tableDesc" label="表描述"></el-table-column>
      <el-table-column prop="tableType" label="表类型">
        <template #default="scope">
          {{ scope.row.tableType === 1 ? '系统表' : scope.row.tableType === 2 ? '业务表' : scope.row.tableType }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ scope.row.status === 1 ? '可用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="updateTable(scope.row)">修改</el-button>
          <el-button size="small" @click="viewTable(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-nation-div" v-if="total > 0">
      <span>共{{ total }}条数据</span>
      <el-pagination background layout="prev, pager, next" :total="total" @prev-click="prevClick" @next-click="nextClick" @current-change="currentChange" />
      <span>第{{ pageNo }}页，共{{ totalPage }}页</span>
    </div>
  </div>
  <update-table ref="updateTable" :record="record" @closeUpdateTable="closeUpdateTable"></update-table>
  <create-table ref="createTable" @closeCreateTable="closeCreateTable"></create-table>
  <table-detail ref="tableDetail" :record="record" @closeTableDetail="closeTableDetail"></table-detail>
</template>
<script>
import UpdateTable from '@/views/Table/UpdateTable.vue'
import { getTablesPage } from '@/api/Tables'
import CreateTable from '@/views/Table/CreateTable.vue'
import TableDetail from '@/views/Table/TableDetail.vue'

export default {
  components: {
    TableDetail,
    CreateTable,
    UpdateTable
  },
  data() {
    return {
      queryParam: {},
      tableData: [],
      tableTypeList: [
        { value: 1, label: '系统表' },
        { value: 2, label: '业务表' }
      ],
      total: 0,
      pageNo: 1,
      totalPage: 0,
      record: {}
    }
  },
  methods: {
    reset() {
      this.queryParam = {
        pageNo: 1
      }
      this.searchPage()
    },
    searchPage() {
      getTablesPage(this.queryParam).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data.rows
          this.total = res.data.totalRows
          this.pageNo = res.data.pageNo
          this.totalPage = res.data.totalPage
        }
      })
    },
    prevClick() {
      this.pageNo = this.pageNo - 1
      this.queryParam.pageNo = this.pageNo
      this.searchPage()
    },
    nextClick() {
      this.pageNo = this.pageNo + 1
      this.queryParam.pageNo = this.pageNo
      this.searchPage()
    },
    currentChange(val) {
      this.pageNo = val
      this.queryParam.pageNo = this.pageNo
      this.searchPage()
    },
    createTable() {
      this.$refs.createTable.visible = true
    },
    closeCreateTable() {
      this.$refs.createTable.visible = false
      this.queryParam.pageNo = 1
      this.searchPage()
    },
    updateTable(row) {
      this.record = row
      this.$refs.updateTable.visible = true
    },
    viewTable(row) {
      this.record = row
      this.$refs.tableDetail.visible = true
    },
    closeTableDetail() {
      this.$refs.tableDetail.visible = false
    },
    closeUpdateTable() {
      this.$refs.updateTable.visible = false
      this.searchPage()
    }
  },
  mounted () {
    this.searchPage()
  }
}
</script>
