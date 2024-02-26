<template>
  <el-dialog
    v-model="visible"
    title="添加表字段"
    width="60%"
    :before-close="handleClose"
    destroy-on-close
    :draggable="true"
  >
    <template #footer>
      <el-button type="primary" @click="addTableColumn">确认</el-button>
      <el-button style="margin-left: 12px" @click="handleClose">取消</el-button>
    </template>
    <el-form ref="form" :model="formData" label-width="120px">
      <el-row v-for="(item, index) in formData.columnList" :key="index" style="padding: 8px 0;">
        <el-col :span="4">
          <el-select v-model.trim="item.columnName" clearable placeholder="请选择字段" v-infinite-scroll="getColumns" @change="selectColumn($event, index)">
            <el-option v-for="(item2, index2) in columnList" :key="index2" :value="item2.columnName" :label="item2.columnName"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">{{ item.columnDesc }}</el-col>
        <el-col :span="4">{{ item.columnType === 'Number' ? '数字' : item.columnType === 'String' ? '字符串' : item.columnType === 'Date' ? '日期' : item.columnType === 'Blob' ? '文本' : item.columnType }}</el-col>
        <el-col :span="4">{{ item.columnLength === -1 ? '不限' : item.columnLength }}</el-col>
        <el-col :span="4">{{ item.primaryKey === 1 ? '是' : item.primaryKey === 2 ? '否' : item.primaryKey }}</el-col>
        <el-col :span="4">
          <a class="row-op-a" @click="addColumnRow">+</a>
          <a class="row-op-a" @click="removeColumnRow(index)" v-if="index > 0">-</a>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { getColumnPage } from '@/api/Column'
import { createTableColumn } from '@/api/Tables'

export default {
  props: {
    tableName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      formData: {
        columnList: []
      },
      columnList: [],
      queryParam: {
        pageNo: 1
      },
      allowScroll: true
    }
  },
  methods: {
    initColumns() {
      this.columnList = []
      getColumnPage(this.queryParam).then(res => {
        if (res && res.code === 200) {
          const rows = res.data.rows
          rows.forEach(item => {
            this.columnList.push(item)
          })
        }
      })
    },
    addTableColumn() {
      createTableColumn(this.formData).then(res => {
        if (res && res.code === 200) {
          this.$message.success('添加成功')
          this.handleClose()
        }
      })
    },
    getColumns() {
      if (!this.allowScroll) {
        return
      }
      this.queryParam.pageNo = this.queryParam.pageNo + 1
      getColumnPage(this.queryParam).then(res => {
        const rows = res.data.rows
        const pageSize = res.data.pageSize
        this.allowScroll = rows.length === pageSize
        rows.forEach(item => {
          this.columnList.push(item)
        })
      })
    },
    selectColumn(val, index) {
      const data = this.columnList.filter(item => {
        if (item.columnName === val) {
          return item
        }
        return null
      })
      if (data !== null) {
        this.formData.columnList[index] = data[0]
      }
    },
    addColumnRow() {
      const columnRow = {
        columnName: null,
        columnDesc: null,
        columnType: null,
        columnLength: null,
        primaryKey: null
      }
      this.formData.columnList.push(columnRow)
      this.allowScroll = true
    },
    removeColumnRow(index) {
      this.formData.columnList.splice(index, 1)
    },
    handleClose() {
      this.$emit('closeAddTableColumn')
    }
  },
  watch: {
    immediate: true,
    visible: {
      handler(val) {
        if (val) {
          this.formData.columnList = []
          this.formData.tableName = this.tableName
          const columnRow = {
            columnName: null,
            columnDesc: null,
            columnType: null,
            columnLength: null,
            primaryKey: null
          }
          this.formData.columnList.push(columnRow)
          this.initColumns()
        }
      }
    }
  }
}
</script>
