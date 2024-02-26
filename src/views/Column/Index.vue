<template>
  <div>
    <el-form ref="form" :model="queryParam" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="字段名称：">
            <el-input v-model.trim="queryParam.columnName" clearable placeholder="请输入字段名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="字段描述：">
            <el-input v-model.trim="queryParam.columnDesc" clearable placeholder="请输入字段描述"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="searchPage">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="data-op-div">
      <el-button @click="addColumn">添加</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="columnName" label="字段名称"></el-table-column>
      <el-table-column prop="columnDesc" label="字段描述"></el-table-column>
      <el-table-column prop="columnType" label="字段类型">
        <template #default="scope">
          {{ scope.row.columnType === 'Number' ? '数字' : scope.row.columnType === 'String' ? '字符串' : scope.row.columnType === 'Date' ? '日期' : scope.row.columnType === 'Blob' ? '文本' : scope.row.columnType}}
        </template>
      </el-table-column>
      <el-table-column prop="columnLength" label="字段长度">
        <template #default="scope">
          {{ scope.row.columnLength === -1 ? '不限' : scope.row.columnLength }}
        </template>
      </el-table-column>
      <el-table-column prop="primaryKey" label="是否主键">
        <template #default="scope">
          {{ scope.row.primaryKey === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          {{ scope.row.status === 1 ? '可用' : scope.row.status === 2 ? '禁用' : scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="updateColumn(scope.row)">修改</el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :title="delTitle" @confirm="delConfirm">
            <template #reference>
              <el-button size="small" @click="deleteColumn(scope.row)" style="margin-left: 12px">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-nation-div" v-if="total > 0">
      <span>共{{ total }}条数据</span>
      <el-pagination background layout="prev, pager, next" :total="total" @prev-click="prevClick" @next-click="nextClick" @current-change="currentChange" />
      <span>第{{ pageNo }}页，共{{ totalPage }}页</span>
    </div>
  </div>
  <add-or-update ref="addOrUpdate" :isAdd="isAdd" :record="record" @closeAddOrUpdate="closeAddOrUpdate"></add-or-update>
</template>
<script>
import { getColumnPage, deleteColumnById } from '@/api/Column'
import AddOrUpdate from '@/views/Column/AddOrUpdate.vue'

export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      queryParam: {
        pageNo: 1
      },
      tableData: [],
      total: 0,
      isAdd: true,
      record: {},
      pageNo: 1,
      totalPage: 0,
      delTitle: null,
      delRowId: null
    }
  },
  methods: {
    searchPage() {
      getColumnPage(this.queryParam).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.data.rows
          this.total = res.data.totalRows
          this.pageNo = res.data.pageNo
          this.totalPage = res.data.totalPage
        }
      })
    },
    reset() {
      this.queryParam = {
        pageNo: 1
      }
      this.searchPage()
    },
    addColumn() {
      this.isAdd = true
      this.$refs.addOrUpdate.visible = true
    },
    updateColumn(row) {
      this.isAdd = false
      this.record = row
      this.$refs.addOrUpdate.visible = true
    },
    closeAddOrUpdate() {
      this.$refs.addOrUpdate.visible = false
      if (this.isAdd) {
        this.queryParam = {
          pageNo: 1
        }
      }
      this.searchPage()
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
    deleteColumn(row) {
      this.delRowId = row.id
      this.delTitle = '确定删除字段' + row.columnName + '？该操作不可撤销'
    },
    delConfirm() {
      deleteColumnById(this.delRowId).then(res => {
        if (res && res.code === 200) {
          this.$message.success('删除成功')
          this.queryParam = {
            pageNo: 1
          }
          this.searchPage()
        }
      })
    }
  },
  mounted () {
    this.searchPage()
  }
}
</script>
