<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="60%"
    :before-close="handleClose"
    destroy-on-close
    :draggable="true"
  >
    <template #footer>
      <el-button style="margin-left: 12px" @click="handleClose">关闭</el-button>
    </template>
    <el-form ref="form" :model="formData" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="表名称：">{{ formData.tableName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表描述：">{{ formData.tableDesc }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表类型：">{{ formData.tableType === 1 ? '系统表' : formData.tableType === 2 ? '业务表' : formData.tableType }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态：">{{ formData.status === 1 ? '可用' : formData.status === 2 ? '禁用' : formData.status }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="操作：">
            <el-button size="small" @click="viewDdl">DDL</el-button>
            <el-button size="small" @click="viewDml" style="margin-left: 12px;">DML</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="data-op-div">
      <el-button @click="addTableColumn">添加</el-button>
    </div>
    <el-table :data="formData.tableData" stripe style="width: 100%">
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
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :title="delTitle" @confirm="delConfirm">
            <template #reference>
              <el-button size="small" @click="delTableColumn(scope.row)">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <add-table-column ref="addTableColumn" :tableName="record.tableName" @closeAddTableColumn="closeAddTableColumn"></add-table-column>
    <view-info ref="viewInfo" :tableName="record.tableName" :viewType="viewType" @closeViewInfo="closeViewInfo"></view-info>
  </el-dialog>
</template>
<script>
import { delTableColumn, getTableDetail } from '@/api/Tables'
import AddTableColumn from '@/views/Table/AddTableColumn.vue'
import ViewInfo from '@/views/Table/ViewInfo.vue'

export default {
  components: { ViewInfo, AddTableColumn },
  props: {
    record: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      visible: false,
      title: null,
      formData: {
        tableName: null,
        tableDesc: null,
        tableType: null,
        status: null,
        tableData: []
      },
      delTitle: null,
      delRow: {},
      viewType: null
    }
  },
  methods: {
    initTableColumn() {
      getTableDetail(this.record.tableName).then(res => {
        if (res && res.code === 200) {
          this.formData.tableData = res.data.columnList
        }
      })
    },
    handleClose() {
      this.$emit('closeTableDetail')
    },
    addTableColumn() {
      this.$refs.addTableColumn.visible = true
    },
    closeAddTableColumn() {
      this.initTableColumn()
      this.$refs.addTableColumn.visible = false
    },
    delTableColumn(row) {
      this.delRow = row
      this.delTitle = '确认删除该表字段？该操作不可撤销'
    },
    delConfirm() {
      const param = this.record.tableName + '/' + this.delRow.columnName
      delTableColumn(param).then(res => {
        if (res && res.code === 200) {
          this.$message.success('删除成功')
          this.initTableColumn()
        }
      })
    },
    viewDdl() {
      this.viewType = 'DDL'
      this.$refs.viewInfo.visible = true
    },
    viewDml() {
      this.viewType = 'DML'
      this.$refs.viewInfo.visible = true
    },
    closeViewInfo() {
      this.$refs.viewInfo.visible = false
    }
  },
  watch: {
    immediate: true,
    visible: {
      handler(val) {
        if (val) {
          this.initTableColumn()
          this.title = '【' + this.record.tableName + '】表详情'
          this.formData = this.record
          this.formData.tableData = []
        }
      }
    }
  }
}
</script>
